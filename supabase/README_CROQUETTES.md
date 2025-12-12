# Base de Données Croquettes - VetFlow

## Vue d'ensemble

La base de données croquettes contient des informations nutritionnelles complètes sur différentes marques de croquettes pour chiens et chats disponibles en France et en Europe.

## Structure de la Table

```sql
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
```

## Import des Données

### 1. Import Initial via SQL

Exécuter les fichiers SQL dans l'ordre suivant dans le SQL Editor de Supabase:

```bash
1. schema.sql                            # Structure de la table
2. policies.sql                          # Politiques RLS
3. seed_croquettes.sql                   # 21 produits initiaux
4. seed_croquettes_extended.sql          # 40 produits supplémentaires
5. update_croquettes_missing_data.sql    # Compléter valeurs nutritionnelles
6. update_croquettes_prices.sql          # Ajouter prix approximatifs
```

### 2. Import via Script TypeScript

Le script TypeScript permet d'importer et mettre à jour des produits via l'API Supabase.

#### Configuration

Créer un fichier `.env` à la racine du projet:

```env
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_SERVICE_KEY=eyJ... # Clé service_role (pas anon!)
```

⚠️ **Important**: La `service_role` key permet de bypasser RLS. À utiliser uniquement en backend, jamais côté client!

#### Utilisation

```bash
# Afficher l'aide
pnpm import:croquettes

# Importer depuis un fichier JSON
pnpm import:croquettes import ./data/croquettes-example.json

# Mettre à jour des produits existants
pnpm import:croquettes update

# Afficher les statistiques
pnpm import:croquettes stats
```

#### Format JSON

```json
[
  {
    "brand": "Nom de la Marque",
    "name": "Nom du Produit",
    "range": "Gamme",
    "species": "dog",
    "type": "Adult",
    "kcal_per_100g": 380,
    "protein": 28.0,
    "fat": 15.0,
    "fiber": 2.5,
    "product_url": "https://...",
    "approximate_price": 4.50,
    "availability": "france",
    "is_active": true
  }
]
```

## Marques Disponibles

### Chiens
- **Premium Vétérinaire**: Hill's, Royal Canin, Pro Plan, Specific, Virbac
- **Premium**: Acana, Orijen, Edgard & Cooper, Carnilove, Brit
- **Grand Public**: Purina ONE, Cesar, Friskies, Ultima, Pedigree

### Chats
- **Premium Vétérinaire**: Hill's, Royal Canin, Specific, Virbac
- **Premium**: Carnilove, Brit, Edgard & Cooper, Oskan, Equilibre & Instinct
- **Grand Public**: Purina ONE, Whiskas, Perfect Fit, Félix, Ultima, Cat's Love, Jack & Dolly, Sheba

## Types de Produits

- **Adult**: Chiens et chats adultes
- **Puppy/Kitten**: Chiots et chatons en croissance
- **Senior**: Animaux âgés (7+)
- **Sterilised**: Animaux stérilisés/castrés
- **Light**: Contrôle du poids
- **Veterinary**: Gammes vétérinaires spécifiques

## Complétude des Données

Après l'import complet des fichiers SQL:
- **61 produits** au total (21 initiaux + 40 nouveaux)
- **100%** avec valeurs énergétiques (kcal/100g)
- **100%** avec protéines, graisses, fibres
- **100%** avec prix approximatifs
- **0%** avec images (à ajouter ultérieurement)

## Utilisation dans l'Application

Les croquettes sont utilisées pour:
1. Calculer les quantités journalières recommandées
2. Estimer le coût journalier de l'alimentation
3. Comparer différentes options nutritionnelles
4. Fournir des recommandations personnalisées aux vétérinaires

## Ajout de Nouvelles Marques

### Méthode 1: Via JSON

1. Créer un fichier JSON avec les nouvelles croquettes
2. Exécuter: `pnpm import:croquettes import ./data/nouveau-fichier.json`

### Méthode 2: Via SQL

1. Créer un fichier SQL avec des INSERT statements
2. Exécuter dans le SQL Editor de Supabase

### Méthode 3: Via Interface Supabase

1. Aller dans Table Editor > croquettes
2. Cliquer sur "Insert row"
3. Remplir les champs manuellement

## Sources de Données

- **Informations nutritionnelles**: Sites fabricants officiels
- **Prix**: Moyennes observées sur zooplus.fr, wanimo.com, terranimo.fr, bitiba.fr
- **URLs produits**: Sites officiels des marques

## Maintenance

- **Mise à jour des prix**: Exécuter périodiquement des requêtes UPDATE
- **Ajout de nouvelles marques**: Utiliser le script d'import
- **Vérification de la complétude**: `pnpm import:croquettes stats`

## Requêtes Utiles

```sql
-- Compter total de produits actifs
SELECT COUNT(*) FROM public.croquettes WHERE is_active = true;

-- Produits par espèce
SELECT species, COUNT(*) FROM public.croquettes
WHERE is_active = true
GROUP BY species;

-- Produits sans prix
SELECT brand, name FROM public.croquettes
WHERE approximate_price IS NULL AND is_active = true;

-- Marques les plus représentées
SELECT brand, COUNT(*) as nb_produits FROM public.croquettes
WHERE is_active = true
GROUP BY brand
ORDER BY nb_produits DESC;

-- Produits les plus chers
SELECT brand, name, approximate_price
FROM public.croquettes
WHERE is_active = true AND approximate_price IS NOT NULL
ORDER BY approximate_price DESC
LIMIT 10;
```
