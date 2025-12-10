-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  clinic TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'clinic')),
  subscription_date TIMESTAMPTZ,
  subscription_expiry_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table croquettes
CREATE TABLE public.croquettes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  range TEXT,
  species TEXT CHECK (species IN ('dog', 'cat', 'both')),
  type TEXT,
  kcal_per_100g NUMERIC NOT NULL,
  protein NUMERIC,
  fat NUMERIC,
  fiber NUMERIC,
  product_url TEXT,
  approximate_price NUMERIC,
  availability TEXT CHECK (availability IN ('france', 'europe')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table calculs
CREATE TABLE public.calculs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  animal_name TEXT,
  species TEXT CHECK (species IN ('dog', 'cat')),
  weight NUMERIC NOT NULL,
  age_years INTEGER,
  age_months INTEGER,
  is_neutered BOOLEAN DEFAULT false,
  body_score INTEGER CHECK (body_score BETWEEN 1 AND 9),
  goal TEXT CHECK (goal IN ('maintenance', 'weight-loss', 'weight-gain', 'growth')),
  activity_level TEXT CHECK (activity_level IN ('low', 'moderate', 'high')),
  physiological_status TEXT CHECK (physiological_status IN ('normal', 'gestation', 'lactation', 'senior')),
  rer NUMERIC NOT NULL,
  mer NUMERIC NOT NULL,
  factor NUMERIC NOT NULL,
  selected_croquettes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table usage_tracking
CREATE TABLE public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  calculation_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Create indexes for performance
CREATE INDEX idx_calculs_user_id ON public.calculs(user_id);
CREATE INDEX idx_calculs_created_at ON public.calculs(created_at DESC);
CREATE INDEX idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_week_start ON public.usage_tracking(week_start);
CREATE INDEX idx_croquettes_species ON public.croquettes(species);
CREATE INDEX idx_croquettes_is_active ON public.croquettes(is_active);

-- Trigger auto-création profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at, plan)
  VALUES (NEW.id, NEW.email, NOW(), NOW(), 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_croquettes
  BEFORE UPDATE ON public.croquettes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
