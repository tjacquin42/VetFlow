import { createContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User, UpdateUserInput } from '@vetflow/shared';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: UpdateUserInput) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getAuthErrorMessage = (error: AuthError): string => {
  const message = error.message.toLowerCase();

  if (message.includes('invalid login credentials') || message.includes('invalid credentials')) {
    return 'Email ou mot de passe incorrect';
  }
  if (message.includes('user already registered') || message.includes('already registered')) {
    return 'Cet email est déjà utilisé';
  }
  if (message.includes('email not confirmed')) {
    return 'Veuillez confirmer votre email';
  }
  if (message.includes('invalid email')) {
    return 'Email invalide';
  }
  if (message.includes('password')) {
    return 'Le mot de passe doit contenir au moins 8 caractères';
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Initialize session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error initializing auth session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);

        if (session?.user) {
          await fetchUserProfile(session.user.id);

          // Only redirect on explicit sign in from login page
          if (event === 'SIGNED_IN' && window.location.pathname === '/login') {
            navigate('/calculator');
          }
        } else {
          setUser(null);

          // Redirect to home on sign out
          if (event === 'SIGNED_OUT') {
            navigate('/');
          }
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, metadata?: { firstName?: string; lastName?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      // If email confirmation is disabled, user will be auto-signed in
      if (data.user && data.session) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/calculator`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setSession(null);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(getAuthErrorMessage(authError));
    }
  };

  const updateProfile = async (data: UpdateUserInput) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          clinic: data.clinic,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setUser({
        ...user,
        firstName: data.firstName,
        lastName: data.lastName,
        clinic: data.clinic,
        phone: data.phone,
      });
    } catch (error) {
      throw new Error('Erreur lors de la mise à jour du profil');
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
