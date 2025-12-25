import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const memberId = body.memberId;

    if (!memberId) {
      return { statusCode: 400, body: JSON.stringify({ error: "memberId is required" }) };
    }

    const result = await pool.query(
      `
      SELECT id, display_name, sober_date, role, group_id
      FROM members
      WHERE id = $1
      LIMIT 1
      `,
      [memberId] // ✅ uuid string
    );

    if (result.rowCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "Member not found" }) };
    }

    return { statusCode: 200, body: JSON.stringify(result.rows[0]) };
  } catch (err) {
    console.error("💥 get-member error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
