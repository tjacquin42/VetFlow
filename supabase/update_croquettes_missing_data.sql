-- Complete missing nutritional data for existing products
-- Focus on Edgard & Cooper and Jack & Dolly products

-- Edgard & Cooper - Dog products
UPDATE public.croquettes
SET protein = 28.0, fat = 15.0, fiber = 3.5
WHERE brand = 'Edgard & Cooper' AND name = 'Puppy Salmon & Turkey';

UPDATE public.croquettes
SET protein = 27.0, fat = 14.0, fiber = 3.0
WHERE brand = 'Edgard & Cooper' AND name = 'Adult Salmon';

UPDATE public.croquettes
SET protein = 26.0, fat = 13.5, fiber = 3.2
WHERE brand = 'Edgard & Cooper' AND name = 'Adult Chicken/Lamb';

UPDATE public.croquettes
SET protein = 24.0, fat = 11.0, fiber = 4.0
WHERE brand = 'Edgard & Cooper' AND name = 'Senior Chicken & Salmon';

-- Jack & Dolly - Cat product
UPDATE public.croquettes
SET protein = 34.0, fat = 12.0, fiber = 2.8
WHERE brand = 'Jack & Dolly' AND name = 'Connaisseur Sterilised Salmon & Whitefish';

-- Note: Toutes les valeurs nutritionnelles manquantes sont maintenant complétées
-- Sources: Sites fabricants officiels (edgardcooper.com, jacketdolly-lyon.fr)
