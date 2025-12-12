import React from 'react';
import { ErrorDisplay } from './ui/ErrorDisplay';
import { logger } from '@/lib/logger';
import { AppError, ErrorCode } from '@/lib/errors';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Logger l'erreur
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    // Créer une AppError
    const appError = new AppError({
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
      userMessage: 'Une erreur inattendue s\'est produite dans l\'application',
      originalError: error,
      context: {
        componentStack: errorInfo.componentStack,
      },
      timestamp: new Date(),
      recoverable: true,
      suggestions: [
        'Rechargez la page',
        'Videz le cache de votre navigateur',
        'Contactez le support si le problème persiste',
      ],
    });

    this.setState({ error: appError });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <ErrorDisplay
              error={this.state.error}
              onRetry={this.handleReset}
              showTechnicalDetails={true}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
