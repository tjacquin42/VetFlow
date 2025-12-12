import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  type Croquette,
  type CroquetteRecommendation,
  type CroquetteRecommendationFilters,
  type CroquetteSortBy,
  calculateKibbleQuantity,
  calculateQuantityPerMeal,
  calculateDailyCost,
} from '@vetflow/shared';
import { logger } from '@/lib/logger';
import { createSupabaseError, AppError } from '@/lib/errors';

export function useCroquettes(species: 'dog' | 'cat', energyRequirement: number) {
  const [croquettes, setCroquettes] = useState<Croquette[]>([]);
  const [recommendations, setRecommendations] = useState<CroquetteRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  // Fetch croquettes from Supabase
  useEffect(() => {
    async function fetchCroquettes() {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('croquettes')
          .select('*')
          .eq('is_active', true)
          .or(`species.eq.${species},species.eq.both`)
          .order('brand', { ascending: true });

        if (fetchError) throw fetchError;

        // Map database fields to camelCase
        const mappedData: Croquette[] = (data || []).map((item) => ({
          id: item.id,
          brand: item.brand,
          name: item.name,
          range: item.range || '',
          species: item.species,
          type: item.type || '',
          kcalPer100g: item.kcal_per_100g,
          protein: item.protein,
          fat: item.fat,
          fiber: item.fiber,
          productUrl: item.product_url || '',
          approximatePrice: item.approximate_price,
          availability: item.availability,
          imageUrl: item.image_url,
          isActive: item.is_active,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        }));

        setCroquettes(mappedData);

        // Calculate recommendations
        const recs: CroquetteRecommendation[] = mappedData.map((croquette) => {
          const dailyQuantity = calculateKibbleQuantity(energyRequirement, croquette.kcalPer100g);
          return {
            croquette,
            dailyQuantityGrams: dailyQuantity,
            quantityPerMeal: calculateQuantityPerMeal(dailyQuantity),
            dailyCost: croquette.approximatePrice
              ? calculateDailyCost(dailyQuantity, croquette.approximatePrice)
              : 0,
            monthlyCost: croquette.approximatePrice
              ? calculateDailyCost(dailyQuantity, croquette.approximatePrice) * 30
              : 0,
          };
        });

        setRecommendations(recs);
      } catch (err) {
        const appError = createSupabaseError(err, {
          species,
          energyRequirement,
          operation: 'fetch_croquettes',
        });
        setError(appError);
        logger.error('Failed to fetch croquettes from Supabase', err as Error, {
          species,
          energyRequirement,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCroquettes();
  }, [species, energyRequirement]);

  // Filter recommendations
  const filterRecommendations = (
    filters: CroquetteRecommendationFilters
  ): CroquetteRecommendation[] => {
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
  };

  // Sort recommendations
  const sortRecommendations = (
    recs: CroquetteRecommendation[],
    sortBy: CroquetteSortBy
  ): CroquetteRecommendation[] => {
    const sorted = [...recs];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.dailyCost - b.dailyCost);
      case 'price-desc':
        return sorted.sort((a, b) => b.dailyCost - a.dailyCost);
      case 'kcal-asc':
        return sorted.sort((a, b) => a.croquette.kcalPer100g - b.croquette.kcalPer100g);
      case 'kcal-desc':
        return sorted.sort((a, b) => b.croquette.kcalPer100g - a.croquette.kcalPer100g);
      case 'protein-desc':
        return sorted.sort(
          (a, b) => (b.croquette.protein || 0) - (a.croquette.protein || 0)
        );
      case 'match-score':
        return sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      default:
        return sorted;
    }
  };

  return {
    croquettes,
    recommendations,
    loading,
    error,
    filterRecommendations,
    sortRecommendations,
  };
}
