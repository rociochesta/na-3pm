// netlify/functions/get-guided-tools.js
import { pool } from "./_db.js";

export const handler = async (event) => {
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
        id,
        slug,
        title,
        how,
        why,
        punchlines,
        kind,
        is_active,
        sort_order
      FROM public.guided_tools
      WHERE is_active = true
      ORDER BY sort_order ASC, title ASC;
    `);

    console.log("get-guided-tools: rows:", result.rowCount);

    const tools = result.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      how: row.how || [],
      why: row.why || "",
      punchlines: row.punchlines || [],
      kind: row.kind || "action",
      isActive: row.is_active !== false,
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
