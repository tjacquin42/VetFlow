/**
 * Product availability region
 */
export type Availability = 'france' | 'europe';

/**
 * Target species for the kibble
 */
export type KibbleSpecies = 'dog' | 'cat' | 'both';

/**
 * Kibble/croquette product information
 */
export interface Croquette {
  /** Unique identifier */
  id: string;
  /** Brand name (e.g., "Royal Canin", "Hills") */
  brand: string;
  /** Product name */
  name: string;
  /** Product range (e.g., "Veterinary", "Premium") */
  range: string;
  /** Target species */
  species: KibbleSpecies;
  /** Product type (e.g., "weight-control", "maintenance") */
  type: string;
  /** Kilocalories per 100 grams */
  kcalPer100g: number;
  /** Protein percentage (optional) */
  protein?: number;
  /** Fat percentage (optional) */
  fat?: number;
  /** Fiber percentage (optional) */
  fiber?: number;
  /** Product URL */
  productUrl: string;
  /** Approximate price per kilogram in euros (optional) */
  approximatePrice?: number;
  /** Availability region */
  availability: Availability;
  /** Product image URL (optional) */
  imageUrl?: string;
  /** Whether the product is currently active */
  isActive?: boolean;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Kibble search filters
 */
export interface CroquetteFilters {
  /** Filter by species */
  species?: KibbleSpecies;
  /** Filter by brand */
  brand?: string;
  /** Filter by type */
  type?: string;
  /** Search query */
  query?: string;
}

/**
 * Enhanced kibble recommendation with calculated quantities
 */
export interface CroquetteRecommendation {
  /** The kibble product */
  croquette: Croquette;
  /** Daily quantity needed in grams */
  dailyQuantityGrams: number;
  /** Quantity per meal in grams (default 2 meals/day) */
  quantityPerMeal: number;
  /** Daily cost in euros */
  dailyCost: number;
  /** Monthly cost in euros (30 days) */
  monthlyCost: number;
  /** Optional match score for ranking */
  matchScore?: number;
}

/**
 * Filters for kibble recommendations
 */
export interface CroquetteRecommendationFilters {
  /** Filter by brands (multiple selection) */
  brands?: string[];
  /** Filter by types (multiple selection) */
  types?: string[];
  /** Minimum daily price in euros */
  minPrice?: number;
  /** Maximum daily price in euros */
  maxPrice?: number;
  /** Minimum protein percentage */
  minProtein?: number;
  /** Maximum kcal per 100g */
  maxKcal?: number;
}

/**
 * Sort options for kibble recommendations
 */
export type CroquetteSortBy =
  | 'price-asc'
  | 'price-desc'
  | 'kcal-asc'
  | 'kcal-desc'
  | 'protein-desc'
  | 'match-score';
