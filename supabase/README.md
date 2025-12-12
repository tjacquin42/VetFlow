# VetFlow - Base de Données Supabase

Documentation de la structure de base de données pour l'application VetFlow.

## Structure de la Base de Données

### Table `croquettes`

Contient les informations sur les produits alimentaires (croquettes) pour chiens et chats.

#### Schéma

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `brand` | TEXT | NOT NULL | Marque du produit |
| `name` | TEXT | NOT NULL | Nom du produit |
| `range` | TEXT | | Gamme du produit |
| `species` | TEXT | NOT NULL, CHECK | Espèce ('dog', 'cat', 'both') |
| `type` | TEXT | | Type (Adult, Senior, Puppy, etc.) |
| `kcal_per_100g` | NUMERIC | NOT NULL, > 0 | Énergie en kcal/100g |
| `protein` | NUMERIC | 0-100 | Taux de protéines (%) |
| `fat` | NUMERIC | 0-100 | Taux de matières grasses (%) |
| `fiber` | NUMERIC | 0-100 | Taux de fibres (%) |
| `product_url` | TEXT | | URL du produit |
| `approximate_price` | NUMERIC | >= 0 | Prix approximatif (€/kg) |
| `availability` | TEXT | CHECK | Disponibilité ('france', 'europe') |
| `image_url` | TEXT | | URL de l'image du produit |
| `is_active` | BOOLEAN | DEFAULT true | Produit actif |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour |

#### Index

- `idx_croquettes_species`: Index sur `species` pour optimiser les recherches par espèce
- `idx_croquettes_is_active`: Index sur `is_active` pour filtrer les produits actifs
- `idx_croquettes_brand`: Index sur `brand` pour optimiser les recherches par marque

#### Politiques RLS (Row Level Security)

- **Lecture publique**: Tous les utilisateurs (authentifiés ou non) peuvent lire les croquettes actives (`is_active = true`)
- **Modification**: Seuls les utilisateurs authentifiés peuvent créer, modifier ou supprimer des croquettes

## Migrations

### Exécuter la Migration Initiale

#### Option 1: Via Supabase Dashboard (Recommandé pour la première fois)

1. Aller sur [https://supabase.com](https://supabase.com)
2. Sélectionner le projet **zcwqpwlcenbafkbczgtb**
3. Cliquer sur **SQL Editor** dans le menu de gauche
4. Cliquer sur **New query**
5. Copier le contenu de `/supabase/migrations/001_initial_schema.sql`
6. Coller dans l'éditeur SQL
7. Cliquer sur **Run** (ou Ctrl+Enter)

#### Option 2: Via MCP Supabase (Si configuré)

Si vous avez configuré le MCP Supabase dans Claude Code, vous pouvez exécuter directement:

```bash
# Le script sera exécuté via le MCP
```

### Vérifier l'Installation

Après l'exécution de la migration, vérifier que:

```sql
-- Vérifier que la table existe
SELECT COUNT(*) FROM public.croquettes;
-- Devrait retourner 22 produits

-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'croquettes';
-- Devrait afficher 2 politiques
```

## Ajouter de Nouvelles Croquettes

### Via SQL

```sql
INSERT INTO public.croquettes (
  brand, 
  name, 
  range, 
  species, 
  type, 
  kcal_per_100g, 
  protein, 
  fat, 
  fiber, 
  approximate_price, 
  availability
) VALUES (
  'Marque',
  'Nom du Produit',
  'Gamme',
  'dog', -- ou 'cat' ou 'both'
  'Adult',
  380,
  28,
  15,
  3.5,
  5.50,
  'france'
);
```

### Depuis l'Application (Futur)

Une interface d'administration sera ajoutée pour permettre l'ajout de croquettes directement depuis l'application web.

## Configuration MCP Supabase

Pour exécuter des requêtes SQL directement depuis Claude Code, configurez le MCP Supabase:

### Étape 1: Récupérer la Clé Service Role

1. Aller sur Supabase Dashboard
2. Projet Settings > API
3. Copier la **service_role** key (PAS la anon key)

### Étape 2: Configurer Claude Desktop

Éditer le fichier de configuration:

**macOS**: `~/.config/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Ajouter:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://zcwqpwlcenbafkbczgtb.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "YOUR_SERVICE_ROLE_KEY_HERE"
      }
    }
  }
}
```

### Étape 3: Redémarrer Claude Code

Redémarrer Claude Code pour charger la nouvelle configuration MCP.

## Données de Test

Le script de migration inclut 22 produits de test:

### Chiens (12 produits)
- Royal Canin: 3 produits (Adult, Weight Loss, Senior)
- Hill's Science Plan: 3 produits (Adult, Weight Loss, Senior)
- Purina ONE: 2 produits (Adult, Senior)
- Acana: 2 produits (Adult, Weight Loss)
- Orijen: 1 produit (Adult)
- Pro Plan: 1 produit (Adult)

### Chats (10 produits)
- Royal Canin: 3 produits (Indoor, Sterilised, Senior)
- Hill's Science Plan: 3 produits (Indoor, Weight Loss, Senior)
- Purina ONE: 2 produits (Indoor, Sterilised)
- Acana: 1 produit (Adult)
- Orijen: 1 produit (Adult)

## Dépannage

### Erreur: "relation public.croquettes does not exist"

**Cause**: La migration n'a pas été exécutée.

**Solution**: Exécuter le script `/supabase/migrations/001_initial_schema.sql` via le SQL Editor de Supabase.

### Erreur: "duplicate key value violates unique constraint"

**Cause**: Tentative d'insertion d'une croquette avec un ID qui existe déjà.

**Solution**: Ne pas spécifier l'`id` lors de l'insertion, il sera généré automatiquement.

### Erreur: "new row violates check constraint"

**Cause**: Une valeur ne respecte pas les contraintes (ex: `species` doit être 'dog', 'cat' ou 'both').

**Solution**: Vérifier que les valeurs insérées respectent les contraintes définies dans le schéma.

## Prochaines Tables (Optionnel)

### Table `calculs` (Historique des calculs)

Pour sauvegarder l'historique des calculs de besoin énergétique.

### Table `usage_tracking` (Analytics)

Pour suivre l'utilisation de l'application et respecter les limites des plans gratuits/premium.

## Support

Pour toute question sur la base de données, consulter:
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs/)
