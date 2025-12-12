import { useState } from 'react';
import { Button, Card } from '@/components/ui';
import { AppError } from '@/lib/errors';
import { logger } from '@/lib/logger';

export interface ErrorDisplayProps {
  error: AppError | Error | string;
  onRetry?: () => void;
  onBack?: () => void;
  showTechnicalDetails?: boolean;
}

export function ErrorDisplay({
  error,
  onRetry,
  onBack,
  showTechnicalDetails = false,
}: ErrorDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Extraire les infos de l'erreur
  const errorInfo = error instanceof AppError ? {
    code: error.code,
    userMessage: error.userMessage,
    message: error.message,
    stack: error.stack,
    context: error.context,
    suggestions: error.suggestions,
    recoverable: error.recoverable,
    timestamp: error.timestamp,
  } : error instanceof Error ? {
    code: 'UNKNOWN_ERROR',
    userMessage: 'Une erreur inattendue s\'est produite',
    message: error.message,
    stack: error.stack,
    context: undefined,
    suggestions: undefined,
    recoverable: true,
    timestamp: new Date(),
  } : {
    code: 'UNKNOWN_ERROR',
    userMessage: error,
    message: error,
    stack: undefined,
    context: undefined,
    suggestions: undefined,
    recoverable: true,
    timestamp: new Date(),
  };

  const copyErrorToClipboard = async () => {
    const errorDetails = JSON.stringify({
      code: errorInfo.code,
      message: errorInfo.message,
      stack: errorInfo.stack,
      context: errorInfo.context,
      timestamp: errorInfo.timestamp,
    }, null, 2);

    try {
      await navigator.clipboard.writeText(errorDetails);
      alert('Détails de l\'erreur copiés dans le presse-papier');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <Card variant="outlined" className="border-red-300 dark:border-red-700">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="text-4xl">⚠️</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Erreur
            </h3>
            <p className="text-secondary-900 dark:text-secondary-100">
              {errorInfo.userMessage}
            </p>
            {errorInfo.code && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 font-mono">
                Code: {errorInfo.code}
              </p>
            )}
          </div>
        </div>

        {/* Suggestions */}
        {errorInfo.suggestions && errorInfo.suggestions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
              💡 Suggestions
            </h4>
            <ul className="list-disc list-inside text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {errorInfo.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Technical Details Toggle */}
        {showTechnicalDetails && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-secondary-600 dark:text-secondary-400"
            >
              {showDetails ? '▼' : '▶'} Détails techniques
            </Button>

            {showDetails && (
              <div className="mt-3 bg-secondary-900 dark:bg-secondary-950 rounded-lg p-4 text-xs font-mono overflow-x-auto">
                <div className="text-secondary-100 space-y-2">
                  <div>
                    <span className="text-secondary-400">Message:</span>{' '}
                    <span className="text-red-400">{errorInfo.message}</span>
                  </div>
                  {errorInfo.context && (
                    <div>
                      <span className="text-secondary-400">Context:</span>{' '}
                      <pre className="text-secondary-200 mt-1">
                        {JSON.stringify(errorInfo.context, null, 2)}
                      </pre>
                    </div>
                  )}
                  {errorInfo.stack && (
                    <div>
                      <span className="text-secondary-400">Stack Trace:</span>
                      <pre className="text-secondary-300 mt-1 text-xs whitespace-pre-wrap">
                        {errorInfo.stack}
                      </pre>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyErrorToClipboard}
                  className="mt-3 text-secondary-400 hover:text-secondary-200"
                >
                  📋 Copier les détails
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {onRetry && errorInfo.recoverable && (
            <Button variant="primary" size="md" onClick={onRetry}>
              🔄 Réessayer
            </Button>
          )}
          {onBack && (
            <Button variant="ghost" size="md" onClick={onBack}>
              ← Retour
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            onClick={() => logger.downloadLogs()}
            className="text-secondary-600 dark:text-secondary-400"
          >
            📥 Télécharger les logs
          </Button>
        </div>
      </div>
    </Card>
  );
}
