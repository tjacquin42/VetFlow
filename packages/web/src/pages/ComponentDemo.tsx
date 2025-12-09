import { useState } from 'react';
import { Button, Input, Card, Select, Modal, Spinner } from '@/components/ui';

export function ComponentDemo() {
  // States for interactive examples
  const [textValue, setTextValue] = useState('');
  const [numberValue, setNumberValue] = useState('10');
  const [selectValue, setSelectValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-secondary-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Démo des Composants UI
          </h1>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Showcase de tous les composants réutilisables de VetFlow.
            Testez les interactions et visualisez les différentes variantes.
          </p>
        </header>

        <div className="space-y-12">
          {/* Button Section */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
              Buttons
            </h2>

            <div className="space-y-6">
              {/* Variants */}
              <div>
                <h3 className="text-lg font-medium text-secondary-700 mb-3">
                  Variants
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="text-lg font-medium text-secondary-700 mb-3">
                  Sizes
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                </div>
              </div>

              {/* Loading State */}
              <div>
                <h3 className="text-lg font-medium text-secondary-700 mb-3">
                  Loading State
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    isLoading={isLoading}
                    onClick={() => {
                      setIsLoading(true);
                      setTimeout(() => setIsLoading(false), 2000);
                    }}
                  >
                    {isLoading ? 'Chargement...' : 'Cliquez pour charger'}
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Input Section */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
              Inputs
            </h2>

            <div className="grid gap-6 max-w-2xl">
              <Input
                label="Nom de l'animal"
                type="text"
                value={textValue}
                onChange={setTextValue}
                placeholder="Ex: Max"
              />

              <Input
                label="Poids"
                type="number"
                value={numberValue}
                onChange={setNumberValue}
                unit="kg"
                min={0.1}
                max={100}
                step={0.1}
                required
              />

              <Input
                label="Email"
                type="email"
                value=""
                onChange={() => {}}
                placeholder="email@example.com"
                hint="Nous ne partagerons jamais votre email"
              />

              <Input
                label="Champ avec erreur"
                type="text"
                value=""
                onChange={() => {}}
                error="Ce champ est requis"
                required
              />
            </div>
          </section>

          {/* Card Section */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
              Cards
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card title="Default Card" subtitle="Variant par défaut">
                <p className="text-secondary-600">
                  Ceci est une carte par défaut avec bordure simple.
                </p>
              </Card>

              <Card
                title="Outlined Card"
                subtitle="Bordure accentuée"
                variant="outlined"
              >
                <p className="text-secondary-600">
                  Carte avec bordure bleue accentuée pour mettre en avant.
                </p>
              </Card>

              <Card
                title="Elevated Card"
                subtitle="Avec ombre"
                variant="elevated"
              >
                <p className="text-secondary-600">
                  Carte avec ombre portée pour effet de profondeur.
                </p>
              </Card>

              <Card
                title="Card with Footer"
                footer={
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Annuler
                    </Button>
                    <Button variant="primary" size="sm">
                      Valider
                    </Button>
                  </div>
                }
              >
                <p className="text-secondary-600">
                  Carte avec un footer pour des actions.
                </p>
              </Card>

              <Card title="Hoverable Card" hoverable>
                <p className="text-secondary-600">
                  Passez la souris pour voir l'effet hover.
                </p>
              </Card>
            </div>
          </section>

          {/* Select Section */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
              Select
            </h2>

            <div className="grid gap-6 max-w-2xl">
              <Select
                label="Espèce"
                options={[
                  { value: 'dog', label: 'Chien' },
                  { value: 'cat', label: 'Chat' },
                ]}
                value={selectValue}
                onChange={setSelectValue}
                placeholder="Sélectionnez une espèce"
                required
              />

              <Select
                label="Objectif"
                options={[
                  { value: 'maintenance', label: 'Maintien du poids' },
                  { value: 'weight-loss', label: 'Perte de poids' },
                  { value: 'weight-gain', label: 'Gain de poids' },
                  { value: 'growth', label: 'Croissance' },
                ]}
                value=""
                onChange={() => {}}
                error="Veuillez sélectionner un objectif"
              />
            </div>
          </section>

          {/* Modal Section */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
              Modal
            </h2>

            <div className="flex gap-3">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Ouvrir la modal
              </Button>
            </div>

            <Modal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              title="Exemple de Modal"
              footer={
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowModal(false)}
                  >
                    Confirmer
                  </Button>
                </>
              }
            >
              <p className="text-secondary-600">
                Ceci est le contenu de la modal. Vous pouvez placer n'importe
                quel contenu ici.
              </p>
              <p className="text-secondary-600 mt-4">
                Utilisez la touche <kbd className="px-2 py-1 bg-secondary-100 rounded">ESC</kbd> pour fermer.
              </p>
            </Modal>
          </section>

          {/* Spinner Section */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
              Spinner
            </h2>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <Spinner size="sm" />
                <p className="text-sm text-secondary-600 mt-2">Small</p>
              </div>
              <div className="text-center">
                <Spinner size="md" />
                <p className="text-sm text-secondary-600 mt-2">Medium</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" />
                <p className="text-sm text-secondary-600 mt-2">Large</p>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <section className="pt-8 border-t">
            <div className="text-center">
              <p className="text-secondary-600 mb-4">
                Prêt à tester le calculateur ?
              </p>
              <Button variant="primary" size="lg" onClick={() => window.location.href = '/calculator'}>
                Aller au Calculateur →
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
