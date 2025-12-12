-- Seed data for croquettes table
-- Source: Infos croquettes & kcal.md

-- Dog food (Chiens)
INSERT INTO public.croquettes (brand, name, range, species, type, kcal_per_100g, protein, fat, fiber, product_url, approximate_price, availability, is_active) VALUES
('Hill''s', 'Science Plan Small & Mini Mature Adult 7+', 'Science Plan', 'dog', 'Senior', 368, 17.4, 14.0, 1.8, 'https://www.hillspet.fr/dog-food/science-plan-small-mini-mature-adult-7-chicken-dry', NULL, 'france', true),
('Royal Canin', 'Medium Adult', 'Size Health Nutrition', 'dog', 'Adult', 384, 25.0, 14.0, 1.2, 'https://www.terranimo.fr/royal-canin-medium-croquettes-chien-race-moyenne.html', NULL, 'france', true),
('Pro Plan', 'Light/Sterilised All Sizes Adult au Poulet', 'Pro Plan', 'dog', 'Light/Sterilised', 330, 27.0, 9.0, 3.0, 'https://www.wanimo.com/products/pro-plan-light-sterilised-all-sizes-adult-au-poulet-croquettes-pour-chien', NULL, 'france', true),
('Edgard & Cooper', 'Puppy Salmon & Turkey', 'Edgard & Cooper', 'dog', 'Puppy', 393, NULL, NULL, NULL, 'https://www.edgardcooper.com', NULL, 'europe', true),
('Edgard & Cooper', 'Adult Salmon', 'Edgard & Cooper', 'dog', 'Adult', 391, NULL, NULL, NULL, 'https://www.edgardcooper.com', NULL, 'europe', true),
('Edgard & Cooper', 'Adult Chicken/Lamb', 'Edgard & Cooper', 'dog', 'Adult', 382, NULL, NULL, NULL, 'https://www.edgardcooper.com', NULL, 'europe', true),
('Edgard & Cooper', 'Senior Chicken & Salmon', 'Edgard & Cooper', 'dog', 'Senior', 346, NULL, NULL, NULL, 'https://www.edgardcooper.com', NULL, 'europe', true),
('Pedigree', 'Dry Food Adult Mini with Beef & Vegetables', 'Pedigree', 'dog', 'Adult', 375, NULL, NULL, NULL, 'https://furryland.com.mt/products/pedigree-dry-food-adult-mini-with-beef-and-vegetables-2kgs', NULL, 'europe', true),
('Acana', 'Light & Fit Recipe', 'Acana', 'dog', 'Light', 307, NULL, NULL, NULL, 'https://furryland.com.mt/products/acana-light-fit-recipe-dry-food-2kgs', NULL, 'europe', true),
('Orijen', 'Tundra Dry Dog Food', 'Orijen', 'dog', 'Adult', 386, NULL, NULL, NULL, 'https://www.petsathome.com/product/orijen-complete-dry-adult-dog-food-tundra-goat-wild-boar-and-venison', NULL, 'europe', true);

-- Cat food (Chats)
INSERT INTO public.croquettes (brand, name, range, species, type, kcal_per_100g, protein, fat, fiber, product_url, approximate_price, availability, is_active) VALUES
('Perfect Fit', 'Cat Senior 7+ with Chicken', 'Perfect Fit', 'cat', 'Senior', 379, 35.0, 13.0, 3.2, 'https://www.buchmann.ch/fr/perfect-fit-croquettes-cat-senior-au-poulet-14-kg', NULL, 'europe', true),
('Whiskas', 'Adult 1+ croquettes au poulet', 'Whiskas', 'cat', 'Adult', 378, 30.0, 12.4, 1.8, 'https://www.ornibird.com/whiskas/22818-adult-1-delicieuses-croquettes-au-poulet-19kg-whiskas', NULL, 'france', true),
('Hill''s', 'Science Plan Mature Adult 7+ Chicken', 'Science Plan', 'cat', 'Senior', 402, 30.6, 18.9, 1.1, 'https://www.hillspet.fr/cat-food/science-plan-mature-adult-7-chicken-dry', NULL, 'france', true),
('Royal Canin', 'Sterilised 37', 'Feline Health Nutrition', 'cat', 'Sterilised', 363, 37.0, 12.0, 6.2, 'https://www.terranimo.fr/royal-canin-sterilised-37-croquettes-chat-castre.html', NULL, 'france', true),
('Royal Canin', 'Regular Fit 32', 'Feline Health Nutrition', 'cat', 'Adult', 383, 32.0, 15.0, 4.6, 'https://www.terranimo.fr/royal-canin-regular-fit-32-croquettes-poids-chat.html', NULL, 'france', true),
('Whiskas', 'Adult+1 Chicken (Fera)', 'Whiskas', 'cat', 'Adult', 375, 32.0, 12.5, 1.5, 'https://fera.fr/whiskas-adult1-nourriture-seche-pour-chat-au-poulet', NULL, 'france', true),
('Whiskas', '1+ with Chicken (ZooArt)', 'Whiskas', 'cat', 'Adult', 378, NULL, 12.1, 1.5, 'https://zooart.fr/product-fre-23029-WHISKAS-Croquettes-pour-chat-1-avec-poulet-7kg.html', NULL, 'france', true),
('Cat''s Love', 'Adult Poultry', 'Cat''s Love', 'cat', 'Adult', 392, 31.0, 16.0, 2.0, 'https://www.equusvitalis.fr/cats-love/croquettes-pour-chat-adulte-volaille', NULL, 'france', true),
('Equilibre & Instinct', 'Adult Poultry', 'Equilibre & Instinct', 'cat', 'Adult', 500, 33.7, 12.3, 1.2, 'https://www.polytrans.fr/croquettes-pour-chat-adulte-equilibre-instinct-volaille-fraiche.html', NULL, 'france', true),
('Oskan', 'Adult Poultry', 'Oskan', 'cat', 'Adult', 422, 34.0, 16.0, 2.5, 'https://www.oskan.fr/croquettes-chats-adultes-volaille', NULL, 'france', true),
('Jack & Dolly', 'Connaisseur Sterilised Salmon & Whitefish', 'Jack & Dolly', 'cat', 'Sterilised', 377, NULL, NULL, NULL, 'https://jacketdolly-lyon.fr/croquettes-chat-sterilise', NULL, 'france', true);

-- Note: Les valeurs NULL correspondent aux informations non disponibles dans le fichier source
-- Les prix approximatifs devront être ajoutés manuellement ou via une API de prix
