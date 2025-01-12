import pkg from 'pg';
import { log } from '../logger/nanoLogger.ts';

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

// Export the async query function
export const query = async (text: string, params?: any[]) => {
  try {
    return pool.query(text, params);
  } catch (error) {
    log.error('Database query error: ', error);
    throw error; // Rethrow the error so the caller knows something went wrong
  }
};
