const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!connectionString) {
    console.error("❌ Missing DB URL");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing DB URL env var" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, groupId } = body;

    console.log("register-member payload:", body);

    if (!name || !groupId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "name and groupId are required" }),
      };
    }

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    // 1) Buscar si ya existe
    const existing = await client.query(
      `
      SELECT id, display_name, sober_date
      FROM group_members
      WHERE group_id = $1 AND display_name = $2
      LIMIT 1;
      `,
      [groupId, name]
    );

    let row;

    if (existing.rowCount > 0) {
      row = existing.rows[0];
      console.log("register-member: existing member", row);
    } else {
      // 2) Crear nuevo con sober_date = NULL
      const inserted = await client.query(
        `
        INSERT INTO group_members (group_id, display_name, sober_date, created_at)
        VALUES ($1, $2, NULL, NOW())
        RETURNING id, display_name, sober_date;
        `,
        [groupId, name]
      );
      row = inserted.rows[0];
      console.log("register-member: inserted member", row);
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(row),
    };
  } catch (err) {
    console.error("💥 register-member error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        detail: err.message,
      }),
    };
  }
};
