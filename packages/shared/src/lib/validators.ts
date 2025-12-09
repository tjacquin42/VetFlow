import { z } from 'zod';

/**
 * Schema for validating animal information
 */
export const animalInfoSchema = z.object({
  name: z.string().max(100).optional(),
  species: z.enum(['dog', 'cat'], {
    errorMap: () => ({ message: 'Species must be either dog or cat' }),
  }),
  weight: z
    .number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a number',
    })
    .min(0.1, 'Weight must be at least 0.1 kg')
    .max(100, 'Weight must be less than 100 kg'),
  ageYears: z
    .number({
      required_error: 'Age in years is required',
      invalid_type_error: 'Age must be a number',
    })
    .min(0, 'Age cannot be negative')
    .max(30, 'Age must be less than 30 years'),
  ageMonths: z
    .number({
      required_error: 'Age in months is required',
      invalid_type_error: 'Age in months must be a number',
    })
    .min(0, 'Months cannot be negative')
    .max(11, 'Months must be between 0 and 11'),
  isNeutered: z.boolean({
    required_error: 'Neutered status is required',
  }),
  bodyScore: z
    .number({
      required_error: 'Body score is required',
      invalid_type_error: 'Body score must be a number',
    })
    .int('Body score must be an integer')
    .min(1, 'Body score must be between 1 and 9')
    .max(9, 'Body score must be between 1 and 9'),
});

/**
 * Schema for validating objective data
 */
export const objectiveDataSchema = z.object({
  goal: z.enum(['maintenance', 'weight-loss', 'weight-gain', 'growth'], {
    errorMap: () => ({ message: 'Invalid nutritional goal' }),
  }),
  activityLevel: z.enum(['low', 'moderate', 'high'], {
    errorMap: () => ({ message: 'Invalid activity level' }),
  }),
  physiologicalStatus: z.enum(['normal', 'gestation', 'lactation', 'senior'], {
    errorMap: () => ({ message: 'Invalid physiological status' }),
  }),
});

/**
 * Schema for complete animal data
 */
export const animalDataSchema = animalInfoSchema.merge(objectiveDataSchema);

/**
 * Schema for croquette data
 */
export const croquetteSchema = z.object({
  id: z.string().uuid('Invalid croquette ID'),
  brand: z.string().min(1, 'Brand is required').max(100),
  name: z.string().min(1, 'Name is required').max(255),
  range: z.string().max(100),
  species: z.enum(['dog', 'cat', 'both']),
  type: z.string().max(100),
  kcalPer100g: z
    .number()
    .min(100, 'kcal per 100g must be at least 100')
    .max(1000, 'kcal per 100g must be less than 1000'),
  protein: z.number().min(0).max(100).optional(),
  fat: z.number().min(0).max(100).optional(),
  fiber: z.number().min(0).max(100).optional(),
  productUrl: z.string().url('Invalid product URL'),
  approximatePrice: z.number().min(0).optional(),
  availability: z.enum(['france', 'europe']),
  imageUrl: z.string().url('Invalid image URL').optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

/**
 * Schema for user profile updates
 */
export const updateUserSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  clinic: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
});

/**
 * Schema for creating a calculation
 */
export const createCalculationSchema = z.object({
  animalInfo: animalInfoSchema,
  objectiveData: objectiveDataSchema,
  selectedCroquetteIds: z
    .array(z.string().uuid())
    .min(1, 'At least one croquette must be selected')
    .max(3, 'Maximum 3 croquettes can be compared'),
});

/**
 * Type inference helpers
 */
export type AnimalInfoInput = z.infer<typeof animalInfoSchema>;
export type ObjectiveDataInput = z.infer<typeof objectiveDataSchema>;
export type AnimalDataInput = z.infer<typeof animalDataSchema>;
export type CroquetteInput = z.infer<typeof croquetteSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateCalculationInput = z.infer<typeof createCalculationSchema>;
