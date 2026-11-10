function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

export const DB_NEON_DATABASE_URL = getRequiredEnv('DB_NEON_DATABASE_URL');
export const JWT_SECRET = getRequiredEnv('JWT_SECRET');
export const JWT_EXPIRES_IN = getOptionalEnv('JWT_EXPIRES_IN', '24h');
export const BCRYPT_ROUNDS = parseInt(getOptionalEnv('BCRYPT_ROUNDS', '12'), 10);
export const NODE_ENV = getOptionalEnv('NODE_ENV', 'development');
export const LOG_LEVEL = getOptionalEnv('LOG_LEVEL', 'info');