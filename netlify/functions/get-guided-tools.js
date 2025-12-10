// netlify/functions/get-guided-tools.js
import { Client } from "pg";

const connectionString =
  process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

export const handler = async (event) => {
  // Aceptamos GET y POST
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let client;

  try {
    if (!connectionString) {
      console.error("get-guided-tools: MISSING connectionString env");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal server error",
          details: "Missing DATABASE_URL / SUPABASE_DB_URL",
        }),
      };
    }

    client = new Client({ connectionString });
    await client.connect();

    console.log("get-guided-tools: Connected to DB, running query...");

    // ⚠️ AJUSTA nombres de tabla/columnas si es necesario
    const result = await client.query(
      `
      SELECT
        t.id,
        t.slug,
        t.title,
        t.how,
        t.why,
        t.punchlines,
        t.min_days,
        t.max_days,
        t.is_active,
        c.id   AS category_id,
        c.slug AS category_slug,
        c.name AS category_name
      FROM tools t
      LEFT JOIN tool_categories c
        ON c.id = t.category_id
      WHERE t.is_active = TRUE
      ORDER BY t.id ASC;
      `
    );

    console.log("get-guided-tools: rows:", result.rowCount);

    const tools = result.rows.map((row) => ({
      id: row.id,
      slug: row.slug || null,
      title: row.title,
      how: row.how || [], // json/jsonb
      why: row.why || "",
      punchlines: row.punchlines || [],
      minDays: row.min_days ?? null,
      maxDays: row.max_days ?? null,
      isActive: row.is_active,
      category: row.category_id
        ? {
            id: row.category_id,
            slug: row.category_slug,
            name: row.category_name,
          }
        : null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ tools }),
    };
  } catch (err) {
    console.error("get-guided-tools error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        // ignore
      }
    }
  }
};
