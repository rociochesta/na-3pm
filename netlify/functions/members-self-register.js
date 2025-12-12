// netlify/functions/members-self-register.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const name = (body.name || "").trim();
    const groupCode = body.groupCode ? String(body.groupCode).trim() : null;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name is required" }),
      };
    }

    const result = await pool.query(
      `
      INSERT INTO members (name, group_code, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (name)
      DO UPDATE SET group_code = EXCLUDED.group_code
      RETURNING id, name, group_code, created_at;
      `,
      [name, groupCode || null]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    console.error("members-self-register error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
