// netlify/functions/get-slogan.js
const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  if (!connectionString) {
    console.error("❌ No DATABASE_URL env var found");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing DATABASE_URL env var" }),
    };
  }

  // 👇 Ajusta este group_id según tu setup
  const GROUP_ID = 1;

  try {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }, // necesario para Supabase
    });

    await client.connect();

    const result = await client.query(
      `
      SELECT text
      FROM group_slogans
      WHERE group_id = $1
      ORDER BY RANDOM()
      LIMIT 1;
      `,
      [GROUP_ID]
    );

    await client.end();

    if (result.rows.length === 0) {
      console.warn("⚠️ No slogans in DB — returning fallback");
      return {
        statusCode: 200,
        body: JSON.stringify({ text: null }),
      };
    }

    console.log("✅ Slogan fetched:", result.rows[0].text);

    return {
      statusCode: 200,
      body: JSON.stringify({ text: result.rows[0].text }),
    };
  } catch (err) {
    console.error("💥 get-slogan error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
