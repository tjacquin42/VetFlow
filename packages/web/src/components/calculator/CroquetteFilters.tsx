import { useMemo } from 'react';
import { Button } from '@/components/ui';
import type {
  CroquetteRecommendationFilters,
  CroquetteRecommendation,
} from '@vetflow/shared';

export interface CroquetteFiltersProps {
  filters: CroquetteRecommendationFilters;
  recommendations: CroquetteRecommendation[];
  onChange: (filters: CroquetteRecommendationFilters) => void;
}

export function CroquetteFilters({
  filters,
  recommendations,
  onChange,
}: CroquetteFiltersProps) {
  // Extract unique brands and types
  const availableBrands = useMemo(
    () => [...new Set(recommendations.map((r) => r.croquette.brand))].sort(),
    [recommendations]
  );

  const availableTypes = useMemo(
    () => [...new Set(recommendations.map((r) => r.croquette.type))].filter(Boolean).sort(),
    [recommendations]
  );

  const handleBrandToggle = (brand: string) => {
    const currentBrands = filters.brands || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onChange({ ...filters, brands: newBrands.length > 0 ? newBrands : undefined });
  };

  const handleTypeToggle = (type: string) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    onChange({ ...filters, types: newTypes.length > 0 ? newTypes : undefined });
  };

  return (
    <div className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 mb-4 border border-secondary-200 dark:border-secondary-700">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Brands */}
        <div>
          <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Marques
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableBrands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-2 text-sm text-secondary-700 dark:text-secondary-200 cursor-pointer hover:text-secondary-900 dark:hover:text-secondary-50"
              >
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-secondary-300 dark:border-secondary-600 text-primary-600 focus:ring-primary-500"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>

        {/* Types */}
        <div>
          <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Types
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableTypes.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 text-sm text-secondary-700 dark:text-secondary-200 cursor-pointer hover:text-secondary-900 dark:hover:text-secondary-50"
              >
                <input
                  type="checkbox"
                  checked={filters.types?.includes(type) || false}
                  onChange={() => handleTypeToggle(type)}
                  className="rounded border-secondary-300 dark:border-secondary-600 text-primary-600 focus:ring-primary-500"
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Prix journalier
          </h4>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={filters.maxPrice !== undefined ? filters.maxPrice : 10}
              onChange={(e) =>
                onChange({
                  ...filters,
                  maxPrice: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              Maximum: {filters.maxPrice?.toFixed(2) || '10.00'}€/jour
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2 text-sm">
              Protéines minimales
            </h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={filters.minProtein !== undefined ? filters.minProtein : 0}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minProtein: parseFloat(e.target.value),
                  })
                }
                className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                Minimum: {filters.minProtein || 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange({})}
          className="text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-secondary-100"
        >
          Réinitialiser les filtres
        </Button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
}
