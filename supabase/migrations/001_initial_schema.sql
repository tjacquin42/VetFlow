-- ============================================
-- VETFLOW - Initialisation Base de Données
-- Version: 001
-- Date: 2025-12-11
-- ============================================

-- ============================================
-- 1. TABLE CROQUETTES
-- ============================================

CREATE TABLE IF NOT EXISTS public.croquettes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  range TEXT,
  species TEXT NOT NULL CHECK (species IN ('dog', 'cat', 'both')),
  type TEXT,
  kcal_per_100g NUMERIC NOT NULL CHECK (kcal_per_100g > 0),
  protein NUMERIC CHECK (protein >= 0 AND protein <= 100),
  fat NUMERIC CHECK (fat >= 0 AND fat <= 100),
  fiber NUMERIC CHECK (fiber >= 0 AND fiber <= 100),
  product_url TEXT,
  approximate_price NUMERIC CHECK (approximate_price >= 0),
  availability TEXT CHECK (availability IN ('france', 'europe')),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_croquettes_species ON public.croquettes(species);
CREATE INDEX IF NOT EXISTS idx_croquettes_is_active ON public.croquettes(is_active);
CREATE INDEX IF NOT EXISTS idx_croquettes_brand ON public.croquettes(brand);

-- Activer RLS
ALTER TABLE public.croquettes ENABLE ROW LEVEL SECURITY;

-- Politique: Lecture publique (tous peuvent lire les croquettes actives)
CREATE POLICY "Allow public read access to active croquettes" ON public.croquettes
  FOR SELECT
  USING (is_active = true);

-- Politique: Seuls les utilisateurs authentifiés peuvent modifier
CREATE POLICY "Allow authenticated users to manage croquettes" ON public.croquettes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================
-- 2. DONNÉES DE TEST - CROQUETTES CHIENS
-- ============================================

INSERT INTO public.croquettes (brand, name, range, species, type, kcal_per_100g, protein, fat, fiber, approximate_price, availability) VALUES
  -- Royal Canin
  ('Royal Canin', 'Medium Adult', 'Size Health Nutrition', 'dog', 'Adult', 377, 25, 14, 1.3, 4.50, 'france'),
  ('Royal Canin', 'Medium Light Weight Care', 'Size Health Nutrition', 'dog', 'Weight Loss', 324, 28, 11, 5.8, 4.80, 'france'),
  ('Royal Canin', 'Medium Ageing', 'Size Health Nutrition', 'dog', 'Senior', 356, 27, 14, 2.3, 5.00, 'france'),

  -- Hill''s Science Plan
  ('Hill''s', 'Science Plan Adult Large Breed', 'Optimal Care', 'dog', 'Adult', 370, 26, 15, 2.5, 5.20, 'france'),
  ('Hill''s', 'Science Plan Perfect Weight', 'Weight Management', 'dog', 'Weight Loss', 330, 29, 12.5, 11.0, 5.50, 'france'),
  ('Hill''s', 'Science Plan Mature Adult', 'Optimal Care', 'dog', 'Senior', 364, 21, 14, 3.5, 5.40, 'france'),

  -- Purina ONE
  ('Purina ONE', 'Chien Adulte Poulet', 'Standard', 'dog', 'Adult', 390, 24, 16, 2.0, 3.80, 'france'),
  ('Purina ONE', 'Chien Senior', 'Standard', 'dog', 'Senior', 368, 26, 14, 2.5, 4.00, 'france'),

  -- Acana (Premium)
  ('Acana', 'Adult Large Breed', 'Heritage', 'dog', 'Adult', 337, 29, 15, 5.0, 6.50, 'france'),
  ('Acana', 'Light & Fit', 'Heritage', 'dog', 'Weight Loss', 315, 35, 10, 8.0, 6.80, 'france'),

  -- Orijen (Super Premium)
  ('Orijen', 'Original Dog', 'Biologically Appropriate', 'dog', 'Adult', 394, 38, 18, 4.0, 8.50, 'france'),

  -- Pro Plan
  ('Pro Plan', 'OptiBalance Medium Adult', 'Standard', 'dog', 'Adult', 387, 27, 16, 2.5, 4.20, 'france');

-- ============================================
-- 3. DONNÉES DE TEST - CROQUETTES CHATS
-- ============================================

INSERT INTO public.croquettes (brand, name, range, species, type, kcal_per_100g, protein, fat, fiber, approximate_price, availability) VALUES
  -- Royal Canin
  ('Royal Canin', 'Feline Health Nutrition Indoor', 'Indoor', 'cat', 'Adult', 385, 27, 13, 5.0, 4.80, 'france'),
  ('Royal Canin', 'Feline Health Nutrition Sterilised', 'Sterilised', 'cat', 'Adult', 375, 37, 12, 4.8, 5.00, 'france'),
  ('Royal Canin', 'Feline Health Nutrition Senior', 'Ageing', 'cat', 'Senior', 393, 27, 13, 4.2, 5.20, 'france'),

  -- Hill''s Science Plan
  ('Hill''s', 'Science Plan Adult Indoor', 'Optimal Care', 'cat', 'Adult', 398, 32, 16, 1.8, 5.50, 'france'),
  ('Hill''s', 'Science Plan Perfect Weight', 'Weight Management', 'cat', 'Weight Loss', 344, 40, 11.6, 9.0, 5.80, 'france'),
  ('Hill''s', 'Science Plan Mature Adult 7+', 'Optimal Care', 'cat', 'Senior', 395, 33, 17.5, 1.3, 5.70, 'france'),

  -- Purina ONE
  ('Purina ONE', 'Chat Adulte Intérieur', 'Indoor', 'cat', 'Adult', 410, 35, 14, 4.5, 4.00, 'france'),
  ('Purina ONE', 'Chat Stérilisé', 'Sterilised', 'cat', 'Adult', 395, 37, 13, 5.0, 4.20, 'france'),

  -- Acana (Premium)
  ('Acana', 'Wild Prairie Cat', 'Regionals', 'cat', 'Adult', 410, 37, 20, 3.0, 7.50, 'france'),

  -- Orijen (Super Premium)
  ('Orijen', 'Cat & Kitten', 'Biologically Appropriate', 'cat', 'Adult', 409, 40, 20, 3.0, 9.00, 'france');

-- ============================================
-- 4. FONCTION DE MISE À JOUR AUTOMATIQUE
-- ============================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour la table croquettes
CREATE TRIGGER update_croquettes_updated_at
  BEFORE UPDATE ON public.croquettes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FIN DU SCRIPT
-- ============================================
