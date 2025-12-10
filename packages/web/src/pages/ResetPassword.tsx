import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card } from '@/components/ui';
import { resetPasswordSchema, type ResetPasswordInput } from '@/lib/authSchemas';

export function ResetPassword() {
  const [formData, setFormData] = useState<ResetPasswordInput>({ email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    const validation = resetPasswordSchema.safeParse(formData);
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
      await resetPassword(formData.email);
      setSuccessMessage(
        'Email de réinitialisation envoyé ! Vérifiez votre boîte mail.'
      );
      setFormData({ email: '' });
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            VetFlow
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Réinitialiser votre mot de passe
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

            <div className="text-sm text-secondary-600 dark:text-secondary-300 mb-4">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre
              mot de passe.
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Envoyer le lien
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
