import { promises as fs } from 'fs';
import path from 'path';
import { query } from '../db/database.ts';

const runSeeds = async () => {
  const seedFile = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../db/seeds/001_seed_data.sql'
  );
  const sql = await fs.readFile(seedFile, 'utf8');
  console.log('Seeding initial data...');
  await query(sql);
  console.log('Seeding completed.');
};

runSeeds().catch((err) => {
  console.error('Error running seeds:', err);
  process.exit(1);
});
