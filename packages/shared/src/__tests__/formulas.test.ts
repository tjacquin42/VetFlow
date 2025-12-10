import { describe, it, expect } from 'vitest';
import {
  calculateRER,
  getMERFactor,
  calculateMER,
  adjustForBodyScore,
  calculateEnergyRequirement,
  calculateKibbleQuantity,
  calculateQuantityPerMeal,
  calculateDailyCost,
} from '../lib/formulas';
import type { AnimalInfo, ObjectiveData } from '../types/animal';

describe('calculateRER', () => {
  it('calculates RER for a 10kg dog using standard formula', () => {
    const rer = calculateRER(10);
    expect(rer).toBeCloseTo(318, 0);
  });

  it('calculates RER for a 5kg cat using standard formula', () => {
    const rer = calculateRER(5);
    expect(rer).toBeCloseTo(234, 0);
  });

  it('uses simplified formula for animals under 2kg', () => {
    const rer = calculateRER(1.5);
    expect(rer).toBe(115); // 30 * 1.5 + 70
  });

  it('uses simplified formula for animals over 45kg', () => {
    const rer = calculateRER(50);
    expect(rer).toBe(1570); // 30 * 50 + 70
  });

  it('calculates RER for edge case at 2kg', () => {
    const rer = calculateRER(2);
    expect(rer).toBe(130); // Uses simplified formula
  });

  it('calculates RER for edge case at 45kg', () => {
    const rer = calculateRER(45);
    expect(rer).toBe(1420); // Uses simplified formula
  });
});

describe('getMERFactor', () => {
  it('returns correct factor for dog in gestation', () => {
    const factor = getMERFactor('dog', false, 'moderate', 'maintenance', 'gestation');
    expect(factor).toBe(3.0);
  });

  it('returns correct factor for cat in lactation', () => {
    const factor = getMERFactor('cat', false, 'moderate', 'maintenance', 'lactation');
    expect(factor).toBe(4.0);
  });

  it('returns correct factor for senior dog', () => {
    const factor = getMERFactor('dog', false, 'moderate', 'maintenance', 'senior');
    expect(factor).toBe(1.4);
  });

  it('returns correct factor for puppy growth', () => {
    const factor = getMERFactor('dog', false, 'moderate', 'growth', 'normal');
    expect(factor).toBe(2.0);
  });

  it('returns correct factor for kitten growth', () => {
    const factor = getMERFactor('cat', false, 'moderate', 'growth', 'normal');
    expect(factor).toBe(2.5);
  });

  it('returns 1.0 for weight loss goal', () => {
    const factor = getMERFactor('dog', false, 'moderate', 'weight-loss', 'normal');
    expect(factor).toBe(1.0);
  });

  it('returns 1.5 for weight gain goal', () => {
    const factor = getMERFactor('dog', false, 'moderate', 'weight-gain', 'normal');
    expect(factor).toBe(1.5);
  });

  it('returns correct factor for intact dog with high activity', () => {
    const factor = getMERFactor('dog', false, 'high', 'maintenance', 'normal');
    expect(factor).toBe(2.0);
  });

  it('returns correct factor for neutered dog with low activity', () => {
    const factor = getMERFactor('dog', true, 'low', 'maintenance', 'normal');
    expect(factor).toBe(1.4);
  });

  it('returns correct factor for intact cat with moderate activity', () => {
    const factor = getMERFactor('cat', false, 'moderate', 'maintenance', 'normal');
    expect(factor).toBe(1.4);
  });

  it('returns correct factor for neutered cat with low activity', () => {
    const factor = getMERFactor('cat', true, 'low', 'maintenance', 'normal');
    expect(factor).toBe(1.0);
  });
});

describe('calculateMER', () => {
  it('calculates MER for a 10kg neutered dog with moderate activity', () => {
    const rer = calculateRER(10);
    const { mer, factor } = calculateMER(rer, 'dog', true, 'moderate', 'maintenance', 'normal');

    expect(factor).toBe(1.6);
    expect(mer).toBeCloseTo(509, 0);
  });

  it('calculates MER for a 5kg neutered cat with low activity', () => {
    const rer = calculateRER(5);
    const { mer, factor } = calculateMER(rer, 'cat', true, 'low', 'maintenance', 'normal');

    expect(factor).toBe(1.0);
    expect(mer).toBeCloseTo(234, 0);
  });

  it('returns both MER and factor', () => {
    const rer = 300;
    const result = calculateMER(rer, 'dog', false, 'high', 'maintenance', 'normal');

    expect(result).toHaveProperty('mer');
    expect(result).toHaveProperty('factor');
    expect(result.mer).toBe(600); // 300 * 2.0
    expect(result.factor).toBe(2.0);
  });
});

