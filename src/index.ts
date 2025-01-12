import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { authController } from './auth/authController.ts';
import { log } from './logger/nanoLogger.ts';
import { initializeCache, closeCache } from './middleware/redisCache.ts';
import { productController } from './product/productController.ts';
import { purchaseController } from './purchase/purchaseController.ts';
import { userController } from './user/userController.ts';

const app = new Hono();
app.use('*', logger());

app.route('/auth', authController);
app.route('/products', productController);
app.route('/users', userController);
app.route('/purchases', purchaseController);

const port = process.env.PORT;
if (port === undefined) throw new Error('Environment variable "PORT" is required but not defined.');

const startServer = async () => {
  let redisConnected = false;

  try {
    // Initialize Redis connection
    log.info('Initializing Redis connection...');
    await initializeCache();
    redisConnected = true;
    log.info('Redis connected successfully.');
  } catch (error) {
    log.warn('Failed to connect to Redis. Server will continue without caching.');
    log.error('Redis Error', error);
  }

  log.info(`Server is running on port: ${port}`);

  // Start the server
  serve({
    fetch: app.fetch,
    port: +port,
  });

  // Handle server shutdown
  process.on('SIGINT', async () => {
    log.info('Shutting down server...');
    if (redisConnected) {
      await closeCache();
      log.info('Redis connection closed.');
    }
    process.exit(0);
  });
};

startServer();
