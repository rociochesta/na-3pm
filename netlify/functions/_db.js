// netlify/functions/_db.js
import pg from "pg";
const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DATABASE__URL || // 👈 por si la variable quedó con doble _
  process.env.SUPABASE_DB_URL ||
  process.env.SUPABASE_DATABASE_URL;



if (!connectionString) {
  throw new Error("Missing DB connection string (DATABASE_URL).");
  
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
