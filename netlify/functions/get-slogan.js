// netlify/functions/get-slogan.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const groupIdRaw = event.queryStringParameters?.groupId || null;

    const isUuid =
      typeof groupIdRaw === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        groupIdRaw
      );

    const groupId = isUuid ? groupIdRaw : null;

    const result = await pool.query(
      `
      SELECT text
      FROM group_messages
      WHERE type = 'slogan'
        AND is_active = true
        AND (
          ($1::uuid IS NOT NULL AND group_id = $1::uuid)
          OR
          (group_id IS NULL)
        )
      ORDER BY
        CASE
          WHEN $1::uuid IS NOT NULL AND group_id = $1::uuid THEN 0
          ELSE 1
        END,
        RANDOM()
      LIMIT 1;
      `,
      [groupId]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          text: "Recovery works better when we show up.",
          source: "fallback",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: result.rows[0].text,
        source: groupId ? "group" : "generic",
      }),
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
