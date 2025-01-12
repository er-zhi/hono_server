import { createHmac } from 'crypto';
import { query } from '../db/database.ts';

// Helper function to hash passwords
const hashPassword = (password: string, salt: string): string => createHmac('sha256', salt).update(password).digest('hex');

// Compare plain password with the hashed one
const verifyPassword = (
  password: string,
  salt: string,
  hashedPassword: string,
): boolean => hashPassword(password, salt) === hashedPassword;

// Register User
export const registerUser = async (username: string, email: string, password: string) => {
  const salt = String(process.env.HASH_SALT);
  const hashedPassword = hashPassword(password, salt);
  try {
    const result = await query(
      'INSERT INTO users (username, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, hashedPassword, 1000],
    );
    return { id: result.rows[0].id };
  } catch (err) {
    return { error: 'Registration failed', err };
  }
};

// Login User
export const loginUser = async (email: string, password: string) => {
  const result = await query('SELECT id, password FROM users WHERE email = $1', [email]);
  if (!result.rows[0]) return { error: 'Invalid email or password' };

  const { id, password: hashedPassword } = result.rows[0];
  const salt = String(process.env.HASH_SALT);
  const isPasswordValid = verifyPassword(password, salt, hashedPassword);

  if (!isPasswordValid) return { error: 'Invalid email or password' };

  return { id };
};

// Change Password
export const changePassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const result = await query('SELECT password FROM users WHERE id = $1', [userId]);
  if (!result.rows[0]) return { error: 'User not found' };

  const salt = String(process.env.HASH_SALT);

  const { password: hashedPassword } = result.rows[0];
  const isPasswordValid = verifyPassword(oldPassword, salt, hashedPassword);

  if (!isPasswordValid) return { error: 'Old password is incorrect' };

  const newHashedPassword = hashPassword(newPassword, salt);

  // Fixed query
  await query('UPDATE users SET password = $1 WHERE id = $2', [
    newHashedPassword,
    userId,
  ]);

  return { message: 'Password updated successfully' };
};
