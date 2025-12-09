-- VetFlow Initial Database Schema
-- Migration: 001_initial_schema
-- Created: 2025-12-09

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- TABLE: users
-- ==============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  clinic VARCHAR(255),
  phone VARCHAR(20),
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'clinic')),
  subscription_date TIMESTAMP,
  subscription_expiry_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- TABLE: croquettes (kibble products)
-- ==============================================
CREATE TABLE IF NOT EXISTS croquettes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  range VARCHAR(100),
  species VARCHAR(20) CHECK (species IN ('dog', 'cat', 'both')) NOT NULL,
  type VARCHAR(100),
  kcal_per_100g DECIMAL(5,2) NOT NULL,
  protein DECIMAL(4,2),
  fat DECIMAL(4,2),
  fiber DECIMAL(4,2),
  product_url TEXT NOT NULL,
  approximate_price DECIMAL(6,2),
  availability VARCHAR(50) DEFAULT 'france' CHECK (availability IN ('france', 'europe')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- TABLE: calculs (calculation history)
-- ==============================================
CREATE TABLE IF NOT EXISTS calculs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,

  -- Animal information
  animal_name VARCHAR(100),
  species VARCHAR(20) CHECK (species IN ('dog', 'cat')) NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  age_years INTEGER NOT NULL,
  age_months INTEGER NOT NULL CHECK (age_months BETWEEN 0 AND 11),
  is_neutered BOOLEAN NOT NULL,
  body_score INTEGER NOT NULL CHECK (body_score BETWEEN 1 AND 9),

  -- Objective data
  goal VARCHAR(50) CHECK (goal IN ('maintenance', 'weight-loss', 'weight-gain', 'growth')) NOT NULL,
  activity_level VARCHAR(50) CHECK (activity_level IN ('low', 'moderate', 'high')) NOT NULL,
  physiological_status VARCHAR(50) CHECK (physiological_status IN ('normal', 'gestation', 'lactation', 'senior')) NOT NULL,

  -- Calculation results
  rer DECIMAL(7,2) NOT NULL,
  mer DECIMAL(7,2) NOT NULL,
  factor DECIMAL(3,2) NOT NULL,

  -- Selected croquettes with calculated quantities (JSONB)
  selected_croquettes JSONB NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================================
-- TABLE: usage_tracking (for freemium limits)
-- ==============================================
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  week_start DATE NOT NULL,
  calculation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, week_start)
);

-- ==============================================
-- INDEXES for performance
-- ==============================================
CREATE INDEX idx_calculs_user_id ON calculs(user_id);
CREATE INDEX idx_calculs_created_at ON calculs(created_at DESC);
CREATE INDEX idx_croquettes_species ON croquettes(species);
CREATE INDEX idx_croquettes_brand ON croquettes(brand);
CREATE INDEX idx_croquettes_is_active ON croquettes(is_active);
CREATE INDEX idx_usage_user_week ON usage_tracking(user_id, week_start);

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE croquettes ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Calculs table policies
CREATE POLICY "Users can view own calculations"
  ON calculs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own calculations"
  ON calculs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON calculs FOR DELETE
  USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own usage"
  ON usage_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own usage"
  ON usage_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Croquettes table policies (public read, admin write)
CREATE POLICY "Anyone can view active croquettes"
  ON croquettes FOR SELECT
  USING (is_active = true);

-- ==============================================
-- FUNCTIONS & TRIGGERS
-- ==============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for croquettes table
CREATE TRIGGER update_croquettes_updated_at
  BEFORE UPDATE ON croquettes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- SEED DATA (Optional - for testing)
-- ==============================================

-- Insert some sample croquettes
INSERT INTO croquettes (brand, name, range, species, type, kcal_per_100g, protein, fat, fiber, product_url, approximate_price, availability) VALUES
  ('Hills', 'Weight Control Small Breed', 'Veterinary', 'dog', 'weight-control', 334, 28.5, 11.2, 14.3, 'https://www.hillspet.fr/dog-food/pd-canine-prescription-diet-metabolic-weight-management-dog-food', 30, 'france'),
  ('Royal Canin', 'Satiety Weight Management', 'Veterinary', 'dog', 'weight-control', 312, 30.0, 9.5, 19.0, 'https://www.royalcanin.com/fr/dogs/products/vet-products/satiety-weight-management-dry', 35, 'france'),
  ('Purina Pro Plan', 'Light Adult', 'Premium', 'dog', 'light', 357, 29.0, 10.0, 8.0, 'https://www.purina.fr/pro-plan/chiens/light-adult', 25, 'france')
ON CONFLICT DO NOTHING;

-- ==============================================
-- COMMENTS
-- ==============================================

COMMENT ON TABLE users IS 'Veterinarian user accounts';
COMMENT ON TABLE croquettes IS 'Kibble/croquette product database';
COMMENT ON TABLE calculs IS 'Calculation history for energy requirements and kibble quantities';
COMMENT ON TABLE usage_tracking IS 'Weekly usage tracking for freemium limits';
