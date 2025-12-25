// netlify/functions/get-slogan.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const groupId = event.queryStringParameters?.groupId || null;

    const result = await pool.query(
      `
      SELECT text
      FROM public.group_messages
      WHERE type = 'slogan'
        AND is_active = true
        AND (
          ($1::uuid IS NOT NULL AND group_id = $1::uuid)
          OR
          ($1::uuid IS NULL AND group_id IS NULL)
          OR
          (group_id IS NULL)
        )
      ORDER BY
        CASE
          WHEN $1::uuid IS NOT NULL AND group_id = $1::uuid THEN 0
          WHEN group_id IS NULL THEN 1
          ELSE 2
        END,
        RANDOM()
      LIMIT 1;
      `,
      [groupId]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ text: null }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.rows[0].text }),
    };
  } catch (err) {
    console.error("💥 get-slogan error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        detail: err.message,
      }),
    };
  }
};
