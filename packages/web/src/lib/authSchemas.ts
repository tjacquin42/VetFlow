import { z } from 'zod';

/**
 * Schema for login form
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
  password: z
    .string()
    .min(1, 'Mot de passe requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schema for signup form
 */
export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email requis')
      .email('Email invalide'),
    password: z
      .string()
      .min(1, 'Mot de passe requis')
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Confirmation de mot de passe requise'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Schema for reset password form
 */
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email requis')
    .email('Email invalide'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Helper to check password strength
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 8) return 'weak';

  let strength = 0;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  if (strength >= 4) return 'strong';
  if (strength >= 2) return 'medium';
  return 'weak';
};
