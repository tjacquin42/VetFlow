import type {
  Species,
  Goal,
  ActivityLevel,
  PhysiologicalStatus,
  AnimalInfo,
  ObjectiveData,
} from '../types/animal';
import type { EnergyResult } from '../types/calculation';

/**
 * Calculate RER (Resting Energy Requirement)
 *
 * Formula: 70 × (weight in kg)^0.75
 * Simplified for small animals (<2kg or >45kg): 30 × weight + 70
 *
 * @param weight - Animal weight in kilograms
 * @returns RER in kcal/day
 */
export function calculateRER(weight: number): number {
  if (weight < 2 || weight > 45) {
    return 30 * weight + 70;
  }
  return 70 * Math.pow(weight, 0.75);
}

/**
 * Get the multiplication factor for MER calculation
 * Based on species, neutering status, activity level, goal, and physiological status
 *
 * @param species - Dog or cat
 * @param isNeutered - Whether the animal is neutered/spayed
 * @param activityLevel - Activity level
 * @param goal - Nutritional goal
 * @param physiologicalStatus - Physiological status
 * @returns Multiplication factor for RER
 */
export function getMERFactor(
  species: Species,
  isNeutered: boolean,
  activityLevel: ActivityLevel,
  goal: Goal,
  physiologicalStatus: PhysiologicalStatus
): number {
  // Special cases for physiological status (override other factors)
  if (physiologicalStatus === 'gestation') {
    return species === 'dog' ? 3.0 : 2.0;
  }
  if (physiologicalStatus === 'lactation') {
    return species === 'dog' ? 6.0 : 4.0;
  }
  if (physiologicalStatus === 'senior') {
    return species === 'dog' ? 1.4 : 1.1;
  }

  // Handle growth
  if (goal === 'growth') {
    return species === 'dog' ? 2.0 : 2.5;
  }

  // Handle weight loss
  if (goal === 'weight-loss') {
    return 1.0;
  }

  // Handle weight gain
  if (goal === 'weight-gain') {
    return 1.5;
  }

  // Maintenance goal - depends on neutering status and activity
  if (species === 'dog') {
    if (!isNeutered) {
      return activityLevel === 'high' ? 2.0 : activityLevel === 'moderate' ? 1.8 : 1.6;
    } else {
      return activityLevel === 'high' ? 1.8 : activityLevel === 'moderate' ? 1.6 : 1.4;
    }
  } else {
    // Cat
    if (!isNeutered) {
      return activityLevel === 'high' ? 1.6 : activityLevel === 'moderate' ? 1.4 : 1.2;
    } else {
      return activityLevel === 'high' ? 1.4 : activityLevel === 'moderate' ? 1.2 : 1.0;
    }
  }
}

/**
 * Calculate MER (Maintenance Energy Requirement)
 *
 * MER = RER × factor (based on species, status, goal)
 *
 * @param rer - Resting Energy Requirement
 * @param species - Dog or cat
 * @param isNeutered - Whether the animal is neutered/spayed
 * @param activityLevel - Activity level
 * @param goal - Nutritional goal
 * @param physiologicalStatus - Physiological status
 * @returns Object containing MER and the factor used
 */
export function calculateMER(
  rer: number,
  species: Species,
  isNeutered: boolean,
  activityLevel: ActivityLevel,
  goal: Goal,
  physiologicalStatus: PhysiologicalStatus
): { mer: number; factor: number } {
  const factor = getMERFactor(species, isNeutered, activityLevel, goal, physiologicalStatus);
  const mer = rer * factor;

  return { mer, factor };
}

/**
 * Adjust energy requirement based on body condition score
 *
 * - Score <= 3 (too thin): increase by 15%
 * - Score >= 7 (overweight): reduce by 25%
 * - Score 4-6: no adjustment
 *
 * @param energyRequirement - Base energy requirement (usually MER)
 * @param bodyScore - Body condition score (1-9 scale)
 * @returns Adjusted energy requirement
 */
export function adjustForBodyScore(
  energyRequirement: number,
  bodyScore: number
): number {
  if (bodyScore <= 3) {
    // Too thin: increase by 15%
    return energyRequirement * 1.15;
  } else if (bodyScore >= 7) {
    // Overweight: reduce by 25%
    return energyRequirement * 0.75;
  }
  // Ideal body score (4-6): no adjustment
  return energyRequirement;
}

/**
 * Calculate complete energy requirements for an animal
 *
 * @param animalInfo - Animal information
 * @param objectiveData - Objective and activity data
 * @returns Complete energy calculation result
 */
export function calculateEnergyRequirement(
  animalInfo: AnimalInfo,
  objectiveData: ObjectiveData
): EnergyResult {
  // Step 1: Calculate RER
  const rer = calculateRER(animalInfo.weight);

  // Step 2: Calculate MER
  const { mer: baseMER, factor } = calculateMER(
    rer,
    animalInfo.species,
    animalInfo.isNeutered,
    objectiveData.activityLevel,
    objectiveData.goal,
    objectiveData.physiologicalStatus
  );

  // Step 3: Adjust for body score
  const finalMER = adjustForBodyScore(baseMER, animalInfo.bodyScore);

  // Create formula description
  const formulaDescription = `RER = ${rer.toFixed(1)} kcal/day, Factor = ${factor}, MER = ${finalMER.toFixed(1)} kcal/day`;

  return {
    rer: Math.round(rer),
    mer: Math.round(finalMER),
    factor,
    formulaDescription,
  };
}

/**
 * Calculate kibble quantity needed per day
 *
 * Formula: (Energy requirement × 100) / kcal per 100g
 *
 * @param energyRequirement - Daily energy requirement in kcal
 * @param kcalPer100g - Kilocalories per 100 grams of kibble
 * @returns Daily quantity in grams
 */
export function calculateKibbleQuantity(
  energyRequirement: number,
  kcalPer100g: number
): number {
  return (energyRequirement * 100) / kcalPer100g;
}

/**
 * Calculate kibble quantity per meal (assuming 2 meals per day)
 *
 * @param dailyQuantity - Daily quantity in grams
 * @param mealsPerDay - Number of meals per day (default: 2)
 * @returns Quantity per meal in grams
 */
export function calculateQuantityPerMeal(
  dailyQuantity: number,
  mealsPerDay: number = 2
): number {
  return dailyQuantity / mealsPerDay;
}

/**
 * Calculate daily cost for kibble
 *
 * @param dailyQuantity - Daily quantity in grams
 * @param pricePerKg - Price per kilogram in euros
 * @returns Daily cost in euros
 */
export function calculateDailyCost(
  dailyQuantity: number,
  pricePerKg: number
): number {
  return (dailyQuantity / 1000) * pricePerKg;
}
