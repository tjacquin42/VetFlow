export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 100; // Garder les 100 derniers logs en mémoire

  log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code,
      } : undefined,
    };

    // Ajouter au buffer en mémoire
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output avec couleurs
    const emoji = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level];
    const style = {
      debug: 'color: #888',
      info: 'color: #0066ff',
      warn: 'color: #ff9900',
      error: 'color: #ff0000',
    }[level];

    console.groupCollapsed(`${emoji} [${level.toUpperCase()}] ${message}`);
    console.log('%cTimestamp:', style, entry.timestamp.toISOString());
    if (context) console.log('%cContext:', style, context);
    if (error) {
      console.log('%cError:', style, error);
      if (error.stack) console.log('%cStack:', style, error.stack);
    }
    console.groupEnd();
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, context, error);
  }

  // Récupérer tous les logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Récupérer logs par niveau
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  // Exporter logs en JSON
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Copier logs dans le clipboard
  async copyLogsToClipboard() {
    try {
      await navigator.clipboard.writeText(this.exportLogs());
      console.log('✅ Logs copiés dans le presse-papier');
    } catch (err) {
      console.error('❌ Erreur lors de la copie des logs:', err);
    }
  }

  // Télécharger logs en fichier
  downloadLogs() {
    const blob = new Blob([this.exportLogs()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vetflow-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Effacer les logs
  clear() {
    this.logs = [];
    console.clear();
  }
}

export const logger = new Logger();
