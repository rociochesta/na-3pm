// delete-member.js
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
    console.error("❌ Missing DATABASE_URL");
    return { statusCode: 500, body: JSON.stringify({ error: "Missing DB URL" }) };
  }

  try {
    const { memberId } = JSON.parse(event.body || "{}");

    if (!memberId) {
      return { statusCode: 400, body: JSON.stringify({ error: "memberId required" }) };
    }

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }, // 👈 REQUIRED FOR SUPABASE
    });

    await client.connect();

    const result = await client
      .query(`DELETE FROM group_members WHERE id = $1 RETURNING id;`, [memberId]);

    await client.end();

    if (result.rowCount === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: "Member not found" }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true, deleted: memberId }) };
  } catch (err) {
    console.error("💥 delete-member error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
