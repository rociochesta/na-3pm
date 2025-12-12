// netlify/functions/get-guided-tools.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  // Aceptamos GET y POST (tu hook la llama con GET)
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    console.log("get-guided-tools: running query...");

    const result = await pool.query(`
      SELECT
        t.id,
        t.title,
        t.how,
        t.why,
        t.punchlines,
        t.category_id,
        c.name        AS category_name,
        c.range_start AS category_range_start,
        c.range_end   AS category_range_end
      FROM tools t
      LEFT JOIN tool_categories c
        ON c.id = t.category_id
      ORDER BY t.id ASC;
    `);

    console.log("get-guided-tools: rows:", result.rowCount);

    const tools = result.rows.map((row) => ({
      id: row.id,
      slug: null, // aún no usamos slug
      title: row.title,
      how: row.how || [], // _text → array
      why: row.why || "",
      punchlines: row.punchlines || [],
      // rango de días viene de la categoría
      minDays:
        row.category_range_start !== null ? row.category_range_start : null,
      maxDays: row.category_range_end !== null ? row.category_range_end : null,
      isActive: true,
      category: row.category_id
        ? {
            id: row.category_id,
            slug: null,
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
  }
};
