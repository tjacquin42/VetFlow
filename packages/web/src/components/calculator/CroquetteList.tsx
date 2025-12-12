import { useState, useMemo } from 'react';
import { Card, Button } from '@/components/ui';
import { CroquetteCard } from './CroquetteCard';
import { CroquetteFilters } from './CroquetteFilters';
import type {
  CroquetteRecommendation,
  CroquetteRecommendationFilters,
  CroquetteSortBy,
} from '@vetflow/shared';

export interface CroquetteListProps {
  recommendations: CroquetteRecommendation[];
  filters: CroquetteRecommendationFilters;
  sortBy: CroquetteSortBy;
  onFiltersChange: (filters: CroquetteRecommendationFilters) => void;
  onSortChange: (sortBy: CroquetteSortBy) => void;
}

export function CroquetteList({
  recommendations,
  filters,
  sortBy,
  onFiltersChange,
  onSortChange,
}: CroquetteListProps) {
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filtered = useMemo(() => {
    return recommendations.filter((rec) => {
      // Filter by brands
      if (filters.brands && filters.brands.length > 0) {
        if (!filters.brands.includes(rec.croquette.brand)) return false;
      }

      // Filter by types
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(rec.croquette.type)) return false;
      }

      // Filter by min price
      if (filters.minPrice !== undefined && rec.dailyCost < filters.minPrice) {
        return false;
      }

      // Filter by max price
      if (filters.maxPrice !== undefined && rec.dailyCost > filters.maxPrice) {
        return false;
      }

      // Filter by min protein
      if (filters.minProtein !== undefined) {
        if (!rec.croquette.protein || rec.croquette.protein < filters.minProtein) {
          return false;
        }
      }

      // Filter by max kcal
      if (filters.maxKcal !== undefined && rec.croquette.kcalPer100g > filters.maxKcal) {
        return false;
      }

      return true;
    });
  }, [recommendations, filters]);

  // Apply sorting
  const sorted = useMemo(() => {
    const toSort = [...filtered];

    switch (sortBy) {
      case 'price-asc':
        return toSort.sort((a, b) => a.dailyCost - b.dailyCost);
      case 'price-desc':
        return toSort.sort((a, b) => b.dailyCost - a.dailyCost);
      case 'kcal-asc':
        return toSort.sort((a, b) => a.croquette.kcalPer100g - b.croquette.kcalPer100g);
      case 'kcal-desc':
        return toSort.sort((a, b) => b.croquette.kcalPer100g - a.croquette.kcalPer100g);
      case 'protein-desc':
        return toSort.sort((a, b) => (b.croquette.protein || 0) - (a.croquette.protein || 0));
      case 'match-score':
        return toSort.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      default:
        return toSort;
    }
  }, [filtered, sortBy]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
          Toutes les Croquettes ({sorted.length})
        </h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            🔍 {showFilters ? 'Masquer' : 'Filtres'}
          </Button>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as CroquetteSortBy)}
            className="border border-secondary-300 dark:border-secondary-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
          >
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="kcal-asc">Kcal croissant</option>
            <option value="kcal-desc">Kcal décroissant</option>
            <option value="protein-desc">Protéines élevées</option>
          </select>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <CroquetteFilters
          filters={filters}
          recommendations={recommendations}
          onChange={onFiltersChange}
        />
      )}

      {/* List of cards */}
      {sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((rec) => (
            <CroquetteCard
              key={rec.croquette.id}
              recommendation={rec}
              variant="compact"
              showDetails={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-secondary-600 dark:text-secondary-400">
          Aucune croquette ne correspond aux filtres sélectionnés.
        </div>
      )}
    </Card>
  );
}
