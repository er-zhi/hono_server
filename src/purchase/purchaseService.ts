import { query } from '../db/database.ts';
import { log } from '../logger/nanoLogger.ts';

export const purchaseProduct = async (userId: number, productId: number) => {
  try {
    // Fetch product details
    const productResult = await query('SELECT id, price FROM products WHERE id = $1', [productId]);
    if (!productResult.rows[0]) {
      return { error: 'Product not found' };
    }
    const product = productResult.rows[0];

    // Fetch user details
    const userResult = await query('SELECT id, balance FROM users WHERE id = $1', [userId]);
    if (!userResult.rows[0]) {
      return { error: 'User not found' };
    }
    const user = userResult.rows[0];

    // Check if the user has sufficient balance
    if (user.balance < product.price) {
      return { error: 'Insufficient balance' };
    }

    // Deduct product price from user's balance
    const updatedBalance = user.balance - product.price;
    await query('UPDATE users SET balance = $1 WHERE id = $2', [updatedBalance, userId]);

    // Create purchase record
    await query('INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)', [userId, productId]);

    return {
      message: 'Purchase successful',
      updatedBalance,
    };
  } catch (error) {
    log.error('Error in purchaseProduct:', error);
    return { error: 'An unexpected error occurred' };
  }
};
