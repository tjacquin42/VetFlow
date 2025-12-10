import type { AnimalInfo, ObjectiveData } from './animal';
import type { EnergyResult } from './calculation';

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
