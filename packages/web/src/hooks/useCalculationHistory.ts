import { useState, useEffect } from 'react';
import type {
  CalculationHistoryEntry,
  AnimalInfo,
  ObjectiveData,
  EnergyResult,
} from '@vetflow/shared';

const STORAGE_KEY = 'calculation-history';
const MAX_ENTRIES = 10;

export function useCalculationHistory() {
  const [history, setHistory] = useState<CalculationHistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.entries || []);
      } catch (error) {
        console.error('Failed to parse calculation history:', error);
        setHistory([]);
      }
    }
  }, []);

  // Save calculation to history
  const saveCalculation = (
    animalInfo: AnimalInfo,
    objectiveData: ObjectiveData,
    result: EnergyResult
  ) => {
    const entry: CalculationHistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      animalInfo,
      objectiveData,
      result,
    };

    // Add new entry at the beginning, keep max 10
    const newHistory = [entry, ...history].slice(0, MAX_ENTRIES);
    setHistory(newHistory);

    // Save to localStorage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        entries: newHistory,
        maxEntries: MAX_ENTRIES,
      })
    );
  };

  // Load a calculation from history
  const loadCalculation = (id: string): CalculationHistoryEntry | undefined => {
    return history.find((entry) => entry.id === id);
  };

  // Delete a calculation from history
  const deleteCalculation = (id: string) => {
    const newHistory = history.filter((entry) => entry.id !== id);
    setHistory(newHistory);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        entries: newHistory,
        maxEntries: MAX_ENTRIES,
      })
    );
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    saveCalculation,
    loadCalculation,
    deleteCalculation,
    clearHistory,
  };
}
