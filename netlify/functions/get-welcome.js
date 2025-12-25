// netlify/functions/get-welcome.js
import { pool } from "./_db.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // ✅ Netlify-safe: NO uses URL().searchParams acá
    const raw = event.queryStringParameters?.groupId;
    const groupId = raw && UUID_RE.test(raw) ? raw : null;

    const result = await pool.query(
      `
      SELECT id, headline, subline
      FROM welcome_messages
      WHERE is_active = true
        AND (
          (group_id = $1::uuid)
          OR (group_id IS NULL)
        )
      ORDER BY
        CASE WHEN group_id = $1::uuid THEN 0 ELSE 1 END,
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
    return {
      statusCode: 200,
      body: JSON.stringify({ headline: row.headline, subline: row.subline }),
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
