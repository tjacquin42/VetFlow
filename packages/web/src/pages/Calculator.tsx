import { useState } from 'react';
import {
  calculateEnergyRequirement,
  type AnimalInfo,
  type ObjectiveData,
  type EnergyResult,
} from '@vetflow/shared';
import { AnimalInfoForm } from '@/components/calculator/AnimalInfoForm';
import { ObjectiveForm } from '@/components/calculator/ObjectiveForm';
import { BEResult } from '@/components/calculator/BEResult';

type Step = 1 | 2 | 'result';

export function Calculator() {
  const [step, setStep] = useState<Step>(1);
  const [animalInfo, setAnimalInfo] = useState<AnimalInfo | null>(null);
  const [result, setResult] = useState<EnergyResult | null>(null);

  const handleAnimalInfoSubmit = (data: AnimalInfo) => {
    setAnimalInfo(data);
    setStep(2);
  };

  const handleObjectiveSubmit = (objectiveData: ObjectiveData) => {
    if (!animalInfo) return;

    const calculationResult = calculateEnergyRequirement(
      animalInfo,
      objectiveData
    );
    setResult(calculationResult);
    setStep('result');
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleNewCalculation = () => {
    setAnimalInfo(null);
    setResult(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Calculateur de Besoin Énergétique
          </h1>
          <p className="text-secondary-600">
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
                    : 'bg-white border-primary-500 text-primary-500'
                }`}
              >
                1
              </div>
              <div
                className={`h-1 w-16 ${
                  step === 2 ? 'bg-primary-500' : 'bg-secondary-300'
                }`}
              />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium ${
                  step === 2
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-white border-secondary-300 text-secondary-400'
                }`}
              >
                2
              </div>
            </div>
            <div className="flex justify-center gap-16 mt-2">
              <span
                className={`text-sm ${
                  step === 1
                    ? 'text-primary-600 font-medium'
                    : 'text-secondary-600'
                }`}
              >
                Informations
              </span>
              <span
                className={`text-sm ${
                  step === 2
                    ? 'text-primary-600 font-medium'
                    : 'text-secondary-600'
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
              onCalculate={handleObjectiveSubmit}
              onBack={handleBack}
            />
          )}

          {step === 'result' && result && animalInfo && (
            <BEResult
              result={result}
              animalInfo={animalInfo}
              onNewCalculation={handleNewCalculation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
