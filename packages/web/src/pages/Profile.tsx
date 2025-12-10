import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Card } from '@/components/ui';
import { supabase } from '@/lib/supabase';

export function Profile() {
  const { user, signOut } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    clinic: user?.clinic || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          clinic: formData.clinic,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      setErrorMessage('Erreur lors de la déconnexion');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-50 mb-2">
            Mon Profil
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300">
            Gérez vos informations personnelles
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-4">
                Informations du compte
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Email
                  </label>
                  <div className="px-3 py-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-secondary-600 dark:text-secondary-400">
                    {user.email}
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                    Plan d'abonnement
                  </label>
                  <div className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-700 dark:text-primary-300 font-medium capitalize">
                    {user.plan || 'free'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-4">
                Informations personnelles
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Prénom"
                    type="text"
                    value={formData.firstName}
                    onChange={(value) => setFormData({ ...formData, firstName: value })}
                    disabled={isLoading}
                    placeholder="Jean"
                  />
                  <Input
                    label="Nom"
                    type="text"
                    value={formData.lastName}
                    onChange={(value) => setFormData({ ...formData, lastName: value })}
                    disabled={isLoading}
                    placeholder="Dupont"
                  />
                </div>

                <Input
                  label="Clinique"
                  type="text"
                  value={formData.clinic}
                  onChange={(value) => setFormData({ ...formData, clinic: value })}
                  disabled={isLoading}
                  placeholder="Nom de votre clinique"
                />

                <Input
                  label="Téléphone"
                  type="tel"
                  value={formData.phone}
                  onChange={(value) => setFormData({ ...formData, phone: value })}
                  disabled={isLoading}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-secondary-200 dark:border-secondary-700">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sauvegarder les modifications
              </Button>

              <Button
                type="button"
                variant="danger"
                onClick={handleSignOut}
              >
                Se déconnecter
              </Button>
            </div>
          </form>
        </Card>

        {user.plan === 'free' && (
          <Card className="mt-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50">
                Utilisation
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-600 dark:text-secondary-300">
                    Calculs cette semaine
                  </span>
                  <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-50">
                    {user.calculations || 0} / 10
                  </span>
                </div>
                <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((user.calculations || 0) / 10) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Passez au plan Premium pour des calculs illimités
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
