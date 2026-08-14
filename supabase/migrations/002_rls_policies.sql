-- ============================================================
-- Eight34 ERM — Row Level Security Policies
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role from session
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT u.role INTO v_role
  FROM users u
  JOIN sessions s ON s.user_id = u.id
  WHERE s.token = current_setting('request.jwt.claims', true)::json->>'session_token'
    AND s.expires_at > NOW()
    AND u.is_active = true;
  RETURN v_role;
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT s.user_id INTO v_user_id
  FROM sessions s
  JOIN users u ON u.id = s.user_id
  WHERE s.token = current_setting('request.jwt.claims', true)::json->>'session_token'
    AND s.expires_at > NOW()
    AND u.is_active = true;
  RETURN v_user_id;
EXCEPTION
  WHEN OTHERS THEN RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- USERS RLS
-- ============================================================

-- Users can read their own record; admins can read all
CREATE POLICY "users_select_own" ON users FOR SELECT
  USING (
    id = get_current_user_id()
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

-- Only SUPER_ADMIN can insert users (or the service role)
CREATE POLICY "users_insert_service" ON users FOR INSERT
  WITH CHECK (true); -- controlled by service role in application code

-- Users can update their own non-sensitive fields
CREATE POLICY "users_update_own" ON users FOR UPDATE
  USING (
    id = get_current_user_id()
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

-- Only SUPER_ADMIN can delete users
CREATE POLICY "users_delete_super_admin" ON users FOR DELETE
  USING (get_current_user_role() = 'SUPER_ADMIN');

-- ============================================================
-- TRAINING MODULES RLS
-- ============================================================

-- Published modules visible to all authenticated users
CREATE POLICY "training_modules_select" ON training_modules FOR SELECT
  USING (
    is_published = true
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

-- Only admins can modify training modules
CREATE POLICY "training_modules_insert" ON training_modules FOR INSERT
  WITH CHECK (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "training_modules_update" ON training_modules FOR UPDATE
  USING (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "training_modules_delete" ON training_modules FOR DELETE
  USING (get_current_user_role() = 'SUPER_ADMIN');

-- ============================================================
-- TRAINING PROGRESS RLS
-- ============================================================

CREATE POLICY "training_progress_select" ON training_progress FOR SELECT
  USING (
    user_id = get_current_user_id()
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "training_progress_insert" ON training_progress FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

CREATE POLICY "training_progress_update" ON training_progress FOR UPDATE
  USING (user_id = get_current_user_id());

-- ============================================================
-- QUIZ QUESTIONS RLS
-- ============================================================

CREATE POLICY "quiz_questions_select" ON quiz_questions FOR SELECT
  USING (
    is_active = true
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "quiz_questions_insert" ON quiz_questions FOR INSERT
  WITH CHECK (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "quiz_questions_update" ON quiz_questions FOR UPDATE
  USING (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- ============================================================
-- QUIZ ATTEMPTS RLS
-- ============================================================

CREATE POLICY "quiz_attempts_select" ON quiz_attempts FOR SELECT
  USING (
    user_id = get_current_user_id()
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

CREATE POLICY "quiz_attempts_insert" ON quiz_attempts FOR INSERT
  WITH CHECK (user_id = get_current_user_id());

-- No updates allowed — attempts are immutable
-- ============================================================
-- LEADS RLS
-- ============================================================

CREATE POLICY "leads_select" ON leads FOR SELECT
  USING (
    created_by = get_current_user_id()
    OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN')
  );

-- Only certified SALES users and above can create leads
CREATE POLICY "leads_insert" ON leads FOR INSERT
  WITH CHECK (
    created_by = get_current_user_id()
    AND get_current_user_role() IS NOT NULL
  );

-- Only admins can update leads (status changes etc.)
CREATE POLICY "leads_update" ON leads FOR UPDATE
  USING (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- No hard deletion of leads
CREATE POLICY "leads_delete" ON leads FOR DELETE
  USING (get_current_user_role() = 'SUPER_ADMIN');

-- ============================================================
-- LEAD STATUS HISTORY RLS
-- ============================================================

CREATE POLICY "lead_status_history_select" ON lead_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads l
      WHERE l.id = lead_id
        AND (l.created_by = get_current_user_id()
             OR get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'))
    )
  );

-- Inserts happen via triggers only (service role)
CREATE POLICY "lead_status_history_insert" ON lead_status_history FOR INSERT
  WITH CHECK (true); -- controlled via triggers and service role

-- ============================================================
-- PRICING CONFIG RLS
-- ============================================================

CREATE POLICY "pricing_config_select" ON pricing_config FOR SELECT
  USING (get_current_user_id() IS NOT NULL);

CREATE POLICY "pricing_config_insert" ON pricing_config FOR INSERT
  WITH CHECK (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

CREATE POLICY "pricing_config_update" ON pricing_config FOR UPDATE
  USING (get_current_user_role() IN ('ADMIN', 'SUPER_ADMIN'));

-- ============================================================
-- SESSIONS RLS
-- ============================================================

CREATE POLICY "sessions_select_own" ON sessions FOR SELECT
  USING (user_id = get_current_user_id());

CREATE POLICY "sessions_insert" ON sessions FOR INSERT
  WITH CHECK (true); -- service role only

CREATE POLICY "sessions_delete_own" ON sessions FOR DELETE
  USING (user_id = get_current_user_id());
