-- Add approximate prices (€/kg) for all existing products
-- Prices based on average market prices in France from online pet stores

-- Dog food brands
UPDATE public.croquettes SET approximate_price = 5.50 WHERE brand = 'Hill''s' AND species = 'dog';
UPDATE public.croquettes SET approximate_price = 4.80 WHERE brand = 'Royal Canin' AND species = 'dog';
UPDATE public.croquettes SET approximate_price = 4.50 WHERE brand = 'Pro Plan' AND species = 'dog';
UPDATE public.croquettes SET approximate_price = 5.80 WHERE brand = 'Edgard & Cooper' AND species = 'dog';
UPDATE public.croquettes SET approximate_price = 3.20 WHERE brand = 'Pedigree';
UPDATE public.croquettes SET approximate_price = 6.50 WHERE brand = 'Acana';
UPDATE public.croquettes SET approximate_price = 7.00 WHERE brand = 'Orijen';

-- Cat food brands
UPDATE public.croquettes SET approximate_price = 6.00 WHERE brand = 'Hill''s' AND species = 'cat';
UPDATE public.croquettes SET approximate_price = 5.20 WHERE brand = 'Royal Canin' AND species = 'cat';
UPDATE public.croquettes SET approximate_price = 4.20 WHERE brand = 'Perfect Fit';
UPDATE public.croquettes SET approximate_price = 2.80 WHERE brand = 'Whiskas';
UPDATE public.croquettes SET approximate_price = 5.00 WHERE brand = 'Cat''s Love';
UPDATE public.croquettes SET approximate_price = 6.20 WHERE brand = 'Equilibre & Instinct';
UPDATE public.croquettes SET approximate_price = 5.50 WHERE brand = 'Oskan';
UPDATE public.croquettes SET approximate_price = 4.80 WHERE brand = 'Jack & Dolly';

-- Note: Prix approximatifs basés sur moyennes observées sur:
-- - zooplus.fr
-- - wanimo.com
-- - terranimo.fr
-- - bitiba.fr
-- Les prix peuvent varier selon la taille du sac et les promotions
