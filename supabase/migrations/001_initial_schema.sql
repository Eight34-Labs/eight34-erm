-- ============================================================
-- Eight34 ERM — Initial Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'ADMIN', 'SALES');
CREATE TYPE lead_status AS ENUM (
  'NEW',
  'STILL_INQUIRING',
  'WEBSITE_IN_PROGRESS',
  'DELIVERY_IN_PROGRESS',
  'REJECTED',
  'COMPLETED'
);
CREATE TYPE client_type AS ENUM ('PERSONAL', 'BUSINESS', 'SAAS');

-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slack_user_id         TEXT UNIQUE NOT NULL,
  slack_team_id         TEXT NOT NULL,
  name                  TEXT NOT NULL,
  email                 TEXT UNIQUE,
  avatar_url            TEXT,
  role                  user_role NOT NULL DEFAULT 'SALES',
  is_active             BOOLEAN NOT NULL DEFAULT true,
  is_approved           BOOLEAN NOT NULL DEFAULT false,
  training_completed    BOOLEAN NOT NULL DEFAULT false,
  training_version      INTEGER,
  quiz_score            INTEGER,
  training_completed_at TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_slack_user_id ON users(slack_user_id);
CREATE INDEX idx_users_slack_team_id ON users(slack_team_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================================
-- TRAINING MODULES
-- ============================================================

CREATE TABLE training_modules (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_number INTEGER UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  content       JSONB NOT NULL DEFAULT '{}',
  version       INTEGER NOT NULL DEFAULT 1,
  is_published  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_training_modules_number ON training_modules(module_number);
CREATE INDEX idx_training_modules_published ON training_modules(is_published);

-- ============================================================
-- TRAINING PROGRESS
-- ============================================================

CREATE TABLE training_progress (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  module_id    UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  completed    BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

CREATE INDEX idx_training_progress_user ON training_progress(user_id);
CREATE INDEX idx_training_progress_module ON training_progress(module_id);
CREATE INDEX idx_training_progress_completed ON training_progress(user_id, completed);

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================

CREATE TABLE quiz_questions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question       TEXT NOT NULL,
  question_type  TEXT NOT NULL DEFAULT 'multiple_choice',
  options        JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  explanation    TEXT NOT NULL,
  module_id      UUID REFERENCES training_modules(id) ON DELETE SET NULL,
  difficulty     TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  version        INTEGER NOT NULL DEFAULT 1,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quiz_questions_active ON quiz_questions(is_active);
CREATE INDEX idx_quiz_questions_module ON quiz_questions(module_id);

-- ============================================================
-- QUIZ ATTEMPTS
-- ============================================================

CREATE TABLE quiz_attempts (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score            INTEGER NOT NULL,
  total_questions  INTEGER NOT NULL DEFAULT 20,
  passed           BOOLEAN NOT NULL,
  answers          JSONB NOT NULL DEFAULT '{}',
  training_version INTEGER,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_passed ON quiz_attempts(user_id, passed);

-- ============================================================
-- LEADS
-- ============================================================

-- Auto-increment lead number sequence
CREATE SEQUENCE lead_number_seq START WITH 100 INCREMENT BY 1;

CREATE TABLE leads (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_number             TEXT UNIQUE NOT NULL DEFAULT ('E34-' || LPAD(nextval('lead_number_seq')::TEXT, 5, '0')),
  created_by              UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

  -- Client info
  client_name             TEXT NOT NULL,
  client_type             client_type NOT NULL,
  business_type           TEXT,
  business_type_other     TEXT,

  -- Website info
  website_type            TEXT NOT NULL,
  website_type_other      TEXT,
  reason                  TEXT NOT NULL CHECK (reason IN ('NEW_WEBSITE', 'REDO_WEBSITE')),
  previous_website_url    TEXT,

  -- Audience & design
  target_audience         TEXT NOT NULL,
  design_style            TEXT[] NOT NULL DEFAULT '{}',
  design_style_other      TEXT,
  inspiration_urls        TEXT[] NOT NULL DEFAULT '{}',

  -- Pricing
  budget                  NUMERIC(10, 2),

  -- Details
  special_features        TEXT,
  additional_information  TEXT,

  -- Status
  status                  lead_status NOT NULL DEFAULT 'NEW',

  -- Timestamps
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at            TIMESTAMPTZ
);

CREATE INDEX idx_leads_created_by ON leads(created_by);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_client_type ON leads(client_type);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_lead_number ON leads(lead_number);

-- ============================================================
-- LEAD STATUS HISTORY
-- ============================================================

CREATE TABLE lead_status_history (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id    UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  old_status lead_status,
  new_status lead_status NOT NULL,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lead_status_history_lead ON lead_status_history(lead_id);
CREATE INDEX idx_lead_status_history_created ON lead_status_history(lead_id, created_at DESC);

-- ============================================================
-- PRICING CONFIG
-- ============================================================

CREATE TABLE pricing_config (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region      TEXT NOT NULL CHECK (region IN ('US_EUROPE', 'GLOBAL')),
  website_type TEXT NOT NULL,
  label       TEXT NOT NULL,
  min_price   NUMERIC(10, 2) NOT NULL,
  max_price   NUMERIC(10, 2),
  notes       TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  updated_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pricing_config_region ON pricing_config(region);
CREATE INDEX idx_pricing_config_active ON pricing_config(is_active);

-- ============================================================
-- SESSION TOKENS (for auth management)
-- ============================================================

CREATE TABLE sessions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at
  BEFORE UPDATE ON training_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_config_updated_at
  BEFORE UPDATE ON pricing_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- LEAD STATUS CHANGE TRIGGER → auto-log history
-- ============================================================

CREATE OR REPLACE FUNCTION log_lead_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO lead_status_history (lead_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, NEW.created_by);
    
    -- Set completed_at when lead is completed
    IF NEW.status = 'COMPLETED' THEN
      NEW.completed_at = NOW();
    ELSE
      NEW.completed_at = NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lead_status_change_trigger
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION log_lead_status_change();

-- ============================================================
-- TRAINING COMPLETION RESET ON FAILED QUIZ
-- ============================================================

CREATE OR REPLACE FUNCTION reset_training_on_fail()
RETURNS TRIGGER AS $$
BEGIN
  -- If a quiz attempt is recorded as failed, reset training progress
  IF NEW.passed = false THEN
    UPDATE users SET
      training_completed = false,
      training_version = NULL,
      quiz_score = NEW.score,
      training_completed_at = NULL
    WHERE id = NEW.user_id;

    -- Reset all training progress for this user
    UPDATE training_progress SET
      completed = false,
      completed_at = NULL
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_fail_reset_trigger
  AFTER INSERT ON quiz_attempts
  FOR EACH ROW EXECUTE FUNCTION reset_training_on_fail();
