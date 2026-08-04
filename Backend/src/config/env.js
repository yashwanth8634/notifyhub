import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

/**
 * Reads an environment variable and throws if it's missing.
 * @param {string} key - The env var name.
 * @returns {string} The env var value.
 */
function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const PORT = parseInt(process.env.PORT || '3000', 10);
const DB_NEON_DATABASE_URL = required('DB_NEON_DATABASE_URL');
const JWT_SECRET = required('JWT_SECRET');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

export {
  PORT,
  DB_NEON_DATABASE_URL,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_ROUNDS,
  NODE_ENV,
};
