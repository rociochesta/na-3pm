// netlify/functions/get-tools-welcome.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // 👇 fijo por ahora
    const groupId = 1;

    // opcional: ?variant=raw_3pm | soft_3pm
    const variant = event.queryStringParameters?.variant?.trim() || null;

const result = await pool.query(
  `
  SELECT headline, subline
  FROM tools_welcome_messages
  WHERE group_id = $1
    AND is_active = true
    AND variant = $2::welcome_variant
  ORDER BY sort_order ASC, random()
  LIMIT 1;
  `,
  [groupId, variant]
);


    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          headline: "Tools.",
          subline: "No messages yet. Database is doing its dramatic pause.",
        }),
      };
    }

    const row = result.rows[0];

    return {
      statusCode: 200,
      body: JSON.stringify({
        headline: row.headline,
        subline: row.subline,
      }),
    };
  } catch (err) {
    console.error("💥 get-tools-welcome error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        detail: err.message,
      }),
    };
  }
};
