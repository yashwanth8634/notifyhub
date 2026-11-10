export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  correlationId?: string;
  userId?: number;
  action?: string;
  resource?: string;
  resourceId?: string | number;
  durationMs?: number;
  metadata?: Record<string, any>;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LEVEL = LOG_LEVELS[(process.env.LOG_LEVEL as LogLevel) || 'info'];

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= CURRENT_LEVEL;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const correlation = context?.correlationId ? ` [${context.correlationId}]` : '';
  const user = context?.userId ? ` user:${context.userId}` : '';
  const action = context?.action ? ` ${context.action}` : '';
  const duration = context?.durationMs ? ` ${context.durationMs}ms` : '';
  const meta = context?.metadata ? ` ${JSON.stringify(context.metadata)}` : '';
  
  return `${timestamp} [${level.toUpperCase()}]${correlation}${user}${action}: ${message}${duration}${meta}`;
}

export const logger = {
  debug: (message: string, context?: LogContext) => {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, context));
  },
  
  info: (message: string, context?: LogContext) => {
    if (shouldLog('info')) console.info(formatMessage('info', message, context));
  },
  
  warn: (message: string, context?: LogContext) => {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, context));
  },
  
  error: (message: string, context?: LogContext) => {
    if (shouldLog('error')) console.error(formatMessage('error', message, context));
  },
  
  query: (sql: string, params: any[], durationMs: number, context?: LogContext) => {
    const truncatedSql = sql.length > 200 ? sql.slice(0, 200) + '...' : sql;
    if (shouldLog('debug')) {
      logger.debug(`Query executed`, {
        ...context,
        action: 'db_query',
        durationMs,
        metadata: { sql: truncatedSql, paramCount: params.length },
      });
    }
    
    if (durationMs > 200) {
      logger.warn(`Slow query detected`, {
        ...context,
        action: 'slow_query',
        durationMs,
        metadata: { sql: truncatedSql },
      });
    }
  },
};

export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function createChildLogger(baseContext: LogContext) {
  return {
    debug: (message: string, context?: LogContext) => logger.debug(message, { ...baseContext, ...context }),
    info: (message: string, context?: LogContext) => logger.info(message, { ...baseContext, ...context }),
    warn: (message: string, context?: LogContext) => logger.warn(message, { ...baseContext, ...context }),
    error: (message: string, context?: LogContext) => logger.error(message, { ...baseContext, ...context }),
  };
}