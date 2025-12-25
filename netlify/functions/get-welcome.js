// netlify/functions/get-welcome.js
import { pool } from "./_db.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    // ✅ Netlify-safe: queryStringParameters SIEMPRE
    const raw = event.queryStringParameters?.groupId;
    const groupId = raw && UUID_RE.test(raw) ? raw : null;

    // Pick 1 headline and 1 subline (prefer group match, fallback to NULL/global)
    const result = await pool.query(
      `
      WITH
      h AS (
        SELECT text
        FROM public.group_messages
        WHERE is_active = true
          AND type = 'welcome_headline'
          AND (group_id = $1::uuid OR group_id IS NULL)
        ORDER BY
          CASE WHEN group_id = $1::uuid THEN 0 ELSE 1 END,
          RANDOM()
        LIMIT 1
      ),
      s AS (
        SELECT text
        FROM public.group_messages
        WHERE is_active = true
          AND type = 'welcome_subline'
          AND (group_id = $1::uuid OR group_id IS NULL)
        ORDER BY
          CASE WHEN group_id = $1::uuid THEN 0 ELSE 1 END,
          RANDOM()
        LIMIT 1
      )
      SELECT
        COALESCE((SELECT text FROM h), 'Welcome.') AS headline,
        COALESCE((SELECT text FROM s), 'Apparently the database is taking a smoke break.') AS subline
      ;
      `,
      [groupId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    console.error("💥 get-welcome error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
