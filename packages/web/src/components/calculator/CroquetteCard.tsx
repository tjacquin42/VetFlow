import type { CroquetteRecommendation } from '@vetflow/shared';

export interface CroquetteCardProps {
  recommendation: CroquetteRecommendation;
  variant: 'highlighted' | 'compact';
  showDetails: boolean;
}

export function CroquetteCard({
  recommendation,
  variant,
  showDetails,
}: CroquetteCardProps) {
  const { croquette, dailyQuantityGrams, dailyCost } = recommendation;

  return (
    <div
      className={`border rounded-lg p-4 transition-colors ${
        variant === 'highlighted'
          ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/10'
          : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600'
      }`}
    >
      {/* Header: Brand + Name */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-secondary-500 dark:text-secondary-400 uppercase tracking-wide">
            {croquette.brand}
          </div>
          <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 truncate">
            {croquette.name}
          </h4>
          {croquette.range && (
            <div className="text-xs text-secondary-600 dark:text-secondary-300 mt-0.5">
              {croquette.range}
            </div>
          )}
        </div>
        {croquette.imageUrl && (
          <img
            src={croquette.imageUrl}
            alt={croquette.name}
            className="w-12 h-12 object-cover rounded ml-3 flex-shrink-0"
          />
        )}
      </div>

      {/* Quantities */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white dark:bg-secondary-800 rounded p-2.5 border border-secondary-100 dark:border-secondary-700">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Math.round(dailyQuantityGrams)}g
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">par jour</div>
        </div>
        <div className="bg-white dark:bg-secondary-800 rounded p-2.5 border border-secondary-100 dark:border-secondary-700">
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {dailyCost > 0 ? `${dailyCost.toFixed(2)}€` : 'N/A'}
          </div>
          <div className="text-xs text-secondary-600 dark:text-secondary-400">par jour</div>
        </div>
      </div>

      {/* Nutritional values */}
      {showDetails && (
        <div className="border-t border-secondary-200 dark:border-secondary-700 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary-600 dark:text-secondary-400">Énergie</span>
            <span className="font-medium text-secondary-900 dark:text-secondary-100">
              {croquette.kcalPer100g} kcal/100g
            </span>
          </div>
          {croquette.protein !== undefined && (
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">Protéines</span>
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {croquette.protein}%
              </span>
            </div>
          )}
          {croquette.fat !== undefined && (
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">
                Matières grasses
              </span>
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {croquette.fat}%
              </span>
            </div>
          )}
          {croquette.fiber !== undefined && (
            <div className="flex justify-between">
              <span className="text-secondary-600 dark:text-secondary-400">Fibres</span>
              <span className="font-medium text-secondary-900 dark:text-secondary-100">
                {croquette.fiber}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Product link */}
      {croquette.productUrl && (
        <a
          href={croquette.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-600 dark:text-primary-400 hover:underline mt-3 inline-block"
        >
          Voir le produit →
        </a>
      )}
    </div>
  );
}
