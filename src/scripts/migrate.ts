import { promises as fs } from 'fs';
import path from 'path';
import { query } from '../db/database.ts';

const runMigrations = async () => {
  const migrationsDir = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../db/migrations'
  );

  const files = await fs.readdir(migrationsDir);

  for (const file of files.sort()) {
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, 'utf8');
    console.log(`Running migration: ${file}`);
    await query(sql);
  }

  console.log('Migrations completed.');
};

runMigrations().catch((err) => {
  console.error('Error running migrations:', err);
  process.exit(1);
});
