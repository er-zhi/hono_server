import { promises as fs } from 'fs';
import path from 'path';
import { query } from '../db/database.ts';
import { log } from '../logger/nanoLogger.ts';

const runSeeds = async () => {
  const seedFile = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../db/seeds/001_seed_data.sql',
  );
  const sql = await fs.readFile(seedFile, 'utf8');
  log.info('Seeding initial data...');
  await query(sql);
  log.info('Seeding completed.');
};

runSeeds().catch((err) => {
  log.error('Error running seeds:', err);
  process.exit(1);
});
