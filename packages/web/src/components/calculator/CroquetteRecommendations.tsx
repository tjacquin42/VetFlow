import { useState } from 'react';
import { Button, Card, ErrorDisplay } from '@/components/ui';
import { useCroquettes } from '@/hooks/useCroquettes';
import { TopRecommendations } from './TopRecommendations';
import { CroquetteList } from './CroquetteList';
import type {
  AnimalInfo,
  EnergyResult,
  CroquetteRecommendationFilters,
  CroquetteSortBy,
  CroquetteRecommendation,
} from '@vetflow/shared';

export interface CroquetteRecommendationsProps {
  animalInfo: AnimalInfo;
  result: EnergyResult;
  onBack: () => void;
  onNewCalculation: () => void;
}

export function CroquetteRecommendations({
  animalInfo,
  result,
  onBack,
  onNewCalculation,
}: CroquetteRecommendationsProps) {
  const { recommendations, loading, error } = useCroquettes(animalInfo.species, result.mer);

  const [filters, setFilters] = useState<CroquetteRecommendationFilters>({});
  const [sortBy, setSortBy] = useState<CroquetteSortBy>('price-asc');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-secondary-600 dark:text-secondary-300">
            Chargement des recommandations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={() => window.location.reload()}
        onBack={onBack}
        showTechnicalDetails={true}
      />
    );
  }

  // Get top 3 recommendations (simple logic: sorted by price)
  const topRecommendations = getTopRecommendations(recommendations, animalInfo);

  return (
    <div className="space-y-6">
      {/* Animal summary + MER */}
      <Card variant="outlined">
        <div className="text-center">
          <div className="text-4xl mb-2">{animalInfo.species === 'dog' ? '🐕' : '🐈'}</div>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            {animalInfo.name || 'Animal sans nom'}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-300 mt-1">
            Besoin énergétique : <strong className="text-primary-600 dark:text-primary-400">{result.mer} kcal/jour</strong>
          </p>
        </div>
      </Card>

      {/* Top 3 Recommendations */}
      {topRecommendations.length > 0 && (
        <TopRecommendations recommendations={topRecommendations} />
      )}

      {/* Complete list with filters */}
      <CroquetteList
        recommendations={recommendations}
        filters={filters}
        sortBy={sortBy}
        onFiltersChange={setFilters}
        onSortChange={setSortBy}
      />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="flex-1">
          ← Retour aux résultats
        </Button>
        <Button variant="ghost" size="lg" onClick={onNewCalculation} className="flex-1">
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
      </div>
    </div>
  );
}

/**
 * Select top 3 recommendations based on various criteria
 * For now: simple sort by daily cost (best value)
 * Future: could include factors like brand reputation, protein content, etc.
 */
function getTopRecommendations(
  recommendations: CroquetteRecommendation[],
  _animalInfo: AnimalInfo
): CroquetteRecommendation[] {
  if (recommendations.length === 0) return [];

  // Filter out products without price
  const withPrice = recommendations.filter((rec) => rec.dailyCost > 0);

  // Sort by price (ascending)
  const sorted = [...withPrice].sort((a, b) => a.dailyCost - b.dailyCost);

  // Return top 3
  return sorted.slice(0, 3);
}
