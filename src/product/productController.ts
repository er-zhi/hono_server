import { Hono } from 'hono';
import { getLowestPricedItems } from './productService.ts';
import { simpleCache } from '../cache/redisCache.ts';

export const productController = new Hono();

// Apply cache middleware
productController.use('/', simpleCache(10)); // TODO set 300

productController.get('/', async (ctx) => {
  const result = await getLowestPricedItems();
  return ctx.json(result);
});
