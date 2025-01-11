import { createClient } from '@redis/client';
import { log } from '../logger/nanoLogger.ts';

const redis = createClient();

export const initializeCache = async () => {
  try {
    await redis.connect();
    log.info('Redis connected successfully.');
  } catch (error) {
    log.warn('Failed to connect to Redis. Caching will be disabled.');
    log.error(`Redis Error: ${(error as Error).message}`);
  }
};

export const closeCache = async () => {
  try {
    await redis.disconnect();
    log.info('Redis connection closed.');
  } catch (error) {
    log.warn('Failed to close Redis connection.');
    log.error(`Redis Error: ${(error as Error).message}`);
  }
};

export const simpleCache = (ttl: number = 300) => {
  return async (ctx: any, next: () => Promise<void>) => {
    const cacheKey = `cache:${ctx.req.url}`;
    const startTime = Date.now();

    log.debug(`Checking cache for key: ${cacheKey}`);

    try {
      // Check Redis for cached response
      const cachedData = await redis.get(cacheKey);

      if (cachedData) {
        log.debug(`Cache HIT for key: ${cacheKey}`);
        ctx.header('X-Cache-Status', 'HIT');
        const duration = Date.now() - startTime;
        log.info(`Response Time: ${duration}ms, Cache Status: HIT`);
        ctx.res = new Response(cachedData, {
          headers: { 'Content-Type': 'application/json' },
        });
        return;
      }
      log.debug(`Cache MISS for key: ${cacheKey}`);
    } catch (error) {
      log.warn('Redis is unavailable. Returning MISS for cache.');
      log.error(`Redis Error during GET: ${(error as Error).message}`);
    }

    // Proceed with the next middleware or handler
    log.debug(`Proceeding to next middleware for key: ${cacheKey}`);
    await next();

    try {
      // Cache the response body after processing
      const responseBody = await ctx.res.text(); // Convert response to text
      if (responseBody && responseBody !== '{}') {
        log.debug(`Caching response for key: ${cacheKey} with TTL: ${ttl}`);
        log.debug(`Response data to cache: ${responseBody}`);
        await redis.set(cacheKey, responseBody, { EX: ttl });
      } else {
        log.warn(`No valid response body to cache for key: ${cacheKey}`);
      }
    } catch (error) {
      log.warn('Failed to set cache in Redis.');
      log.error(`Redis Error during SET: ${(error as Error).message}`);
    }

    ctx.header('X-Cache-Status', 'MISS');
    const duration = Date.now() - startTime;
    log.info(`Response Time: ${duration}ms, Cache Status: MISS`);
  };
};
