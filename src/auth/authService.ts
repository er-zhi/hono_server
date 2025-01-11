import { query } from '../db/database.ts';
import { createHmac, randomBytes } from 'crypto';

// Helper function to hash passwords
const hashPassword = (password: string, salt: string): string => {
  return createHmac('sha256', salt).update(password).digest('hex');
};

// Generate a random salt
const generateSalt = (): string => {
  return randomBytes(16).toString('hex');
};

// Compare plain password with the hashed one
const verifyPassword = (password: string, salt: string, hashedPassword: string): boolean => {
  return hashPassword(password, salt) === hashedPassword;
};

// Register User
export const registerUser = async (username: string, email: string, password: string) => {
  const salt = generateSalt();
  const hashedPassword = hashPassword(password, salt);

  try {
    const result = await query(
      'INSERT INTO users (username, email, password, salt) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, hashedPassword, salt]
    );
    return { id: result.rows[0].id };
  } catch (err) {
    return { error: 'Registration failed' };
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  const result = await query('SELECT id, password, salt FROM users WHERE email = $1', [email]);
  if (!result.rows[0]) return { error: 'Invalid email or password' };

  const { id, password: hashedPassword, salt } = result.rows[0];
  const isPasswordValid = verifyPassword(password, salt, hashedPassword);

  if (!isPasswordValid) return { error: 'Invalid email or password' };

  return { id };
};

// Change Password
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const result = await query('SELECT password, salt FROM users WHERE id = $1', [userId]);
  if (!result.rows[0]) return { error: 'User not found' };

  const { password: hashedPassword, salt } = result.rows[0];
  const isPasswordValid = verifyPassword(oldPassword, salt, hashedPassword);

  if (!isPasswordValid) return { error: 'Old password is incorrect' };

  const newSalt = generateSalt();
  const newHashedPassword = hashPassword(newPassword, newSalt);
  await query('UPDATE users SET password = $1, salt = $2 WHERE id = $3', [
    newHashedPassword,
    newSalt,
    userId,
  ]);

  return { message: 'Password updated successfully' };
};
