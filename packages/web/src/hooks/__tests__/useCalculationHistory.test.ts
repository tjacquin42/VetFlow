import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalculationHistory } from '../useCalculationHistory';
import type { AnimalInfo, ObjectiveData, EnergyResult } from '@vetflow/shared';

const mockAnimalInfo: AnimalInfo = {
  name: 'Rex',
  species: 'dog',
  weight: 10,
  ageYears: 5,
  ageMonths: 0,
  isNeutered: true,
  bodyScore: 5,
};

const mockObjectiveData: ObjectiveData = {
  goal: 'maintenance',
  activityLevel: 'moderate',
  physiologicalStatus: 'normal',
};

const mockResult: EnergyResult = {
  rer: 318,
  mer: 509,
  factor: 1.6,
};

describe('useCalculationHistory', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with empty history', () => {
    const { result } = renderHook(() => useCalculationHistory());

    expect(result.current.history).toEqual([]);
  });

  it('loads history from localStorage on mount', () => {
    const storedHistory = {
      entries: [
        {
          id: '123',
          timestamp: Date.now(),
          animalInfo: mockAnimalInfo,
          objectiveData: mockObjectiveData,
          result: mockResult,
        },
      ],
      maxEntries: 10,
    };

    localStorage.setItem('calculation-history', JSON.stringify(storedHistory));

    const { result } = renderHook(() => useCalculationHistory());

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].id).toBe('123');
  });

  it('saves a calculation to history', () => {
    const { result } = renderHook(() => useCalculationHistory());

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].animalInfo).toEqual(mockAnimalInfo);
    expect(result.current.history[0].result).toEqual(mockResult);
  });

  it('saves calculation to localStorage', () => {
    const { result } = renderHook(() => useCalculationHistory());

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
    });

    const stored = localStorage.getItem('calculation-history');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored!);
    expect(parsed.entries).toHaveLength(1);
    expect(parsed.maxEntries).toBe(10);
  });

  it('adds new entries at the beginning of history', () => {
    const { result } = renderHook(() => useCalculationHistory());

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
    });

    const firstTimestamp = result.current.history[0].timestamp;

    act(() => {
      result.current.saveCalculation(
        { ...mockAnimalInfo, name: 'Max' },
        mockObjectiveData,
        mockResult
      );
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].animalInfo.name).toBe('Max');
    expect(result.current.history[0].timestamp).toBeGreaterThan(firstTimestamp);
  });

  it('limits history to max 10 entries', () => {
    const { result } = renderHook(() => useCalculationHistory());

    // Add 12 entries
    act(() => {
      for (let i = 0; i < 12; i++) {
        result.current.saveCalculation(
          { ...mockAnimalInfo, name: `Dog ${i}` },
          mockObjectiveData,
          mockResult
        );
      }
    });

    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0].animalInfo.name).toBe('Dog 11');
  });

  it('loads a calculation by id', () => {
    const { result } = renderHook(() => useCalculationHistory());

    let savedId: string;

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
      savedId = result.current.history[0].id;
    });

    const loaded = result.current.loadCalculation(savedId!);

    expect(loaded).toBeDefined();
    expect(loaded?.animalInfo).toEqual(mockAnimalInfo);
  });

  it('returns undefined for non-existent id', () => {
    const { result } = renderHook(() => useCalculationHistory());

    const loaded = result.current.loadCalculation('non-existent-id');

    expect(loaded).toBeUndefined();
  });

  it('deletes a calculation by id', () => {
    const { result } = renderHook(() => useCalculationHistory());

    let idToDelete: string;

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
      result.current.saveCalculation(
        { ...mockAnimalInfo, name: 'Max' },
        mockObjectiveData,
        mockResult
      );
      idToDelete = result.current.history[0].id;
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.deleteCalculation(idToDelete!);
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].animalInfo.name).toBe('Rex');
  });

  it('updates localStorage when deleting', () => {
    const { result } = renderHook(() => useCalculationHistory());

    let idToDelete: string;

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
      idToDelete = result.current.history[0].id;
      result.current.deleteCalculation(idToDelete);
    });

    const stored = localStorage.getItem('calculation-history');
    const parsed = JSON.parse(stored!);
    expect(parsed.entries).toHaveLength(0);
  });

  it('clears all history', () => {
    const { result } = renderHook(() => useCalculationHistory());

    act(() => {
      result.current.saveCalculation(
        mockAnimalInfo,
        mockObjectiveData,
        mockResult
      );
      result.current.saveCalculation(
        { ...mockAnimalInfo, name: 'Max' },
        mockObjectiveData,
        mockResult
      );
    });

    expect(result.current.history).toHaveLength(2);

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toHaveLength(0);
    expect(localStorage.getItem('calculation-history')).toBeNull();
  });

  it('handles corrupted localStorage data gracefully', () => {
    localStorage.setItem('calculation-history', 'invalid-json');

    const { result } = renderHook(() => useCalculationHistory());

    expect(result.current.history).toEqual([]);
  });
});
