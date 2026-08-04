// @ts-nocheck
import { Pool } from '@neondatabase/serverless';


export const pool = new Pool({
  connectionString: process.env.DB_NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

export async function query(text: string, params: any[] = []) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (duration > 200) {
    console.warn(`Slow query (${duration}ms):`, text.slice(0, 120));
  }

  return result;
}
