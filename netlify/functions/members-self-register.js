// netlify/functions/register-member.js
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
    const groupId = body.groupId;

    console.log("register-member payload:", body);

    if (!name || !groupId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "name and groupId are required" }),
      };
    }

    // 1) Buscar si ya existe
    const existing = await pool.query(
      `
     SELECT id, group_id, display_name, sober_date, role
      FROM group_members
      WHERE group_id = $1 AND display_name = $2
      LIMIT 1;
      `,
      [groupId, name]
    );

    if (existing.rowCount > 0) {
      const row = existing.rows[0];
      console.log("register-member: existing member", row);
      return {
        statusCode: 200,
        body: JSON.stringify(row),
      };
    }

    // 2) Crear nuevo con sober_date = NULL
    const inserted = await pool.query(
      `
    INSERT INTO group_members (group_id, display_name, sober_date, role, created_at)
VALUES ($1, $2, NULL, 'member', NOW())
RETURNING id, group_id, display_name, sober_date, role;
      `,
      [groupId, name]
    );

    const row = inserted.rows[0];
    console.log("register-member: inserted member", row);

    return {
      statusCode: 200,
      body: JSON.stringify(row),
    };
  } catch (err) {
    console.error("register-member error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        detail: err.message,
      }),
    };
  }
};
