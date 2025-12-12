import { Button, Card } from '@/components/ui';
import type { AnimalInfo, EnergyResult } from '@vetflow/shared';

export interface BEResultProps {
  result: EnergyResult;
  animalInfo: AnimalInfo;
  onBackToObjectives: () => void;
  onNewCalculation: () => void;
  onViewRecommendations: () => void;
}

export function BEResult({
  result,
  animalInfo,
  onBackToObjectives,
  onNewCalculation,
  onViewRecommendations,
}: BEResultProps) {
  return (
    <div className="space-y-6">
      {/* Animal Summary */}
      <Card variant="outlined">
        <div className="text-center">
          <div className="text-4xl mb-2">
            {animalInfo.species === 'dog' ? '🐕' : '🐈'}
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            {animalInfo.name || 'Animal sans nom'}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-300 mt-1">
            {animalInfo.species === 'dog' ? 'Chien' : 'Chat'} • {animalInfo.weight} kg
            {' • '}
            {animalInfo.ageYears} ans
            {animalInfo.ageMonths > 0 && ` ${animalInfo.ageMonths} mois`}
          </p>
        </div>
      </Card>

      {/* Main Result */}
      <Card variant="elevated" title="Besoin Énergétique">
        <div className="text-center space-y-6">
          {/* MER - Main result */}
          <div>
            <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">
              {result.mer}
              <span className="text-2xl text-secondary-500 dark:text-secondary-400 ml-2">
                kcal/jour
              </span>
            </div>
            <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-2">
              Besoin Énergétique Journalier (MER)
            </p>
          </div>

          {/* Details */}
          <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-secondary-200 dark:border-secondary-700">
            <div>
              <div className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                {result.rer}
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">
                RER (kcal/jour)
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Besoins au repos
              </p>
            </div>

            <div>
              <div className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                ×{result.factor.toFixed(2)}
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">Facteur</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Multiplicateur
              </p>
            </div>

            <div>
              <div className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100">
                {result.mer}
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">
                MER (kcal/jour)
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Besoins totaux
              </p>
            </div>
          </div>

          {/* Formula */}
          <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4">
            <p className="text-sm text-secondary-700 dark:text-secondary-300 italic">
              {result.formulaDescription}
            </p>
          </div>
        </div>
      </Card>

      {/* Information Card */}
      <Card>
        <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
          📊 Que signifie ce résultat ?
        </h4>
        <div className="space-y-2 text-sm text-secondary-600 dark:text-secondary-300">
          <p>
            <strong>RER (Resting Energy Requirement)</strong> : C'est l'énergie
            dont l'animal a besoin au repos absolu, sans activité.
          </p>
          <p>
            <strong>MER (Maintenance Energy Requirement)</strong> : C'est le
            besoin énergétique total quotidien, calculé en multipliant le RER
            par un facteur qui dépend de l'activité, du statut, et de l'objectif.
          </p>
          <p className="pt-2 border-t border-secondary-200 dark:border-secondary-700">
            <strong>Prochaine étape :</strong> Utilisez ce résultat ({result.mer} kcal/jour)
            pour calculer la quantité de croquettes nécessaire en fonction de
            leur apport énergétique.
          </p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="ghost"
          size="lg"
          onClick={onBackToObjectives}
          className="flex-1"
        >
          ← Modifier objectifs
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={onNewCalculation}
          className="flex-1"
        >
          🔄 Nouveau calcul
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => window.print()}
          className="flex-1"
        >
          🖨️ Imprimer
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onViewRecommendations}
          className="flex-1"
        >
          🍖 Voir les croquettes recommandées
        </Button>
      </div>
    </div>
  );
}
