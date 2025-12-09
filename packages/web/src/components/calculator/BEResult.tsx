import { Button, Heading, Text, Badge } from '@vetflow/ui';
import { Card } from '@/components/ui';
import type { AnimalInfo, EnergyResult } from '@vetflow/shared';

export interface BEResultProps {
  result: EnergyResult;
  animalInfo: AnimalInfo;
  onNewCalculation: () => void;
}

export function BEResult({
  result,
  animalInfo,
  onNewCalculation,
}: BEResultProps) {
  return (
    <div className="space-y-6">
      {/* Animal Summary */}
      <Card variant="outlined">
        <div className="text-center">
          <div className="text-4xl mb-2">
            {animalInfo.species === 'dog' ? '🐕' : '🐈'}
          </div>
          <Heading level={3}>
            {animalInfo.name || 'Animal sans nom'}
          </Heading>
          <Text className="mt-1">
            {animalInfo.species === 'dog' ? 'Chien' : 'Chat'} • {animalInfo.weight} kg
            {' • '}
            {animalInfo.ageYears} ans
            {animalInfo.ageMonths > 0 && ` ${animalInfo.ageMonths} mois`}
          </Text>
        </div>
      </Card>

      {/* Main Result */}
      <Card variant="elevated" title="Besoin Énergétique">
        <div className="text-center space-y-6">
          {/* MER - Main result */}
          <div>
            <div className="text-5xl font-bold text-primary-600">
              {result.mer}
              <span className="text-2xl text-secondary-500 ml-2">
                kcal/jour
              </span>
            </div>
            <p className="text-sm text-secondary-600 mt-2">
              Besoin Énergétique Journalier (MER)
            </p>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-secondary-200">
            <div>
              <div className="text-2xl font-semibold text-secondary-900">
                {result.rer}
              </div>
              <p className="text-sm text-secondary-600 mt-1">
                RER (kcal/jour)
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                Besoins au repos
              </p>
            </div>

            <div>
              <div className="text-2xl font-semibold text-secondary-900">
                ×{result.factor.toFixed(2)}
              </div>
              <p className="text-sm text-secondary-600 mt-1">Facteur</p>
              <p className="text-xs text-secondary-500 mt-1">
                Multiplicateur
              </p>
            </div>

            <div>
              <div className="text-2xl font-semibold text-secondary-900">
                {result.mer}
              </div>
              <p className="text-sm text-secondary-600 mt-1">
                MER (kcal/jour)
              </p>
              <p className="text-xs text-secondary-500 mt-1">
                Besoins totaux
              </p>
            </div>
          </div>

          {/* Formula */}
          <div className="bg-secondary-50 rounded-lg p-4">
            <p className="text-sm text-secondary-700 italic">
              {result.formulaDescription}
            </p>
          </div>
        </div>
      </Card>

      {/* Information Card */}
      <Card>
        <Heading level={4}>
          📊 Que signifie ce résultat ?
        </Heading>
        <div className="space-y-2 mt-3">
          <Text>
            <strong>RER (Resting Energy Requirement)</strong> : C'est l'énergie
            dont l'animal a besoin au repos absolu, sans activité.
          </Text>
          <Text>
            <strong>MER (Maintenance Energy Requirement)</strong> : C'est le
            besoin énergétique total quotidien, calculé en multipliant le RER
            par un facteur qui dépend de l'activité, du statut, et de l'objectif.
          </Text>
          <Text className="pt-2 border-t border-secondary-200">
            <strong>Prochaine étape :</strong> Utilisez ce résultat (<Badge color="blue">{result.mer} kcal/jour</Badge>)
            pour calculer la quantité de croquettes nécessaire en fonction de
            leur apport énergétique.
          </Text>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          plain
          onClick={onNewCalculation}
          className="flex-1"
        >
          🔄 Nouveau calcul
        </Button>
        <Button
          outline
          onClick={() => window.print()}
          className="flex-1"
        >
          🖨️ Imprimer
        </Button>
        <Button
          color="blue"
          disabled
          className="flex-1"
        >
          💾 Sauvegarder (prochainement)
        </Button>
      </div>
    </div>
  );
}
