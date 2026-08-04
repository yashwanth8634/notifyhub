export const DB_NEON_DATABASE_URL = process.env.DB_NEON_DATABASE_URL!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
export const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
export const NODE_ENV = process.env.NODE_ENV || 'development';
