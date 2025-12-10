import { useState } from 'react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { CalculationHistoryEntry } from '@vetflow/shared';

export interface HistoryPanelProps {
  history: CalculationHistoryEntry[];
  onLoad: (entry: CalculationHistoryEntry) => void;
  onDelete: (id: string) => void;
}

export function HistoryPanel({ history, onLoad, onDelete }: HistoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className="fixed left-4 top-4 p-3 rounded-full bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 hover:scale-105 duration-200 animate-press shadow-md z-50 flex items-center gap-2"
        aria-label="Ouvrir l'historique"
      >
        <span className="text-xl">📊</span>
        <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          {history.length}
        </span>
      </button>

      {/* Slide-in panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-scale-in animate-scale-out [animation-duration:100ms]"
            onClick={handleToggle}
          />

          {/* Panel content */}
          <div
            className={cn(
              'absolute left-0 top-0 bottom-0 w-full sm:w-96 bg-white dark:bg-secondary-800 shadow-2xl overflow-y-auto transition-transform duration-300 ease-out',
              isOpen && !isAnimating ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                  Historique
                </h2>
                <button
                  onClick={handleToggle}
                  className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 hover:scale-110 transition-all duration-150 animate-press"
                  aria-label="Fermer"
                >
                  <span className="text-2xl text-secondary-600 dark:text-secondary-400">
                    ×
                  </span>
                </button>
              </div>

              {/* History list */}
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-secondary-500 dark:text-secondary-400">
                    Aucun calcul sauvegardé
                  </p>
                  <p className="text-sm text-secondary-400 dark:text-secondary-500 mt-2">
                    Vos calculs apparaîtront ici automatiquement
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((entry) => (
                    <HistoryCard
                      key={entry.id}
                      entry={entry}
                      onLoad={() => {
                        onLoad(entry);
                        setIsOpen(false);
                      }}
                      onDelete={() => onDelete(entry.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface HistoryCardProps {
  entry: CalculationHistoryEntry;
  onLoad: () => void;
  onDelete: () => void;
}

function HistoryCard({ entry, onLoad, onDelete }: HistoryCardProps) {
  const date = new Date(entry.timestamp);

  return (
    <div className="p-4 rounded-lg border-2 border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 hover:border-primary-300 dark:hover:border-primary-600 transition-colors cursor-pointer animate-press" onClick={onLoad}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-semibold text-secondary-900 dark:text-secondary-100">
            {entry.animalInfo.name || 'Sans nom'}
          </p>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            <span className="text-lg">
              {entry.animalInfo.species === 'dog' ? '🐕' : '🐈'}
            </span>
            {' • '}
            {entry.animalInfo.weight} kg
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-danger-500 hover:text-danger-700 dark:hover:text-danger-400 text-xl p-1 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded hover:scale-110 transition-all duration-150"
          aria-label="Supprimer"
        >
          ×
        </button>
      </div>

      <div className="mb-3">
        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
          {entry.result.mer} kcal/jour
        </p>
        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
          {date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}{' '}
          à{' '}
          {date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onLoad();
        }}
        className="w-full"
      >
        Charger ce calcul
      </Button>
    </div>
  );
}
