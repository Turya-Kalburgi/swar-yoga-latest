-- Migration: create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  priority TEXT,
  date DATE,
  year INTEGER,
  vision_id BIGINT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals (user_id);
CREATE INDEX IF NOT EXISTS idx_goals_year ON public.goals (year);
