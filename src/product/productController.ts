import { Hono } from 'hono';
import { getLowestPricedItems, getProductsFromDb } from './productService.ts';
import { simpleCache } from '../middleware/redisCache.ts';

export const productController = new Hono();

// Apply cache middleware
productController.use('/', simpleCache(60)); // TODO set 300

// Endpoint to get lowest priced items from Skinport API
productController.get('/', async (ctx) => {
  const result = await getLowestPricedItems();
  return ctx.json(result);
});

// Endpoint to get products from the database
productController.get('/available', async (ctx) => {
  const products = await getProductsFromDb();
  return ctx.json(products);
});
