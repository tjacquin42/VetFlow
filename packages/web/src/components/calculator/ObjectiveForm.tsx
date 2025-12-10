import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import {
  objectiveDataSchema,
  type AnimalInfo,
  type ObjectiveData,
  GOAL_LABELS,
  ACTIVITY_LEVEL_LABELS,
  PHYSIOLOGICAL_STATUS_LABELS,
} from '@vetflow/shared';
import { cn } from '@/lib/utils';

export interface ObjectiveFormProps {
  animalInfo: AnimalInfo;
  initialData?: Partial<ObjectiveData>;
  onCalculate: (objectiveData: ObjectiveData) => void;
  onBack: () => void;
}

export function ObjectiveForm({
  animalInfo,
  initialData,
  onCalculate,
  onBack,
}: ObjectiveFormProps) {
  const [formData, setFormData] = useState<Partial<ObjectiveData>>({
    goal: initialData?.goal || 'maintenance',
    activityLevel: initialData?.activityLevel || 'moderate',
    physiologicalStatus: initialData?.physiologicalStatus || 'normal',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const validation = objectiveDataSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err: { path: (string | number)[]; message: string }) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onCalculate(validation.data);
  };

  return (
    <Card title="Objectif nutritionnel" subtitle="Étape 2/2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Animal summary */}
        <div className="bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
          <p className="text-sm text-primary-900 dark:text-primary-200">
            <span className="font-medium">
              {animalInfo.name || 'Animal'} - {animalInfo.species === 'dog' ? 'Chien' : 'Chat'}
            </span>
            <br />
            {animalInfo.weight} kg • {animalInfo.ageYears} ans {animalInfo.ageMonths > 0 && `${animalInfo.ageMonths} mois`}
            {' • '}
            {animalInfo.isNeutered ? 'Stérilisé(e)' : 'Non stérilisé(e)'}
          </p>
        </div>

        {/* Goal */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
            Objectif nutritionnel <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(GOAL_LABELS) as Array<keyof typeof GOAL_LABELS>).map(
              (goal: keyof typeof GOAL_LABELS) => (
                <button
                  key={goal as string}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal })}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all duration-200 text-left animate-press hover:scale-105',
                    formData.goal === goal
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                      : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500 text-secondary-700 dark:text-secondary-300'
                  )}
                >
                  {GOAL_LABELS[goal]}
                </button>
              )
            )}
          </div>
          {errors.goal && (
            <p className="text-sm text-danger-500 mt-1">{errors.goal}</p>
          )}
        </div>

        {/* Activity Level */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
            Niveau d'activité <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(
              Object.keys(ACTIVITY_LEVEL_LABELS) as Array<
                keyof typeof ACTIVITY_LEVEL_LABELS
              >
            ).map((level: keyof typeof ACTIVITY_LEVEL_LABELS) => (
              <button
                key={level as string}
                type="button"
                onClick={() => setFormData({ ...formData, activityLevel: level })}
                className={cn(
                  'p-3 rounded-lg border-2 transition-all duration-200 text-center animate-press hover:scale-105',
                  formData.activityLevel === level
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500 text-secondary-700 dark:text-secondary-300'
                )}
              >
                {ACTIVITY_LEVEL_LABELS[level]}
              </button>
            ))}
          </div>
          {errors.activityLevel && (
            <p className="text-sm text-danger-500 mt-1">
              {errors.activityLevel}
            </p>
          )}
        </div>

        {/* Physiological Status */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
            Statut physiologique <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(
              Object.keys(PHYSIOLOGICAL_STATUS_LABELS) as Array<
                keyof typeof PHYSIOLOGICAL_STATUS_LABELS
              >
            ).map((status: keyof typeof PHYSIOLOGICAL_STATUS_LABELS) => (
              <button
                key={status as string}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, physiologicalStatus: status })
                }
                className={cn(
                  'p-3 rounded-lg border-2 transition-all duration-200 text-left animate-press hover:scale-105',
                  formData.physiologicalStatus === status
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'border-secondary-300 dark:border-secondary-600 hover:border-secondary-400 dark:hover:border-secondary-500 text-secondary-700 dark:text-secondary-300'
                )}
              >
                {PHYSIOLOGICAL_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          {errors.physiologicalStatus && (
            <p className="text-sm text-danger-500 mt-1">
              {errors.physiologicalStatus}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex gap-3">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            ← Retour
          </Button>
          <Button type="submit" variant="primary" size="lg" className="flex-1">
            Calculer
          </Button>
        </div>
      </form>
    </Card>
  );
}
