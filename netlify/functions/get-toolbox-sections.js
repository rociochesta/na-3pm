// netlify/functions/get-toolbox-sections.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const result = await pool.query(`
      SELECT
        id,
        slug,
        title,
        description,
        badge,
        icon,
        sort_order,
        is_active
      FROM toolbox_sections
      WHERE is_active = true
      ORDER BY sort_order ASC;
    `);

    const sections = result.rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      description: r.description || "",
      badge: r.badge || "",
      icon: r.icon || null,
      sortOrder: r.sort_order ?? 0,
      isActive: r.is_active === true,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ sections }),
    };
  } catch (err) {
    console.error("get-toolbox-sections error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
    };
  }
};
