-- ============================================
-- 사진 업로드 확장 (현장일지, 작업내용)
-- ============================================

-- 현장일지 사진 테이블
CREATE TABLE IF NOT EXISTS daily_log_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_daily_log_photos_log ON daily_log_photos(daily_log_id);
CREATE INDEX idx_daily_log_photos_owner ON daily_log_photos(owner_id);

ALTER TABLE daily_log_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own log photos"
  ON daily_log_photos FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own log photos"
  ON daily_log_photos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own log photos"
  ON daily_log_photos FOR DELETE
  USING (auth.uid() = owner_id);


-- 작업내용 사진 테이블
CREATE TABLE IF NOT EXISTS task_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_task_photos_task ON task_photos(task_id);
CREATE INDEX idx_task_photos_owner ON task_photos(owner_id);

ALTER TABLE task_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own task photos"
  ON task_photos FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert own task photos"
  ON task_photos FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete own task photos"
  ON task_photos FOR DELETE
  USING (auth.uid() = owner_id);
