-- =========================================================================
-- Shri Ram A U Portfolio - Supabase Database Schema
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- =========================================================================

-- 1. Portfolio Content Table (JSONB stores all dynamic sections)
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Portfolio Settings Table (Stores terminal secret word & admin credentials)
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Enable Row-Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- 4. Policies: Allow public read of content, restrict write/settings to service role
DROP POLICY IF EXISTS "Allow public read on portfolio_content" ON public.portfolio_content;
CREATE POLICY "Allow public read on portfolio_content"
  ON public.portfolio_content FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow service_role full access on portfolio_content" ON public.portfolio_content;
CREATE POLICY "Allow service_role full access on portfolio_content"
  ON public.portfolio_content FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on portfolio_settings" ON public.portfolio_settings;
CREATE POLICY "Allow service_role full access on portfolio_settings"
  ON public.portfolio_settings FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 5. Seed default settings (Can be changed anytime via Terminal or Admin Portal)
INSERT INTO public.portfolio_settings (key, value)
VALUES
  ('secret_keyword', 'aus-master'),
  ('admin_email', 'shriram2005au@gmail.com')
ON CONFLICT (key) DO NOTHING;

