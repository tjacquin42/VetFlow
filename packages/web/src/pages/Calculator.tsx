import { useState } from 'react';
import {
  calculateEnergyRequirement,
  type AnimalInfo,
  type ObjectiveData,
  type EnergyResult,
  type CalculationHistoryEntry,
} from '@vetflow/shared';
import { AnimalInfoForm } from '@/components/calculator/AnimalInfoForm';
import { ObjectiveForm } from '@/components/calculator/ObjectiveForm';
import { BEResult } from '@/components/calculator/BEResult';
import { HistoryPanel } from '@/components/calculator/HistoryPanel';
import { useCalculationHistory } from '@/hooks/useCalculationHistory';

type Step = 1 | 2 | 'result';

export function Calculator() {
  const [step, setStep] = useState<Step>(1);
  const [animalInfo, setAnimalInfo] = useState<AnimalInfo | null>(null);
  const [objectiveData, setObjectiveData] = useState<ObjectiveData | null>(null);
  const [result, setResult] = useState<EnergyResult | null>(null);

  const { history, saveCalculation, deleteCalculation } = useCalculationHistory();

  const handleAnimalInfoSubmit = (data: AnimalInfo) => {
    setAnimalInfo(data);
    setStep(2);
  };

  const handleObjectiveSubmit = (data: ObjectiveData) => {
    if (!animalInfo) return;

    setObjectiveData(data);
    const calculationResult = calculateEnergyRequirement(
      animalInfo,
      data
    );
    setResult(calculationResult);

    // Auto-save to history
    saveCalculation(animalInfo, data, calculationResult);

    setStep('result');
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleBackToObjectives = () => {
    // Go back to step 2 without losing data
    setResult(null);
    setStep(2);
  };

  const handleNewCalculation = () => {
    // Reset everything for a new calculation
    setAnimalInfo(null);
    setObjectiveData(null);
    setResult(null);
    setStep(1);
  };

  const handleLoadFromHistory = (entry: CalculationHistoryEntry) => {
    // Load all data from history entry
    setAnimalInfo(entry.animalInfo);
    setObjectiveData(entry.objectiveData);
    setResult(entry.result);
    setStep('result');
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-12">
      {/* History Panel */}
      <HistoryPanel
        history={history}
        onLoad={handleLoadFromHistory}
        onDelete={deleteCalculation}
      />

      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            Calculateur de Besoin Énergétique
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Calculez le besoin énergétique journalier de votre animal
          </p>
        </header>

        {/* Step Indicator */}
        {step !== 'result' && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${
                  step === 1
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white dark:bg-secondary-800 border-primary-500 text-primary-500 dark:text-primary-400'
                }`}
              >
                1
              </div>
              <div
                className={`h-1 w-16 ${
                  step === 2 ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-700'
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${
                  step === 2
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-400 dark:text-secondary-500'
                }`}
              >
                2
              </div>
            </div>
            <div className="flex justify-center gap-16 mt-2">
              <span
                className={`text-sm ${
                  step === 1
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-secondary-600 dark:text-secondary-400'
                }`}
              >
                Informations
              </span>
              <span
                className={`text-sm ${
                  step === 2
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-secondary-600 dark:text-secondary-400'
                }`}
              >
                Objectif
              </span>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div>
          {step === 1 && (
            <AnimalInfoForm
              onNext={handleAnimalInfoSubmit}
              initialData={animalInfo || undefined}
            />
          )}

          {step === 2 && animalInfo && (
            <ObjectiveForm
              animalInfo={animalInfo}
              initialData={objectiveData || undefined}
              onCalculate={handleObjectiveSubmit}
              onBack={handleBack}
            />
          )}

          {step === 'result' && result && animalInfo && (
            <BEResult
              result={result}
              animalInfo={animalInfo}
              onBackToObjectives={handleBackToObjectives}
              onNewCalculation={handleNewCalculation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
