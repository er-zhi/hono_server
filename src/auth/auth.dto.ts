import { z } from 'zod';

// Schema for user registration
export const RegisterUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Schema for user login
export const LoginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Schema for changing password
export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(6, 'Old password must be at least 6 characters long'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
});
