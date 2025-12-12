// netlify/functions/get-welcome.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // 👇 group_id fijo por ahora
    const groupId = 1;

    const result = await pool.query(
      `
      SELECT id, headline, subline
      FROM welcome_messages
      WHERE group_id = $1
        AND is_active = true
      ORDER BY RANDOM()
      LIMIT 1;
      `,
      [groupId]
    );

    if (result.rowCount === 0) {
      console.warn("⚠️ No welcome messages found for group:", groupId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          headline: "Welcome.",
          subline: "Apparently the database is taking a smoke break.",
        }),
      };
    }

    const row = result.rows[0];
    console.log("✨ Welcome message served:", row);

    return {
      statusCode: 200,
      body: JSON.stringify({
        headline: row.headline,
        subline: row.subline,
      }),
    };
  } catch (err) {
    console.error("💥 get-welcome error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        detail: err.message,
      }),
    };
  }
};
