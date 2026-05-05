import { Client } from 'pg';

const ref = process.env.SUPABASE_PROJECT_REF;
const password = process.env.SUPABASE_DB_PASSWORD;
if (!ref || !password) throw new Error('Missing env');

const c = new Client({
  connectionString: `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});

await c.connect();

const triggers = await c.query<{ tgname: string }>(
  `select tgname from pg_trigger where tgrelid = 'auth.users'::regclass and not tgisinternal order by tgname`,
);
console.log('Triggers on auth.users:');
for (const r of triggers.rows) console.log(`  · ${r.tgname}`);

const rls = await c.query<{ tablename: string; rowsecurity: boolean; n_policies: number }>(
  `select t.tablename, t.rowsecurity::bool, count(p.policyname)::int as n_policies
   from pg_tables t
   left join pg_policies p on p.schemaname = t.schemaname and p.tablename = t.tablename
   where t.schemaname = 'migracionplus'
   group by t.tablename, t.rowsecurity
   order by t.tablename`,
);

const total = rls.rows.length;
const withRls = rls.rows.filter((r) => r.rowsecurity).length;
const totalPolicies = rls.rows.reduce((sum, r) => sum + r.n_policies, 0);
console.log(`\nmigracionplus tables: ${total}`);
console.log(`  with RLS enabled:   ${withRls}/${total}`);
console.log(`  total policies:     ${totalPolicies}`);

const helpers = await c.query<{ proname: string }>(
  `select proname from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'migracionplus' order by proname`,
);
console.log(`\nFunctions in migracionplus schema:`);
for (const r of helpers.rows) console.log(`  · ${r.proname}`);

await c.end();
