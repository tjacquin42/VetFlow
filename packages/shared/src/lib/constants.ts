/**
 * Application-wide constants
 */

/**
 * Body score scale (1-9)
 */
export const MIN_BODY_SCORE = 1;
export const MAX_BODY_SCORE = 9;
export const IDEAL_BODY_SCORE = 5;

/**
 * Weight limits (in kg)
 */
export const MIN_WEIGHT = 0.1;
export const MAX_WEIGHT = 100;

/**
 * Age limits
 */
export const MIN_AGE_YEARS = 0;
export const MAX_AGE_YEARS = 30;
export const MIN_AGE_MONTHS = 0;
export const MAX_AGE_MONTHS = 11;

/**
 * Meal configuration
 */
export const DEFAULT_MEALS_PER_DAY = 2;

/**
 * Calculation limits
 */
export const MAX_CROQUETTES_COMPARISON = 3;
export const MIN_CROQUETTES_COMPARISON = 1;

/**
 * Subscription limits
 */
export const FREE_CALCULATIONS_PER_WEEK = 10;
export const FREE_HISTORY_LIMIT = 5;

/**
 * Subscription prices (in euros)
 */
export const PREMIUM_MONTHLY_PRICE = 9.9;
export const PREMIUM_YEARLY_PRICE = 99;
export const CLINIC_MONTHLY_PRICE = 49;

/**
 * RER calculation thresholds (in kg)
 */
export const RER_SIMPLIFIED_LOWER_THRESHOLD = 2;
export const RER_SIMPLIFIED_UPPER_THRESHOLD = 45;

/**
 * Body score adjustment factors
 */
export const BODY_SCORE_TOO_THIN_THRESHOLD = 3;
export const BODY_SCORE_OVERWEIGHT_THRESHOLD = 7;
export const BODY_SCORE_THIN_ADJUSTMENT = 1.15; // +15%
export const BODY_SCORE_OVERWEIGHT_ADJUSTMENT = 0.75; // -25%

/**
 * Species labels
 */
export const SPECIES_LABELS = {
  dog: 'Chien',
  cat: 'Chat',
} as const;

/**
 * Goal labels (French)
 */
export const GOAL_LABELS = {
  maintenance: 'Maintien du poids',
  'weight-loss': 'Perte de poids',
  'weight-gain': 'Gain de poids',
  growth: 'Croissance',
} as const;

/**
 * Activity level labels (French)
 */
export const ACTIVITY_LEVEL_LABELS = {
  low: 'Faible',
  moderate: 'Modéré',
  high: 'Élevé',
} as const;

/**
 * Physiological status labels (French)
 */
export const PHYSIOLOGICAL_STATUS_LABELS = {
  normal: 'Normal',
  gestation: 'Gestation',
  lactation: 'Lactation',
  senior: 'Sénior',
} as const;

/**
 * Subscription plan labels
 */
export const SUBSCRIPTION_PLAN_LABELS = {
  free: 'Gratuit',
  premium: 'Premium',
  clinic: 'Clinique',
} as const;
