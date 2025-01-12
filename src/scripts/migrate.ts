import { promises as fs } from 'fs';
import path from 'path';
import { query } from '../db/database.ts';
import { log } from '../logger/nanoLogger.ts';

const runMigrations = async () => {
  const migrationsDir = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../db/migrations',
  );

  const files = await fs.readdir(migrationsDir);

  for (const file of files.sort()) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, 'utf8');
    log.info(`Running migration: ${file}`);
    await query(sql);
  }

  log.info('Migrations completed.');
};

runMigrations().catch((err) => {
  log.error('Error running migrations:', err);
  process.exit(1);
});
