-- Requêtes de validation pour la base de données croquettes
-- À exécuter après l'import de toutes les données

-- 1. Compter total de produits actifs
SELECT COUNT(*) as total_actifs FROM public.croquettes WHERE is_active = true;

-- 2. Produits par espèce
SELECT
  species,
  COUNT(*) as nombre_produits
FROM public.croquettes
WHERE is_active = true
GROUP BY species
ORDER BY nombre_produits DESC;

-- 3. Produits par marque
SELECT
  brand,
  COUNT(*) as nombre_produits
FROM public.croquettes
WHERE is_active = true
GROUP BY brand
ORDER BY nombre_produits DESC;

-- 4. Vérifier la complétude des données nutritionnelles
SELECT
  COUNT(*) as total,
  COUNT(protein) as avec_proteines,
  COUNT(fat) as avec_graisses,
  COUNT(fiber) as avec_fibres,
  COUNT(approximate_price) as avec_prix,
  COUNT(image_url) as avec_images,
  ROUND(100.0 * COUNT(protein) / COUNT(*), 1) as pct_proteines,
  ROUND(100.0 * COUNT(fat) / COUNT(*), 1) as pct_graisses,
  ROUND(100.0 * COUNT(fiber) / COUNT(*), 1) as pct_fibres,
  ROUND(100.0 * COUNT(approximate_price) / COUNT(*), 1) as pct_prix,
  ROUND(100.0 * COUNT(image_url) / COUNT(*), 1) as pct_images
FROM public.croquettes
WHERE is_active = true;

-- 5. Produits avec données incomplètes
SELECT
  brand,
  name,
  species,
  CASE
    WHEN protein IS NULL THEN 'Manque protéines'
    WHEN fat IS NULL THEN 'Manque graisses'
    WHEN fiber IS NULL THEN 'Manque fibres'
    WHEN approximate_price IS NULL THEN 'Manque prix'
    ELSE 'Complet'
  END as statut
FROM public.croquettes
WHERE is_active = true
AND (protein IS NULL OR fat IS NULL OR fiber IS NULL OR approximate_price IS NULL)
ORDER BY brand, name;

-- 6. Produits les moins chers
SELECT
  brand,
  name,
  species,
  approximate_price as prix_kg_euros
FROM public.croquettes
WHERE is_active = true AND approximate_price IS NOT NULL
ORDER BY approximate_price ASC
LIMIT 10;

-- 7. Produits les plus chers
SELECT
  brand,
  name,
  species,
  approximate_price as prix_kg_euros
FROM public.croquettes
WHERE is_active = true AND approximate_price IS NOT NULL
ORDER BY approximate_price DESC
LIMIT 10;

-- 8. Produits les plus énergétiques
SELECT
  brand,
  name,
  species,
  type,
  kcal_per_100g
FROM public.croquettes
WHERE is_active = true
ORDER BY kcal_per_100g DESC
LIMIT 10;

-- 9. Produits les moins énergétiques (Light)
SELECT
  brand,
  name,
  species,
  type,
  kcal_per_100g
FROM public.croquettes
WHERE is_active = true
ORDER BY kcal_per_100g ASC
LIMIT 10;

-- 10. Distribution par type
SELECT
  type,
  species,
  COUNT(*) as nombre
FROM public.croquettes
WHERE is_active = true
GROUP BY type, species
ORDER BY species, nombre DESC;

-- 11. Prix moyen par marque
SELECT
  brand,
  species,
  COUNT(*) as nb_produits,
  ROUND(AVG(approximate_price), 2) as prix_moyen_kg,
  MIN(approximate_price) as prix_min_kg,
  MAX(approximate_price) as prix_max_kg
FROM public.croquettes
WHERE is_active = true AND approximate_price IS NOT NULL
GROUP BY brand, species
ORDER BY prix_moyen_kg DESC;

-- 12. Vérifier les doublons potentiels
SELECT
  brand,
  name,
  COUNT(*) as occurences
FROM public.croquettes
WHERE is_active = true
GROUP BY brand, name
HAVING COUNT(*) > 1;

-- 13. Statistiques nutritionnelles moyennes par espèce
SELECT
  species,
  COUNT(*) as nb_produits,
  ROUND(AVG(kcal_per_100g), 1) as kcal_moyen,
  ROUND(AVG(protein), 1) as proteine_moyenne,
  ROUND(AVG(fat), 1) as graisse_moyenne,
  ROUND(AVG(fiber), 1) as fibre_moyenne
FROM public.croquettes
WHERE is_active = true
AND protein IS NOT NULL
AND fat IS NOT NULL
AND fiber IS NOT NULL
GROUP BY species;

-- 14. Disponibilité par pays
SELECT
  availability,
  COUNT(*) as nombre_produits
FROM public.croquettes
WHERE is_active = true
GROUP BY availability;

-- 15. Résumé final
SELECT
  'Total produits actifs' as info,
  COUNT(*)::TEXT as valeur
FROM public.croquettes
WHERE is_active = true
UNION ALL
SELECT
  'Produits chiens',
  COUNT(*)::TEXT
FROM public.croquettes
WHERE is_active = true AND species = 'dog'
UNION ALL
SELECT
  'Produits chats',
  COUNT(*)::TEXT
FROM public.croquettes
WHERE is_active = true AND species = 'cat'
UNION ALL
SELECT
  'Marques uniques',
  COUNT(DISTINCT brand)::TEXT
FROM public.croquettes
WHERE is_active = true
UNION ALL
SELECT
  'Prix moyen (€/kg)',
  ROUND(AVG(approximate_price), 2)::TEXT
FROM public.croquettes
WHERE is_active = true AND approximate_price IS NOT NULL
UNION ALL
SELECT
  'Complétude nutritionnelle',
  ROUND(100.0 * COUNT(CASE WHEN protein IS NOT NULL AND fat IS NOT NULL AND fiber IS NOT NULL THEN 1 END) / COUNT(*), 1)::TEXT || '%'
FROM public.croquettes
WHERE is_active = true;
