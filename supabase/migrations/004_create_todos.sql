-- Migration: create todos table
CREATE TABLE IF NOT EXISTS public.todos (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  done BOOLEAN DEFAULT false,
  date DATE,
  year INTEGER,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_todos_user_id ON public.todos (user_id);
CREATE INDEX IF NOT EXISTS idx_todos_year ON public.todos (year);
