/**
 * Apply migration SQL files directly via pg client.
 *
 * Used because the Supabase CLI's `db push` is too defensive when the project
 * already contains migrations from sibling apps — it refuses to apply ours
 * unless we lie about the state of theirs. Going around the CLI is fine in
 * this case because:
 *
 *   1. Our migrations live in an isolated `migracionplus` schema.
 *   2. They're idempotent (`create table if not exists`, `drop policy if exists`).
 *   3. The only `auth.users` trigger we install is named with our suffix.
 *
 * Reads the connection string from SUPABASE_DB_URL or builds one from
 * SUPABASE_PROJECT_REF + SUPABASE_DB_PASSWORD (pooler URL).
 *
 * Usage:
 *   npm run db:migrate
 */

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'migrations');
const FILES = ['0001_schema.sql', '0002_rls.sql'];

function buildConnectionString(): string {
  const explicit = process.env.SUPABASE_DB_URL;
  if (explicit) return explicit;
  const ref = process.env.SUPABASE_PROJECT_REF;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!ref || !password) {
    throw new Error(
      'Set SUPABASE_DB_URL, or both SUPABASE_PROJECT_REF and SUPABASE_DB_PASSWORD.',
    );
  }
  // Direct connection (port 5432) — works for one-off migration runs.
  // For production runtime use the pooler; the host varies by region and is
  // shown in Supabase Dashboard → Project Settings → Database → Connection string.
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`;
}

async function main(): Promise<void> {
  const connectionString = buildConnectionString();
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('  ✓ connected');

  for (const filename of FILES) {
    const path = join(MIGRATIONS_DIR, filename);
    const sql = readFileSync(path, 'utf-8');
    console.log(`→ applying ${filename} (${sql.length} bytes)…`);
    try {
      await client.query(sql);
      console.log(`  ✓ ${filename} applied`);
    } catch (err) {
      console.error(`  ✗ ${filename} failed:`, (err as Error).message);
      throw err;
    }
  }

  // Verify schema landed.
  const { rows } = await client.query<{ tablename: string }>(
    `select tablename from pg_tables where schemaname = 'migracionplus' order by tablename`,
  );
  console.log(`\n✓ migracionplus schema has ${rows.length} tables:`);
  for (const r of rows) console.log(`  · ${r.tablename}`);

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