describe('adjustForBodyScore', () => {
  it('increases energy by 15% for thin animals (score <= 3)', () => {
    const adjusted = adjustForBodyScore(500, 3);
    expect(adjusted).toBe(575); // 500 * 1.15
  });

  it('decreases energy by 25% for overweight animals (score >= 7)', () => {
    const adjusted = adjustForBodyScore(500, 7);
    expect(adjusted).toBe(375); // 500 * 0.75
  });

  it('does not adjust for ideal body score (4-6)', () => {
    expect(adjustForBodyScore(500, 4)).toBe(500);
    expect(adjustForBodyScore(500, 5)).toBe(500);
    expect(adjustForBodyScore(500, 6)).toBe(500);
  });

  it('increases energy for body score 1', () => {
    const adjusted = adjustForBodyScore(500, 1);
    expect(adjusted).toBe(575);
  });

  it('decreases energy for body score 9', () => {
    const adjusted = adjustForBodyScore(500, 9);
    expect(adjusted).toBe(375);
  });
});

describe('calculateEnergyRequirement', () => {
  const animalInfo: AnimalInfo = {
    name: 'Rex',
    species: 'dog',
    weight: 10,
    ageYears: 5,
    ageMonths: 0,
    isNeutered: true,
    bodyScore: 5,
  };

  const objectiveData: ObjectiveData = {
    goal: 'maintenance',
    activityLevel: 'moderate',
    physiologicalStatus: 'normal',
  };

  it('calculates complete energy requirements', () => {
    const result = calculateEnergyRequirement(animalInfo, objectiveData);

    expect(result).toHaveProperty('rer');
    expect(result).toHaveProperty('mer');
    expect(result).toHaveProperty('factor');
    expect(result).toHaveProperty('formulaDescription');
  });

  it('returns rounded values', () => {
    const result = calculateEnergyRequirement(animalInfo, objectiveData);

    expect(Number.isInteger(result.rer)).toBe(true);
    expect(Number.isInteger(result.mer)).toBe(true);
  });

  it('applies body score adjustment', () => {
    const thinAnimal = { ...animalInfo, bodyScore: 3 };
    const idealAnimal = { ...animalInfo, bodyScore: 5 };
    const overweightAnimal = { ...animalInfo, bodyScore: 7 };

    const thinResult = calculateEnergyRequirement(thinAnimal, objectiveData);
    const idealResult = calculateEnergyRequirement(idealAnimal, objectiveData);
    const overweightResult = calculateEnergyRequirement(overweightAnimal, objectiveData);

    expect(thinResult.mer).toBeGreaterThan(idealResult.mer);
    expect(overweightResult.mer).toBeLessThan(idealResult.mer);
  });

  it('includes formula description', () => {
    const result = calculateEnergyRequirement(animalInfo, objectiveData);

    expect(result.formulaDescription).toContain('RER');
    expect(result.formulaDescription).toContain('Factor');
    expect(result.formulaDescription).toContain('MER');
  });
});

describe('calculateKibbleQuantity', () => {
  it('calculates daily kibble quantity', () => {
    const quantity = calculateKibbleQuantity(500, 350);
    expect(quantity).toBeCloseTo(142.86, 1);
  });

  it('handles different kcal values', () => {
    const quantity = calculateKibbleQuantity(300, 400);
    expect(quantity).toBe(75);
  });
});

describe('calculateQuantityPerMeal', () => {
  it('calculates quantity per meal with default 2 meals', () => {
    const perMeal = calculateQuantityPerMeal(200);
    expect(perMeal).toBe(100);
  });

  it('calculates quantity per meal with custom meal count', () => {
    const perMeal = calculateQuantityPerMeal(300, 3);
    expect(perMeal).toBe(100);
  });

  it('handles single meal per day', () => {
    const perMeal = calculateQuantityPerMeal(150, 1);
    expect(perMeal).toBe(150);
  });
});

describe('calculateDailyCost', () => {
  it('calculates daily cost correctly', () => {
    const cost = calculateDailyCost(200, 10); // 200g at €10/kg
    expect(cost).toBe(2); // €2 per day
  });

  it('handles different prices', () => {
    const cost = calculateDailyCost(150, 15);
    expect(cost).toBe(2.25);
  });

  it('handles fractional amounts', () => {
    const cost = calculateDailyCost(75, 20);
    expect(cost).toBe(1.5);
  });
});
