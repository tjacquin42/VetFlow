import { Routes, Route, Link } from 'react-router-dom';
import { ComponentDemo } from './pages/ComponentDemo';
import { Calculator } from './pages/Calculator';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ResetPassword } from './pages/ResetPassword';
import { AuthConfirm } from './pages/AuthConfirm';
import { Profile } from './pages/Profile';
import { AuthGuard } from './components/auth/AuthGuard';
import { Button, Card, DarkModeToggle } from './components/ui';

function Home() {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <div className="flex justify-end mb-4 gap-3">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Se connecter
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                S'inscrire
              </Button>
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            VetFlow
          </h1>
          <p className="text-xl text-secondary-600 dark:text-secondary-300 max-w-2xl mx-auto">
            Calculateur de nutrition vétérinaire moderne et intuitif
          </p>
        </header>

        {/* Main Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card variant="elevated" hoverable>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🧮</div>
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-400 mb-3">
                Calculateur BE
              </h2>
              <p className="text-secondary-600 mb-6 dark:text-secondary-300">
                Calculez le besoin énergétique journalier de vos animaux en
                quelques étapes simples.
              </p>
              <Link to="/calculator">
                <Button variant="primary" size="lg" className="w-full">
                  Ouvrir le calculateur →
                </Button>
              </Link>
            </div>
          </Card>

          <Card variant="elevated" hoverable>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🎨</div>
              <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-400 mb-3">
                Démo Composants
              </h2>
              <p className="text-secondary-600 mb-6 dark:text-secondary-300">
                Découvrez tous les composants UI disponibles avec des exemples
                interactifs.
              </p>
              <Link to="/demo">
                <Button variant="secondary" size="lg" className="w-full">
                  Voir les composants →
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card>
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Fonctionnalités à venir
            </h3>
            <ul className="space-y-2 text-secondary-600 dark:text-secondary-300">
              <li>✅ Calcul du Besoin Énergétique (BE)</li>
              <li>✅ Sauvegarde des calculs</li>
              <li>✅ Historique des patients</li>
              <li>🔄 Sélection de croquettes par marque</li>
              <li>🔄 Export PDF des résultats</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <DarkModeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<ComponentDemo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/confirm" element={<AuthConfirm />} />

        {/* Calculator is accessible without authentication */}
        <Route path="/calculator" element={<Calculator />} />

        {/* Protected routes */}
        <Route path="/profile" element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        } />
      </Routes>
    </>
  );
}

export default App;
