import { createClient } from '@redis/client';
import { log } from '../logger/nanoLogger.ts';

const redis = createClient();

export const initializeCache = async () => {
  try {
    await redis.connect();
    log.info('Redis connected successfully.');
  } catch (error) {
    log.warn('Failed to connect to Redis. Caching will be disabled.');
    log.error('Redis Error.', error);
  }
};

export const closeCache = async () => {
  try {
    await redis.disconnect();
    log.info('Redis connection closed.');
  } catch (error) {
    log.warn('Failed to close Redis connection.');
    log.error('Redis Error', error);
  }
};

export const simpleCache = (ttl: number = 300) => async (ctx: any, next: () => Promise<void>) => {
  const cacheKey = `cache:${ctx.req.url}`;
  const startTime = Date.now();

  log.debug(`Checking cache for key: ${cacheKey}`);

  try {
    // Attempt to retrieve cached data
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      log.debug(`Cache HIT for key: ${cacheKey}`);
      ctx.header('X-Cache-Status', 'HIT');
      ctx.res = new Response(cachedData, {
        headers: { 'Content-Type': 'application/json' },
      });
      log.info(`Response Time: ${Date.now() - startTime}ms, Cache Status: HIT`);
      return; // Short-circuit on cache hit
    }

    log.debug(`Cache MISS for key: ${cacheKey}`);
  } catch (error) {
    log.warn('Redis is unavailable. Returning MISS for cache.');
    log.error('Redis Error during GET', error);
  }

  // Proceed to the handler to fetch data from the external API
  await next();

  try {
    // Cache the response body after fetching from the API
    const responseBody = await ctx.res.text();
    if (responseBody && responseBody !== '{}') {
      await redis.set(cacheKey, responseBody, { EX: ttl });
      log.debug(`Caching response for key: ${cacheKey} with TTL: ${ttl}`);
    } else {
      log.warn(`No valid response body to cache for key: ${cacheKey}`);
    }
  } catch (error) {
    log.warn('Failed to set cache in Redis.');
    log.error('Redis Error during SET', error);
  }

  ctx.header('X-Cache-Status', 'MISS');
  log.info(`Response Time: ${Date.now() - startTime}ms, Cache Status: MISS`);
};
