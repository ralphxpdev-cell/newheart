-- ============================================
-- 새마음건축 V2 마이그레이션
-- 인력 관리, 출퇴근 관리 추가
-- ============================================

-- ============================================
-- 1. WORKERS 테이블 (인력 관리)
-- ============================================
CREATE TABLE IF NOT EXISTS workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- 직책: 현장소장, 전기, 설비, 목공, 타일, 도배 등
  phone TEXT,
  team TEXT, -- 소속팀
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  hourly_rate DECIMAL(10, 2), -- 시급
  daily_rate DECIMAL(10, 2), -- 일급
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_workers_owner ON workers(owner_id);
CREATE INDEX idx_workers_status ON workers(status);
CREATE INDEX idx_workers_role ON workers(role);

ALTER TABLE workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workers"
  ON workers FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own workers"
  ON workers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own workers"
  ON workers FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own workers"
  ON workers FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 2. ATTENDANCE 테이블 (출퇴근 관리)
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  work_date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIME,
  check_out TIME,
  work_hours DECIMAL(4, 2), -- 근무 시간
  overtime_hours DECIMAL(4, 2) DEFAULT 0, -- 초과 근무
  status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half_day', 'leave')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(worker_id, work_date)
);

CREATE INDEX idx_attendance_project ON attendance(project_id);
CREATE INDEX idx_attendance_worker ON attendance(worker_id);
CREATE INDEX idx_attendance_date ON attendance(work_date DESC);
CREATE INDEX idx_attendance_owner ON attendance(owner_id);

ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance"
  ON attendance FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own attendance"
  ON attendance FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own attendance"
  ON attendance FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own attendance"
  ON attendance FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 3. TASK_WORKERS 테이블 (작업-인력 연결)
-- ============================================
CREATE TABLE IF NOT EXISTS task_workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(task_id, worker_id)
);

CREATE INDEX idx_task_workers_task ON task_workers(task_id);
CREATE INDEX idx_task_workers_worker ON task_workers(worker_id);
CREATE INDEX idx_task_workers_owner ON task_workers(owner_id);

ALTER TABLE task_workers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task workers"
  ON task_workers FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own task workers"
  ON task_workers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own task workers"
  ON task_workers FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own task workers"
  ON task_workers FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 4. 기존 테이블 컬럼 추가
-- ============================================

-- daily_logs에 작업자 정보 추가
ALTER TABLE daily_logs
  ADD COLUMN IF NOT EXISTS worker_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weather_detail TEXT,
  ADD COLUMN IF NOT EXISTS work_hours DECIMAL(4, 2);

-- tasks에 예상 공수 추가
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(6, 2),
  ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(6, 2),
  ADD COLUMN IF NOT EXISTS assigned_workers TEXT[];

-- todos에 실제 작업자 추가
ALTER TABLE todos
  ADD COLUMN IF NOT EXISTS actual_assignee TEXT,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;


-- ============================================
-- 5. VIEWS (통계 뷰)
-- ============================================

-- 프로젝트별 인력 현황 뷰
CREATE OR REPLACE VIEW project_worker_stats AS
SELECT
  p.id as project_id,
  p.name as project_name,
  COUNT(DISTINCT a.worker_id) as total_workers,
  COUNT(DISTINCT CASE WHEN a.work_date = CURRENT_DATE THEN a.worker_id END) as today_workers,
  SUM(CASE WHEN a.work_date = CURRENT_DATE THEN a.work_hours ELSE 0 END) as today_total_hours,
  p.owner_id
FROM projects p
LEFT JOIN attendance a ON p.id = a.project_id
GROUP BY p.id, p.name, p.owner_id;

-- 일별 출근 현황 뷰
CREATE OR REPLACE VIEW daily_attendance_stats AS
SELECT
  a.work_date,
  a.project_id,
  COUNT(*) as total_workers,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
  COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_count,
  SUM(a.work_hours) as total_hours,
  a.owner_id
FROM attendance a
GROUP BY a.work_date, a.project_id, a.owner_id;

-- ============================================
-- 완료
-- ============================================
-- 마이그레이션 완료
