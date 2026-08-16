CREATE TABLE public.scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score integer not null,
  created_at timestamptz not null default now()
);

GRANT SELECT, INSERT ON public.scores TO anon;
GRANT SELECT, INSERT ON public.scores TO authenticated;
GRANT ALL ON public.scores TO service_role;

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert scores"
  ON public.scores
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert scores"
  ON public.scores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read scores"
  ON public.scores
  FOR SELECT
  TO anon, authenticated
  USING (true);