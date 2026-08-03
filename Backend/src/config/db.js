import pg from 'pg';
import { DATABASE_URL } from './env.js';

const { Pool } = pg;

/**
 * PostgreSQL connection pool.
 * Uses DATABASE_URL from env, configured for Neon serverless with SSL.
 */
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err.message);
});

/**
 * Executes a parameterized SQL query.
 * @param {string} text - SQL query string with $1, $2… placeholders.
 * @param {Array} params - Parameter values.
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (duration > 200) {
    console.warn(`Slow query (${duration}ms):`, text.slice(0, 120));
  }

  return result;
}

export { pool, query };
