-- Migration: create affirmations table
CREATE TABLE IF NOT EXISTS public.affirmations (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_affirmations_user_id ON public.affirmations (user_id);
