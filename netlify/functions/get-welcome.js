import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const groupId = 1; // o después lo sacas de localStorage vía query param si quieres

    const result = await pool.query(
      `
      SELECT id, headline, subline
      FROM welcome_messages
      WHERE is_active = true
        AND (group_id = $1 OR group_id IS NULL)
      ORDER BY
        CASE WHEN group_id = $1 THEN 0 ELSE 1 END,
        RANDOM()
      LIMIT 1;
      `,
      [groupId]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          headline: "Welcome.",
          subline: "Apparently the database is taking a smoke break.",
        }),
      };
    }

    const row = result.rows[0];
    return { statusCode: 200, body: JSON.stringify({ headline: row.headline, subline: row.subline }) };
  } catch (err) {
    console.error("💥 get-welcome error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
