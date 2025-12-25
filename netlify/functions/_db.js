// netlify/functions/_db.js
import pg from "pg";
console.log("DB URL exists?", Boolean(process.env.DATABASE_URL));
const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||         // 👈 pon aquí el nombre REAL que tengas
  process.env.SUPABASE_DATABASE_URL;     // (opcional)

if (!connectionString) {
  // Esto te va a dejar el error CLARITO en logs
  throw new Error(
    "Missing DB connection string. Set DATABASE_URL (or SUPABASE_DB_URL) in Netlify env vars."
  );
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
