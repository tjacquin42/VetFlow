/**
 * Animal species supported by VetFlow
 */
export type Species = 'dog' | 'cat';

/**
 * Nutritional goal for the animal
 */
export type Goal = 'maintenance' | 'weight-loss' | 'weight-gain' | 'growth';

/**
 * Activity level of the animal
 */
export type ActivityLevel = 'low' | 'moderate' | 'high';

/**
 * Physiological status of the animal
 */
export type PhysiologicalStatus = 'normal' | 'gestation' | 'lactation' | 'senior';

/**
 * Basic information about an animal
 */
export interface AnimalInfo {
  /** Optional animal name */
  name?: string;
  /** Species (dog or cat) */
  species: Species;
  /** Current weight in kilograms */
  weight: number;
  /** Age in years */
  ageYears: number;
  /** Age in months (0-11) */
  ageMonths: number;
  /** Whether the animal is neutered/spayed */
  isNeutered: boolean;
  /** Body condition score (1-9 scale, 5 being ideal) */
  bodyScore: number;
}

/**
 * Nutritional objective and activity data
 */
export interface ObjectiveData {
  /** Nutritional goal */
  goal: Goal;
  /** Activity level */
  activityLevel: ActivityLevel;
  /** Physiological status */
  physiologicalStatus: PhysiologicalStatus;
}

/**
 * Complete animal data including info and objectives
 */
export interface AnimalData extends AnimalInfo, ObjectiveData {}
