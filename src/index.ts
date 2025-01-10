import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { authController } from './auth/authController.ts';
import { productController } from './product/productController.ts';
import { purchaseController } from './purchase/purchaseController.ts';
import { userController } from './user/userController.ts';

const app = new Hono();

app.route('/auth', authController);
app.route('/products', productController);
app.route('/users', userController);
app.route('/purchases', purchaseController);

const port = process.env.PORT;
if (port === undefined) throw new Error('Environment variable "PORT" is required but not defined.');

process.stdout.write(`Server is running on port: ${port}\n`);

serve({
  fetch: app.fetch,
  port: +port,
});
