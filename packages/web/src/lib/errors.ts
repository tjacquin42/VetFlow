export enum ErrorCode {
  // Erreurs réseau
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',

  // Erreurs Supabase
  SUPABASE_CONNECTION_ERROR = 'SUPABASE_CONNECTION_ERROR',
  SUPABASE_QUERY_ERROR = 'SUPABASE_QUERY_ERROR',
  SUPABASE_AUTH_ERROR = 'SUPABASE_AUTH_ERROR',

  // Erreurs de données
  DATA_NOT_FOUND = 'DATA_NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  PARSE_ERROR = 'PARSE_ERROR',

  // Erreurs localStorage
  STORAGE_ERROR = 'STORAGE_ERROR',

  // Erreurs génériques
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppErrorDetails {
  code: ErrorCode;
  message: string;
  userMessage: string; // Message français pour l'utilisateur
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: Date;
  recoverable: boolean; // Peut-on réessayer ?
  suggestions?: string[]; // Suggestions de résolution
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly userMessage: string;
  public readonly originalError?: Error;
  public readonly context?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly recoverable: boolean;
  public readonly suggestions?: string[];

  constructor(details: AppErrorDetails) {
    super(details.message);
    this.name = 'AppError';
    this.code = details.code;
    this.userMessage = details.userMessage;
    this.originalError = details.originalError;
    this.context = details.context;
    this.timestamp = details.timestamp;
    this.recoverable = details.recoverable;
    this.suggestions = details.suggestions;

    // Capturer la stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      stack: this.stack,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack,
      } : undefined,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      recoverable: this.recoverable,
      suggestions: this.suggestions,
    };
  }
}

// Helper pour créer des AppError depuis des erreurs Supabase
export function createSupabaseError(
  error: any,
  context?: Record<string, any>
): AppError {
  // Mapper les codes d'erreur Supabase
  let code = ErrorCode.SUPABASE_QUERY_ERROR;
  let userMessage = 'Une erreur est survenue lors de la communication avec la base de données';
  const suggestions: string[] = [];

  if (error.message?.includes('Failed to fetch')) {
    code = ErrorCode.NETWORK_ERROR;
    userMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    suggestions.push('Vérifiez votre connexion internet');
    suggestions.push('Réessayez dans quelques instants');
  } else if (error.code === 'PGRST116') {
    code = ErrorCode.DATA_NOT_FOUND;
    userMessage = 'Aucune donnée trouvée';
    suggestions.push('Vérifiez que les données existent');
  }

  return new AppError({
    code,
    message: error.message || 'Unknown Supabase error',
    userMessage,
    originalError: error,
    context,
    timestamp: new Date(),
    recoverable: true,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  });
}
