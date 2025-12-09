/**
 * @vetflow/shared
 *
 * Shared code for VetFlow web and mobile applications
 * Contains types, formulas, validators, and constants
 */

// Export types
export type {
  Species,
  Goal,
  ActivityLevel,
  PhysiologicalStatus,
  AnimalInfo,
  ObjectiveData,
  AnimalData,
} from './types/animal';

export type {
  Availability,
  KibbleSpecies,
  Croquette,
  CroquetteFilters,
} from './types/croquette';

export type {
  KibbleResult,
  Calculation,
  CreateCalculationInput,
  EnergyResult,
} from './types/calculation';

export type {
  SubscriptionPlan,
  User,
  UpdateUserInput,
  UsageTracking,
} from './types/user';

// Export formulas
export {
  calculateRER,
  getMERFactor,
  calculateMER,
  adjustForBodyScore,
  calculateEnergyRequirement,
  calculateKibbleQuantity,
  calculateQuantityPerMeal,
  calculateDailyCost,
} from './lib/formulas';

// Export validators
export {
  animalInfoSchema,
  objectiveDataSchema,
  animalDataSchema,
  croquetteSchema,
  updateUserSchema,
  createCalculationSchema,
} from './lib/validators';

export type {
  AnimalInfoInput,
  ObjectiveDataInput,
  AnimalDataInput,
  CroquetteInput,
  UpdateUserInput as UpdateUserValidatorInput,
  CreateCalculationInput as CreateCalculationValidatorInput,
} from './lib/validators';

// Export constants
export * from './lib/constants';
