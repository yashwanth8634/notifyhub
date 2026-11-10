import { logger } from '@/lib/logger';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 60000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfterMs?: number;
}

export function createRateLimiter(config: RateLimitConfig) {
  const { maxRequests, windowMs, keyPrefix = 'rl' } = config;
  
  return function checkRateLimit(identifier: string): RateLimitResult {
    const key = `${keyPrefix}:${identifier}`;
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetAt < now) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + windowMs,
      };
      rateLimitStore.set(key, newEntry);
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: newEntry.resetAt,
      };
    }
    
    if (entry.count >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        action: 'rate_limit_exceeded',
        metadata: { key, count: entry.count, maxRequests },
      });
      
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfterMs: entry.resetAt - now,
      };
    }
    
    entry.count++;
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  };
}

export const loginRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000,
  keyPrefix: 'login',
});

export const apiRateLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000,
  keyPrefix: 'api',
});

export const queryCreateRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000,
  keyPrefix: 'query_create',
});