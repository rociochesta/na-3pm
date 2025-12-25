// netlify/functions/get-slogan.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const groupId = event.queryStringParameters?.groupId || null;

    // If no groupId, return null so frontend can fallback to local slogans.
    if (!groupId) {
      return { statusCode: 200, body: JSON.stringify({ text: null, reason: "no_groupId" }) };
    }

    const result = await pool.query(
      `
      SELECT text
      FROM group_slogans
      WHERE group_id = $1::uuid
        AND is_active = true
      ORDER BY RANDOM()
      LIMIT 1;
      `,
      [groupId]
    );

    if (result.rowCount === 0) {
      return { statusCode: 200, body: JSON.stringify({ text: null, reason: "no_rows" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ text: result.rows[0].text }) };
  } catch (err) {
    console.error("💥 get-slogan error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
