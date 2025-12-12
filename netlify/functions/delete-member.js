// netlify/functions/delete-member.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { memberId } = JSON.parse(event.body || "{}");

    if (!memberId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "memberId required" }),
      };
    }

    const result = await pool.query(
      `DELETE FROM group_members WHERE id = $1 RETURNING id;`,
      [memberId]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Member not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, deleted: memberId }),
    };
  } catch (err) {
    console.error("💥 delete-member error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
