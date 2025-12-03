-- Migration: create visions table
-- Run this in Supabase SQL editor or via psql

CREATE TABLE IF NOT EXISTS public.visions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  progress INTEGER DEFAULT 0,
  priority TEXT,
  date DATE,
  year INTEGER,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_visions_user_id ON public.visions (user_id);
CREATE INDEX IF NOT EXISTS idx_visions_year ON public.visions (year);
