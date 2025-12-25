// netlify/functions/register-member.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const name = (body.name || "").trim();

    // Acepta groupId O groupCode
    let groupId = body.groupId || null;
    const groupCode = body.groupCode ? String(body.groupCode).trim() : null;

    if (!name) {
      return { statusCode: 400, body: JSON.stringify({ error: "name is required" }) };
    }

    // Si no viene groupId, lo resolvemos por groupCode
    let groupRow = null;

    if (!groupId) {
      if (!groupCode) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "groupId or groupCode is required" }),
        };
      }

      const g = await pool.query(
        `SELECT id, code, name FROM groups WHERE code = $1 LIMIT 1;`,
        [groupCode]
      );

      if (g.rowCount === 0) {
        return { statusCode: 404, body: JSON.stringify({ error: "Group not found" }) };
      }

      groupRow = g.rows[0];
      groupId = groupRow.id;
    } else {
      const g = await pool.query(
        `SELECT id, code, name FROM groups WHERE id = $1 LIMIT 1;`,
        [groupId]
      );
      groupRow = g.rowCount ? g.rows[0] : null;
    }

    // Upsert member (requiere UNIQUE(group_id, display_name))
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        member: result.rows[0],
        group: groupRow,
      }),
    };
  } catch (err) {
    console.error("register-member error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", detail: err.message }),
    };
  }
};
