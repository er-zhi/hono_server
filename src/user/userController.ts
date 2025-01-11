import { Hono } from 'hono';
import { getUserById } from './userService.ts';

export const userController = new Hono();

userController.get('/:id', async (ctx) => {
  const userId = ctx.req.param('id');
  if (!userId) return ctx.json({ error: 'User ID is required' }, 400);

  const user = await getUserById(parseInt(userId));
  if (!user) return ctx.json({ error: 'User not found' }, 404);

  return ctx.json(user);
});
