import type { AnimalInfo } from './animal';
import type { ObjectiveData } from './objective';
import type { EnergyResult } from './energy';

export interface CalculationHistoryEntry {
  id: string;
  timestamp: number;
  animalInfo: AnimalInfo;
  objectiveData: ObjectiveData;
  result: EnergyResult;
}

export interface CalculationHistory {
  entries: CalculationHistoryEntry[];
  maxEntries: 10;
}
