// netlify/functions/get-group-members.js
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
    const { groupId } = body;

    if (!groupId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "groupId is required" }),
      };
    }

    const result = await pool.query(
      `
      SELECT id, group_id, display_name, sober_date, role, created_at
      FROM group_members
      WHERE group_id = $1
      ORDER BY
        CASE role WHEN 'admin' THEN 0 WHEN 'chair' THEN 1 ELSE 2 END,
        lower(display_name) asc;
      `,
      [groupId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ members: result.rows }),
    };
  } catch (err) {
    console.error("get-group-members error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
