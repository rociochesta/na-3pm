// netlify/functions/get-slogan.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // 👇 Ajusta este group_id según tu setup
  const GROUP_ID = 1;

  try {
    const result = await pool.query(
      `
      SELECT text
      FROM group_slogans
      WHERE group_id = $1
      ORDER BY RANDOM()
      LIMIT 1;
      `,
      [GROUP_ID]
    );

    if (result.rowCount === 0) {
      console.warn("⚠️ No slogans in DB — returning fallback");
      return {
        statusCode: 200,
        body: JSON.stringify({ text: null }),
      };
    }

    console.log("✅ Slogan fetched:", result.rows[0].text);

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
