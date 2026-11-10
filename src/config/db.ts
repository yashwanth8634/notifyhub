import { Pool, QueryResult } from '@neondatabase/serverless';
import { logger, generateCorrelationId } from '@/lib/logger';

const connString = process.env.DB_NEON_DATABASE_URL;
if (!connString) {
  logger.error('DB_NEON_DATABASE_URL is not set. Please create a .env.local with the connection string.');
}

export const pool = new Pool({
  connectionString: connString,
  ssl: { rejectUnauthorized: false },
  max: 4,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err: Error) => {
  logger.error('Unexpected database pool error', { metadata: { error: err.message } });
});

export async function query(text: string, params: unknown[] = []): Promise<QueryResult> {
  if (!connString) {
    throw new Error('DB_NEON_DATABASE_URL not configured. Aborting query.');
  }
  
  const correlationId = generateCorrelationId();
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.query(text, params, duration, { correlationId });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    const err = error instanceof Error ? error : new Error('Unknown error');
    logger.error('Database query failed', {
      correlationId,
      durationMs: duration,
      metadata: { 
        sql: text.slice(0, 200), 
        paramCount: params.length,
        error: err.message 
      },
    });
    throw error;
  }
}

export { logger };