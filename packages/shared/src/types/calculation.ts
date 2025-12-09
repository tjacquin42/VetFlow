import type { AnimalInfo, ObjectiveData } from './animal';

/**
 * Result of calculating kibble quantity for one product
 */
export interface KibbleResult {
  /** Croquette ID */
  croquetteId: string;
  /** Daily quantity in grams */
  dailyQuantity: number;
  /** Quantity per meal in grams (assuming 2 meals/day) */
  quantityPerMeal: number;
  /** Daily cost in euros */
  dailyCost: number;
}

/**
 * Complete calculation result
 */
export interface Calculation {
  /** Unique calculation ID */
  id: string;
  /** User ID who performed the calculation */
  userId: string;
  /** Animal information */
  animalInfo: AnimalInfo;
  /** Objective data */
  objectiveData: ObjectiveData;
  /** Resting Energy Requirement (kcal/day) */
  rer: number;
  /** Maintenance Energy Requirement (kcal/day) */
  mer: number;
  /** Factor used to calculate MER from RER */
  factor: number;
  /** Selected kibbles with calculated quantities */
  selectedCroquettes: KibbleResult[];
  /** Creation timestamp */
  createdAt: string;
}

/**
 * Input for creating a new calculation
 */
export interface CreateCalculationInput {
  animalInfo: AnimalInfo;
  objectiveData: ObjectiveData;
  selectedCroquetteIds: string[];
}

/**
 * Energy calculation result
 */
export interface EnergyResult {
  /** Resting Energy Requirement (kcal/day) */
  rer: number;
  /** Maintenance Energy Requirement (kcal/day) */
  mer: number;
  /** Factor used (MER = RER × factor) */
  factor: number;
  /** Formula description */
  formulaDescription: string;
}
