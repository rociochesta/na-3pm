// netlify/functions/get-guided-tools.js
import { Client } from "pg";

const connectionString =
  process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

export const handler = async (event) => {
  // Aceptamos GET y POST (tu hook la llama con GET)
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

    const result = await client.query(
      `
      SELECT
        t.id,
        t.title,
        t.how,
        t.why,
        t.punchlines,
        t.category_id,
        c.name        AS category_name,
        c.range_start AS category_range_start,
        c.range_end   AS category_range_end,
        c.group_id    AS category_group_id
      FROM tools t
      LEFT JOIN tool_categories c
        ON c.id = t.category_id
      ORDER BY t.id ASC;
      `
    );

    console.log("get-guided-tools: rows:", result.rowCount);

    const tools = result.rows.map((row) => ({
      id: row.id,
      slug: null, // aún no usamos slug
      title: row.title,
      // how / punchlines son _text → arrays de texto
      how: row.how || [],
      why: row.why || "",
      punchlines: row.punchlines || [],
      // usamos el rango de la categoría como min/maxDays
      minDays:
        row.category_range_start !== null
          ? row.category_range_start
          : null,
      maxDays:
        row.category_range_end !== null ? row.category_range_end : null,
      isActive: true, // por ahora todas activas
      category: row.category_id
        ? {
            id: row.category_id,
            slug: null, // tampoco hay slug en tool_categories
            name: row.category_name,
            groupId: row.category_group_id,
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
