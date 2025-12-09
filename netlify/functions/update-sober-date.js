// netlify/functions/update-sober-date.js
const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!connectionString) {
    console.error("❌ No DATABASE_URL / SUPABASE_DB_URL env var found");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing DATABASE_URL env var" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { memberId, soberDate } = body;

    console.log("update-sober-date payload:", body);

    if (!memberId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "memberId is required" }),
      };
    }

    if (!soberDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "soberDate is required" }),
      };
    }

    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }, // 👈 importante para Supabase
    });

    await client.connect();

    const result = await client.query(
      `
      UPDATE group_members
      SET sober_date = $2
      WHERE id = $1
      RETURNING id, display_name, sober_date;
      `,
      [memberId, soberDate]
    );

    await client.end();

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Member not found" }),
      };
    }

    console.log("✅ Sober date updated:", result.rows[0]);

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    console.error("💥 update-sober-date error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
