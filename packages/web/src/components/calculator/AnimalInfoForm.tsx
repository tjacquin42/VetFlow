import { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { animalInfoSchema, type AnimalInfo } from '@vetflow/shared';
import { cn } from '@/lib/utils';

export interface AnimalInfoFormProps {
  onNext: (data: AnimalInfo) => void;
  initialData?: Partial<AnimalInfo>;
}

export function AnimalInfoForm({ onNext, initialData }: AnimalInfoFormProps) {
  const [formData, setFormData] = useState<Partial<AnimalInfo>>({
    name: initialData?.name || '',
    species: initialData?.species || 'dog',
    weight: initialData?.weight || 0,
    ageYears: initialData?.ageYears || 0,
    ageMonths: initialData?.ageMonths || 0,
    isNeutered: initialData?.isNeutered ?? false,
    bodyScore: initialData?.bodyScore || 5,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const validation = animalInfoSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onNext(validation.data);
  };

  const bodyScoreDescriptions = [
    '', // index 0 (pas utilisé)
    'Très maigre',
    'Maigre',
    'Mince',
    'Idéal bas',
    'Idéal',
    'Idéal haut',
    'Surpoids',
    'Obèse',
    'Très obèse',
  ];

  return (
    <Card title="Informations de l'animal" subtitle="Étape 1/2">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom (optionnel) */}
        <Input
          label="Nom de l'animal"
          type="text"
          value={formData.name || ''}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Ex: Max, Bella..."
        />

        {/* Espèce */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Espèce <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, species: 'dog' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                formData.species === 'dog'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-300 hover:border-secondary-400'
              )}
            >
              <div className="text-3xl mb-1">🐕</div>
              <div className="font-medium">Chien</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, species: 'cat' })}
              className={cn(
                'p-4 rounded-lg border-2 transition-all',
                formData.species === 'cat'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-300 hover:border-secondary-400'
              )}
            >
              <div className="text-3xl mb-1">🐈</div>
              <div className="font-medium">Chat</div>
            </button>
          </div>
          {errors.species && (
            <p className="text-sm text-danger-500 mt-1">{errors.species}</p>
          )}
        </div>

        {/* Poids */}
        <Input
          label="Poids actuel"
          type="number"
          value={formData.weight || ''}
          onChange={(value) =>
            setFormData({ ...formData, weight: parseFloat(value) || 0 })
          }
          unit="kg"
          min={0.1}
          max={100}
          step={0.1}
          required
          error={errors.weight}
          placeholder="Ex: 10.5"
        />

        {/* Âge */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Âge <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Années"
              type="number"
              value={formData.ageYears || ''}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  ageYears: parseInt(value) || 0,
                })
              }
              min={0}
              max={30}
              error={errors.ageYears}
            />
            <Input
              label="Mois"
              type="number"
              value={formData.ageMonths || ''}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  ageMonths: parseInt(value) || 0,
                })
              }
              min={0}
              max={11}
              error={errors.ageMonths}
            />
          </div>
        </div>

        {/* Stérilisé */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Stérilisé(e) ? <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isNeutered: true })}
              className={cn(
                'p-3 rounded-lg border-2 transition-all font-medium',
                formData.isNeutered
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-300 hover:border-secondary-400'
              )}
            >
              Oui
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isNeutered: false })}
              className={cn(
                'p-3 rounded-lg border-2 transition-all font-medium',
                !formData.isNeutered
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-secondary-300 hover:border-secondary-400'
              )}
            >
              Non
            </button>
          </div>
        </div>

        {/* Score corporel */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Score corporel (1-9) <span className="text-danger-500">*</span>
          </label>
          <div className="space-y-3">
            <input
              type="range"
              min={1}
              max={9}
              value={formData.bodyScore || 5}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bodyScore: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-secondary-600">
              <span>1 (maigre)</span>
              <span className="font-medium text-primary-600">
                {formData.bodyScore}/9 - {bodyScoreDescriptions[formData.bodyScore || 5]}
              </span>
              <span>9 (obèse)</span>
            </div>
          </div>
          {errors.bodyScore && (
            <p className="text-sm text-danger-500 mt-1">{errors.bodyScore}</p>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4">
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Continuer →
          </Button>
        </div>
      </form>
    </Card>
  );
}
