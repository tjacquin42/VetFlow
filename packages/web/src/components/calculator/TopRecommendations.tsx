import { Card } from '@/components/ui';
import { CroquetteCard } from './CroquetteCard';
import type { CroquetteRecommendation } from '@vetflow/shared';

export interface TopRecommendationsProps {
  recommendations: CroquetteRecommendation[];
}

export function TopRecommendations({ recommendations }: TopRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
        ⭐ Nos Recommandations
      </h3>
      <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-6">
        Basées sur le meilleur rapport qualité/prix et les besoins de votre animal
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <div key={rec.croquette.id} className="relative">
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10 shadow-md">
                Meilleur choix
              </div>
            )}
            <CroquetteCard
              recommendation={rec}
              variant="highlighted"
              showDetails={false}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
