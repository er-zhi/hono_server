import { query } from '../db/database.ts';

export const getUserById = async (userId: number) => {
  const result = await query('SELECT id, username, email, balance FROM users WHERE id = $1', [userId]);
  return result.rows[0];
};
