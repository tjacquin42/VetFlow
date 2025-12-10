-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.croquettes ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Policies for calculs table
CREATE POLICY "Users can view their own calculs"
  ON public.calculs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calculs"
  ON public.calculs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calculs"
  ON public.calculs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculs"
  ON public.calculs FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for usage_tracking table
CREATE POLICY "Users can view their own usage"
  ON public.usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.usage_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.usage_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Policies for croquettes table (lecture publique pour tous les utilisateurs authentifiés et anonymes)
CREATE POLICY "Anyone can view active croquettes"
  ON public.croquettes FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Policy pour permettre aux administrateurs de gérer les croquettes
-- Note: Vous devrez créer un rôle admin séparé si nécessaire
CREATE POLICY "Admins can manage croquettes"
  ON public.croquettes FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE email LIKE '%@admin.vetflow.com'
    )
  );
