import { Hono } from 'hono';
import { registerUser, loginUser, changePassword } from './authService.ts';

export const authController = new Hono();

authController.post('/register', async (ctx) => {
  const body = await ctx.req.json();
  const { username, email, password } = body;

  const result = await registerUser(username, email, password);
  return ctx.json(result, result.error ? 400 : 201);
});

authController.post('/login', async (ctx) => {
  const body = await ctx.req.json();
  const { email, password } = body;

  const result = await loginUser(email, password);
  return ctx.json(result, result.error ? 401 : 200);
});

authController.post('/change-password', async (ctx) => {
  const body = await ctx.req.json();
  const { oldPassword, newPassword } = body;

  // Use ctx.req.header to get the header value
  const userId = ctx.req.header('userId');
  if (!userId) {
    return ctx.json({ error: 'User ID is required' }, 400);
  }

  const result = await changePassword(userId, oldPassword, newPassword);
  return ctx.json(result, result.error ? 400 : 200);
});
