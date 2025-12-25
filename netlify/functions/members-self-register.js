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

    if (!groupCode) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "groupCode is required" }),
      };
    }

    // 1) Find group by code
    const g = await pool.query(
      `
      SELECT id, code, name
      FROM groups
      WHERE code = $1
      LIMIT 1;
      `,
      [groupCode]
    );

    if (g.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Group not found" }),
      };
    }

    const groupId = g.rows[0].id;

    // 2) Insert member into group_members (or return existing)
    // Requires unique (group_id, display_name)
    const result = await pool.query(
      `
      INSERT INTO group_members (group_id, display_name, sober_date, role, created_at)
      VALUES ($1, $2, NULL, 'member', NOW())
      ON CONFLICT (group_id, display_name)
      DO UPDATE SET display_name = EXCLUDED.display_name
      RETURNING id, group_id, display_name, sober_date, role, created_at;
      `,
      [groupId, name]
    );

    // Optional: return group info too (helps front)
    return {
      statusCode: 200,
      body: JSON.stringify({
        member: result.rows[0],
        group: g.rows[0],
      }),
    };
  } catch (err) {
    console.error("members-self-register error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
