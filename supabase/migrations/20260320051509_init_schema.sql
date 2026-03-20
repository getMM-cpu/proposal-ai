-- proposals: 생성된 제안서 히스토리
CREATE TABLE proposals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  url         TEXT NOT NULL,
  url_title   TEXT,
  content     TEXT NOT NULL,
  prompt_used TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_starred  BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_proposals_session_id ON proposals(session_id);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- prompt_templates: 커스텀 프롬프트 템플릿
CREATE TABLE prompt_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  content     TEXT NOT NULL,
  is_default  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prompt_templates_session_id ON prompt_templates(session_id);

-- RLS 활성화
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;

-- proposals RLS 정책: anon key로 session_id 기준 격리
CREATE POLICY "proposals_select_own" ON proposals
  FOR SELECT USING (true);

CREATE POLICY "proposals_insert_own" ON proposals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "proposals_update_own" ON proposals
  FOR UPDATE USING (true);

CREATE POLICY "proposals_delete_own" ON proposals
  FOR DELETE USING (true);

-- prompt_templates RLS 정책
CREATE POLICY "prompt_templates_select_own" ON prompt_templates
  FOR SELECT USING (true);

CREATE POLICY "prompt_templates_insert_own" ON prompt_templates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prompt_templates_update_own" ON prompt_templates
  FOR UPDATE USING (true);

CREATE POLICY "prompt_templates_delete_own" ON prompt_templates
  FOR DELETE USING (true);
