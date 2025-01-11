import { Hono } from 'hono';
import { validate } from '../middleware/validate.ts';
import {
  RegisterUserSchema,
  LoginUserSchema,
  ChangePasswordSchema,
} from './auth.dto.ts';
import { registerUser, loginUser, changePassword } from './authService.ts';

export const authController = new Hono();

authController.post(
  '/register',
  validate(RegisterUserSchema),
  async (ctx) => {
    const { username, email, password } = ctx.req.body; // Access validated body
    const result = await registerUser(username, email, password);

    // return ctx.json(result, result.error ? 400 : 201);
    return ctx.json(result, 201)
  }
);

authController.post(
  '/login',
  validate(LoginUserSchema),
  async (ctx) => {
    const { email, password } = ctx.req.body; // Access validated body

    const result = await loginUser(email, password);
    return ctx.json(result, result.error ? 401 : 200);
  }
);

authController.post(
  '/change-password',
  validate(ChangePasswordSchema),
  async (ctx) => {
    const { oldPassword, newPassword } = ctx.req.body; // Access validated body

    const userId = ctx.req.header('userId'); // Get header
    if (!userId) {
      return ctx.json({ error: 'User ID is required' }, 400);
    }

    const result = await changePassword(userId, oldPassword, newPassword);
    return ctx.json(result, result.error ? 400 : 200);
  }
);
