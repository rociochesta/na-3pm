import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || process.env.SUPABASE_DB_URL,
  max: 3,                 // bajo para dev
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});
