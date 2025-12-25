// netlify/functions/_db.js
import pg from "pg";
const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE__URL || // 👈 por si la variable quedó con doble _
  process.env.SUPABASE_DB_URL ||
  process.env.SUPABASE_DATABASE_URL;

console.log("[db] has DATABASE_URL:", Boolean(process.env.DATABASE_URL));
console.log("[db] has DATABASE__URL:", Boolean(process.env.DATABASE__URL));
console.log("[db] using connectionString?", Boolean(connectionString));
console.log("[db] conn length:", connectionString?.length || 0);

if (!connectionString) {
  throw new Error("Missing DB connection string (DATABASE_URL).");
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
