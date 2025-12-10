import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, Spinner } from '@/components/ui';

export function AuthConfirm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirm = async () => {
      try {
        // Get the token from the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (!accessToken) {
          throw new Error('No access token found in URL');
        }

        // Verify the email confirmation
        if (type === 'signup' || type === 'email') {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) throw error;

          setStatus('success');
          setTimeout(() => navigate('/calculator'), 2000);
        } else if (type === 'recovery') {
          // Handle password reset
          setStatus('success');
          setTimeout(() => navigate('/reset-password'), 2000);
        } else {
          throw new Error('Invalid confirmation type');
        }
      } catch (error) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setErrorMessage((error as Error).message || 'Une erreur est survenue');
      }
    };

    if (window.location.hash) {
      handleEmailConfirm();
    } else {
      setStatus('error');
      setErrorMessage('Lien de confirmation invalide');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          {status === 'loading' && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Spinner size="lg" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50 mb-2">
                Confirmation en cours...
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300">
                Veuillez patienter pendant que nous vérifions votre email
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-xl font-semibold text-success-600 dark:text-success-400 mb-2">
                Email confirmé !
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300">
                Redirection vers l'application...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-xl font-semibold text-danger-600 dark:text-danger-400 mb-2">
                Erreur de confirmation
              </h2>
              <p className="text-secondary-600 dark:text-secondary-300 mb-4">
                {errorMessage || 'Une erreur est survenue lors de la confirmation de votre email'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
              >
                Retour à la connexion
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
