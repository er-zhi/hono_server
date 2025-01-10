import { Hono } from 'hono';

export const userController = new Hono();

// userController.get('/users/:userId', (c) => {
//   const { userId } = c.req.param();
//   // Fetch user data from DB using userId
//   return c.json({ userId, username: 'John Doe', email: 'john@example.com' });
// });
