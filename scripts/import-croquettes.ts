import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''; // Service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Types
interface CroquetteData {
  brand: string;
  name: string;
  range: string;
  species: 'dog' | 'cat' | 'both';
  type: string;
  kcal_per_100g: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  product_url: string;
  approximate_price?: number;
  availability: 'france' | 'europe';
  image_url?: string;
  is_active: boolean;
}

// Fonction d'import
async function importCroquettes(croquettes: CroquetteData[]) {
  console.log(`🚀 Import de ${croquettes.length} croquettes...`);

  try {
    const { data, error } = await supabase
      .from('croquettes')
      .insert(croquettes)
      .select();

    if (error) {
      console.error('❌ Erreur lors de l\'import:', error);
      process.exit(1);
    }

    console.log(`✅ ${data?.length} croquettes importées avec succès !`);
    console.log('Produits ajoutés:');
    data?.forEach((c: any) => console.log(`  - ${c.brand} ${c.name}`));
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

// Fonction pour mettre à jour des produits existants
async function updateCroquettes() {
  console.log('🔄 Mise à jour des produits existants...');

  const updates = [
    {
      brand: 'Edgard & Cooper',
      name: 'Puppy Salmon & Turkey',
      updates: { protein: 28.0, fat: 15.0, fiber: 3.5 },
    },
    {
      brand: 'Edgard & Cooper',
      name: 'Adult Salmon',
      updates: { protein: 27.0, fat: 14.0, fiber: 3.0 },
    },
    {
      brand: 'Edgard & Cooper',
      name: 'Adult Chicken/Lamb',
      updates: { protein: 26.0, fat: 13.5, fiber: 3.2 },
    },
    {
      brand: 'Edgard & Cooper',
      name: 'Senior Chicken & Salmon',
      updates: { protein: 24.0, fat: 11.0, fiber: 4.0 },
    },
    {
      brand: 'Jack & Dolly',
      name: 'Connaisseur Sterilised Salmon & Whitefish',
      updates: { protein: 34.0, fat: 12.0, fiber: 2.8 },
    },
  ];

  for (const { brand, name, updates: data } of updates) {
    const { error } = await supabase
      .from('croquettes')
      .update(data)
      .eq('brand', brand)
      .eq('name', name);

    if (error) {
      console.error(`❌ Erreur pour ${brand} ${name}:`, error);
    } else {
      console.log(`✅ ${brand} ${name} mis à jour`);
    }
  }
}

// Fonction pour importer depuis un fichier JSON
async function importFromJSON(filePath: string) {
  console.log(`📂 Import depuis ${filePath}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Fichier introuvable: ${filePath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const croquettes: CroquetteData[] = JSON.parse(fileContent);

  await importCroquettes(croquettes);
}

// Fonction pour afficher les statistiques
async function showStats() {
  console.log('📊 Statistiques de la base de données croquettes...\n');

  try {
    // Total
    const { count: total, error: totalError } = await supabase
      .from('croquettes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (totalError) throw totalError;
    console.log(`Total de produits actifs: ${total}`);

    // Par espèce
    const { data: bySpecies, error: speciesError } = await supabase
      .from('croquettes')
      .select('species')
      .eq('is_active', true);

    if (speciesError) throw speciesError;
    const speciesCount = bySpecies.reduce((acc: any, curr: any) => {
      acc[curr.species] = (acc[curr.species] || 0) + 1;
      return acc;
    }, {});
    console.log('\nPar espèce:');
    Object.entries(speciesCount).forEach(([species, count]) => {
      console.log(`  - ${species}: ${count}`);
    });

    // Par marque
    const { data: byBrand, error: brandError } = await supabase
      .from('croquettes')
      .select('brand')
      .eq('is_active', true);

    if (brandError) throw brandError;
    const brandCount = byBrand.reduce((acc: any, curr: any) => {
      acc[curr.brand] = (acc[curr.brand] || 0) + 1;
      return acc;
    }, {});
    console.log('\nPar marque (top 10):');
    Object.entries(brandCount)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([brand, count]) => {
        console.log(`  - ${brand}: ${count}`);
      });

    // Complétude des données
    const { data: allProducts, error: allError } = await supabase
      .from('croquettes')
      .select('protein, fat, fiber, approximate_price, image_url')
      .eq('is_active', true);

    if (allError) throw allError;
    const completeness = {
      protein: allProducts.filter(p => p.protein !== null).length,
      fat: allProducts.filter(p => p.fat !== null).length,
      fiber: allProducts.filter(p => p.fiber !== null).length,
      price: allProducts.filter(p => p.approximate_price !== null).length,
      image: allProducts.filter(p => p.image_url !== null).length,
    };

    console.log('\nComplétude des données:');
    console.log(`  - Avec protéines: ${completeness.protein}/${total} (${Math.round(completeness.protein / (total || 1) * 100)}%)`);
    console.log(`  - Avec graisses: ${completeness.fat}/${total} (${Math.round(completeness.fat / (total || 1) * 100)}%)`);
    console.log(`  - Avec fibres: ${completeness.fiber}/${total} (${Math.round(completeness.fiber / (total || 1) * 100)}%)`);
    console.log(`  - Avec prix: ${completeness.price}/${total} (${Math.round(completeness.price / (total || 1) * 100)}%)`);
    console.log(`  - Avec images: ${completeness.image}/${total} (${Math.round(completeness.image / (total || 1) * 100)}%)`);

  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

// Exécution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('   Assurez-vous que SUPABASE_URL et SUPABASE_SERVICE_KEY sont définis.');
    process.exit(1);
  }

  if (command === 'import') {
    const filePath = args[1];
    if (!filePath) {
      console.error('❌ Fournir le chemin du fichier JSON');
      console.error('   Usage: pnpm import:croquettes import <file.json>');
      process.exit(1);
    }
    await importFromJSON(filePath);
  } else if (command === 'update') {
    await updateCroquettes();
  } else if (command === 'stats') {
    await showStats();
  } else {
    console.log(`
📦 Script d'import de croquettes VetFlow

Usage:
  pnpm import:croquettes import <file.json>  - Importer depuis un fichier JSON
  pnpm import:croquettes update              - Mettre à jour produits existants
  pnpm import:croquettes stats               - Afficher statistiques

Exemples:
  pnpm import:croquettes import ./data/croquettes-new.json
  pnpm import:croquettes update
  pnpm import:croquettes stats

Configuration:
  Variables d'environnement requises:
  - SUPABASE_URL: URL de votre projet Supabase
  - SUPABASE_SERVICE_KEY: Clé service_role (pas anon!)
    `);
  }
}

main();
