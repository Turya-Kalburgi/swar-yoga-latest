-- RLS policies for additional tables: goals, tasks, todos, people, affirmations

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert own goals" ON public.goals FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Select own goals" ON public.goals FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Modify own goals" ON public.goals FOR UPDATE, DELETE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert own tasks" ON public.tasks FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Select own tasks" ON public.tasks FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Modify own tasks" ON public.tasks FOR UPDATE, DELETE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert own todos" ON public.todos FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Select own todos" ON public.todos FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Modify own todos" ON public.todos FOR UPDATE, DELETE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert own people" ON public.people FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Select own people" ON public.people FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Modify own people" ON public.people FOR UPDATE, DELETE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

ALTER TABLE public.affirmations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert own affirmations" ON public.affirmations FOR INSERT
  WITH CHECK (auth.role() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "Select own affirmations" ON public.affirmations FOR SELECT
  USING (user_id = auth.uid());
CREATE POLICY "Modify own affirmations" ON public.affirmations FOR UPDATE, DELETE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Note: These policies assume usage of Supabase Auth and that user_id column is set to auth.uid() for client inserts.
