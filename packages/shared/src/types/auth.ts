/**
 * Authentication types for VetFlow
 */

export interface AuthUser {
  id: string;
  email: string;
  emailConfirmed: boolean;
  lastSignIn: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordCredentials {
  email: string;
}
