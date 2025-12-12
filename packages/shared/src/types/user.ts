/**
 * User subscription plan
 */
export type SubscriptionPlan = 'free' | 'premium' | 'clinic';

/**
 * User account information
 */
export interface User {
  /** Unique user ID */
  id: string;
  /** Email address */
  email: string;
  /** First name (optional) */
  firstName?: string;
  /** Last name (optional) */
  lastName?: string;
  /** Clinic/practice name (optional) */
  clinic?: string;
  /** Phone number (optional) */
  phone?: string;
  /** Current subscription plan */
  plan: SubscriptionPlan;
  /** Number of calculations this week (optional) */
  calculations?: number;
  /** Subscription start date (optional) */
  subscriptionDate?: string;
  /** Subscription expiry date (optional) */
  subscriptionExpiryDate?: string;
  /** Account creation timestamp */
  createdAt: string;
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * User profile update input
 */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  clinic?: string;
  phone?: string;
}

/**
 * Weekly usage tracking
 */
export interface UsageTracking {
  /** Unique tracking ID */
  id: string;
  /** User ID */
  userId: string;
  /** Start of week date */
  weekStart: string;
  /** Number of calculations performed */
  calculationCount: number;
  /** Creation timestamp */
  createdAt: string;
}
