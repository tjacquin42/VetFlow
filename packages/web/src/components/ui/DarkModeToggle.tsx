import { useDarkMode } from '@/hooks/useDarkMode';

export function DarkModeToggle() {
  const { isDark, toggle } = useDarkMode();

  if (isDark === null) {
    // Don't render until we know the theme (prevents flash)
    return null;
  }

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 p-3 rounded-full bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-all duration-200 hover:scale-110 animate-press shadow-md z-50"
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      <span className="text-2xl" role="img" aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
