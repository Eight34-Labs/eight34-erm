-- ============================================================
-- Eight34 ERM — Feature Update Migration (003)
-- ============================================================

-- 1. Add commission_rate to users (default 50%)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 50.00;

-- 2. Add draft, trash, cost, and payment tracking fields to leads
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS is_trashed BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS cost_amount NUMERIC(10, 2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS commission_paid BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS company_paid BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS costs_paid BOOLEAN NOT NULL DEFAULT false;

-- Create indices for drafts and trashed
CREATE INDEX IF NOT EXISTS idx_leads_is_draft ON leads(is_draft);
CREATE INDEX IF NOT EXISTS idx_leads_is_trashed ON leads(is_trashed);

-- 3. Create ERM Settings table for platform configurations
CREATE TABLE IF NOT EXISTS erm_settings (
  id                        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  default_commission_rate   NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
  auto_approve_salespeople  BOOLEAN NOT NULL DEFAULT false,
  slack_workspace_id        TEXT NOT NULL DEFAULT 'T_EIGHT34_MAIN',
  aesthetic_tag_options     JSONB NOT NULL DEFAULT '["Minimal", "Modern", "Corporate", "Luxury", "Playful", "Bold", "Editorial", "Dark", "Clean", "Futuristic", "Professional", "Creative", "Colorful", "Other"]'::jsonb,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by                UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Trigger for erm_settings updated_at
CREATE TRIGGER update_erm_settings_updated_at
  BEFORE UPDATE ON erm_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on erm_settings
ALTER TABLE erm_settings ENABLE ROW LEVEL SECURITY;

-- Insert default row if not exists
INSERT INTO erm_settings (default_commission_rate, auto_approve_salespeople, slack_workspace_id)
SELECT 50.00, false, 'T_EIGHT34_MAIN'
WHERE NOT EXISTS (SELECT 1 FROM erm_settings);
