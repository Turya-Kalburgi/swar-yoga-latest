-- Row Level Security (RLS) example for visions table
-- Apply these in Supabase only if you plan to allow clients direct access

-- Enable RLS
ALTER TABLE public.visions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert rows where they set user_id to auth.uid()
CREATE POLICY "Insert own visions" ON public.visions FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL AND user_id = auth.uid());

-- Allow authenticated users to select rows that belong to them
CREATE POLICY "Select own visions" ON public.visions FOR SELECT
  USING (user_id = auth.uid());

-- Allow authenticated users to update/delete only their own rows
CREATE POLICY "Modify own visions" ON public.visions FOR UPDATE, DELETE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Notes:
-- - These policies assume you're using Supabase Auth and setting user_id to the
--   authenticated user's id (auth.uid()). When you use server-side service_role
--   key, RLS is bypassed for admin operations.
