-- ============================================
-- NewHeart 현장 프로젝트 관리 MVP
-- Supabase 초기화 스크립트 (RLS 포함)
-- ============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROJECTS 테이블
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('planned', 'active', 'paused', 'done')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);

-- RLS 활성화
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 소유자만 조회
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = owner_id);

-- RLS 정책: 소유자만 삽입
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- RLS 정책: 소유자만 수정
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- RLS 정책: 소유자만 삭제
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 2. DAILY_LOGS 테이블 (현장일지)
-- ============================================
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weather TEXT,
  temperature TEXT,
  work_status TEXT NOT NULL DEFAULT 'normal' CHECK (work_status IN ('normal', 'delayed', 'issue')),
  zones TEXT[] DEFAULT '{}',
  follow_up_needed BOOLEAN NOT NULL DEFAULT false,
  follow_up_summary TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_daily_logs_project ON daily_logs(project_id);
CREATE INDEX idx_daily_logs_owner ON daily_logs(owner_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date DESC);
CREATE INDEX idx_daily_logs_follow_up ON daily_logs(follow_up_needed) WHERE follow_up_needed = true;

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own logs"
  ON daily_logs FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own logs"
  ON daily_logs FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 3. TASKS 테이블 (작업내용/공정)
-- ============================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  contract_type TEXT NOT NULL DEFAULT 'contract' CHECK (contract_type IN ('contract', 'extra')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  team TEXT,
  due_date DATE,
  spaces TEXT[] DEFAULT '{}',
  description TEXT,
  related_log_id UUID REFERENCES daily_logs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_owner ON tasks(owner_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_related_log ON tasks(related_log_id);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 4. TODOS 테이블 (관리업무 & Todo)
-- ============================================
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'todo' CHECK (category IN ('work', 'admin', 'todo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date DATE,
  priority TEXT NOT NULL DEFAULT 'mid' CHECK (priority IN ('high', 'mid', 'low')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'doing', 'done')),
  requester TEXT,
  assignee TEXT,
  spaces TEXT[] DEFAULT '{}',
  memo TEXT,
  related_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  related_log_id UUID REFERENCES daily_logs(id) ON DELETE SET NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_todos_project ON todos(project_id);
CREATE INDEX idx_todos_owner ON todos(owner_id);
CREATE INDEX idx_todos_status ON todos(status);
CREATE INDEX idx_todos_priority ON todos(priority);
CREATE INDEX idx_todos_due_date ON todos(due_date);
CREATE INDEX idx_todos_related_task ON todos(related_task_id);
CREATE INDEX idx_todos_related_log ON todos(related_log_id);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 5. ROOM_PROGRESS 테이블 (객실/공간별 진행률)
-- ============================================
CREATE TABLE room_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  room_code TEXT NOT NULL,
  room_type TEXT,
  demolition INT NOT NULL DEFAULT 0 CHECK (demolition >= 0 AND demolition <= 100),
  electrical INT NOT NULL DEFAULT 0 CHECK (electrical >= 0 AND electrical <= 100),
  plumbing INT NOT NULL DEFAULT 0 CHECK (plumbing >= 0 AND plumbing <= 100),
  carpentry INT NOT NULL DEFAULT 0 CHECK (carpentry >= 0 AND carpentry <= 100),
  waterproof INT NOT NULL DEFAULT 0 CHECK (waterproof >= 0 AND waterproof <= 100),
  masonry INT NOT NULL DEFAULT 0 CHECK (masonry >= 0 AND masonry <= 100),
  plaster INT NOT NULL DEFAULT 0 CHECK (plaster >= 0 AND plaster <= 100),
  metal INT NOT NULL DEFAULT 0 CHECK (metal >= 0 AND metal <= 100),
  tile INT NOT NULL DEFAULT 0 CHECK (tile >= 0 AND tile <= 100),
  film INT NOT NULL DEFAULT 0 CHECK (film >= 0 AND film <= 100),
  paint INT NOT NULL DEFAULT 0 CHECK (paint >= 0 AND paint <= 100),
  wallpaper INT NOT NULL DEFAULT 0 CHECK (wallpaper >= 0 AND wallpaper <= 100),
  floor INT NOT NULL DEFAULT 0 CHECK (floor >= 0 AND floor <= 100),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(project_id, room_code)
);

CREATE INDEX idx_room_progress_project ON room_progress(project_id);
CREATE INDEX idx_room_progress_owner ON room_progress(owner_id);
CREATE INDEX idx_room_progress_room_code ON room_progress(room_code);

ALTER TABLE room_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own room progress"
  ON room_progress FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own room progress"
  ON room_progress FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own room progress"
  ON room_progress FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own room progress"
  ON room_progress FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 6. ROOM_PHOTOS 테이블 (현장 사진)
-- ============================================
CREATE TABLE room_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  progress_id UUID NOT NULL REFERENCES room_progress(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_room_photos_project ON room_photos(project_id);
CREATE INDEX idx_room_photos_progress ON room_photos(progress_id);
CREATE INDEX idx_room_photos_owner ON room_photos(owner_id);

ALTER TABLE room_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own photos"
  ON room_photos FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own photos"
  ON room_photos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own photos"
  ON room_photos FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own photos"
  ON room_photos FOR DELETE
  USING (auth.uid() = owner_id);


-- ============================================
-- 완료 메시지
-- ============================================
-- 모든 테이블과 RLS 정책이 생성되었습니다.
-- Supabase Dashboard > SQL Editor에서 이 스크립트를 실행하세요.
