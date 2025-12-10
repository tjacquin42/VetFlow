import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card } from '@/components/ui';
import { GoogleButton } from '@/components/auth/GoogleButton';
import { signupSchema, type SignupInput, getPasswordStrength } from '@/lib/authSchemas';

export function Signup() {
  const [formData, setFormData] = useState<SignupInput>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    const validation = signupSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setSuccessMessage('Compte créé avec succès ! Redirection...');
      setTimeout(() => navigate('/calculator'), 1500);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    try {
      await signInWithGoogle();
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const strengthColor = {
    weak: 'bg-danger-500',
    medium: 'bg-yellow-500',
    strong: 'bg-success-500',
  };

  const strengthText = {
    weak: 'Faible',
    medium: 'Moyen',
    strong: 'Fort',
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            VetFlow
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Créez votre compte gratuitement
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800">
                <p className="text-sm text-danger-600 dark:text-danger-400">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
                <p className="text-sm text-success-600 dark:text-success-400">{successMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Prénom"
                type="text"
                value={formData.firstName || ''}
                onChange={(value) => setFormData({ ...formData, firstName: value })}
                disabled={isLoading}
                placeholder="Jean"
              />
              <Input
                label="Nom"
                type="text"
                value={formData.lastName || ''}
                onChange={(value) => setFormData({ ...formData, lastName: value })}
                disabled={isLoading}
                placeholder="Dupont"
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData({ ...formData, email: value })}
              error={errors.email}
              required
              disabled={isLoading}
              placeholder="votre@email.com"
            />

            <div>
              <Input
                label="Mot de passe"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
                error={errors.password}
                required
                disabled={isLoading}
                placeholder="••••••••"
              />
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthColor[passwordStrength]} transition-all duration-300`}
                        style={{
                          width:
                            passwordStrength === 'weak'
                              ? '33%'
                              : passwordStrength === 'medium'
                              ? '66%'
                              : '100%',
                        }}
                      />
                    </div>
                    <span className="text-xs text-secondary-600 dark:text-secondary-400">
                      {strengthText[passwordStrength]}
                    </span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline mt-1"
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>

            <Input
              label="Confirmer le mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              error={errors.confirmPassword}
              required
              disabled={isLoading}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Créer un compte
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300 dark:border-secondary-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400">
                  ou
                </span>
              </div>
            </div>

            <GoogleButton onClick={handleGoogleSignUp} mode="signup" className="w-full" />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-secondary-600 dark:text-secondary-400 hover:underline"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
