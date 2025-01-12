import { Hono } from 'hono';
import { purchaseProduct } from './purchaseService.ts';
import { log } from '../logger/nanoLogger.ts';

export const purchaseController = new Hono();

purchaseController.post('/', async (ctx) => {
  try {
    const { userId, productId } = await ctx.req.json();

    if (!userId || !productId) {
      return ctx.json({ error: 'User ID and Product ID are required' }, 400);
    }

    const result = await purchaseProduct(userId, productId);
    if (result.error) {
      return ctx.json({ error: result.error }, 400);
    }

    return ctx.json(result, 200);
  } catch (error) {
    log.error('Error in purchaseController:', error);
    return ctx.json({ error: 'An unexpected error occurred' }, 500);
  }
});
