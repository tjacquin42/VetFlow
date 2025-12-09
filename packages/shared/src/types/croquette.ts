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
