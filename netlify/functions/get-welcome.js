const { Client } = require("pg");

const connectionString = process.env.DATABASE_URL;

exports.handler = async (_event) => {
  if (!connectionString) {
    console.error("❌ Missing DATABASE_URL env var");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing DATABASE_URL env var" }),
    };
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // 👇 group_id fijo = 1 por ahora
    const groupId = 1;

    const query = `
      select id, headline, subline
      from welcome_messages
      where group_id = $1
        and is_active = true
      order by random()
      limit 1;
    `;

    const result = await client.query(query, [groupId]);

    await client.end();

    if (result.rowCount === 0) {
      console.warn("⚠️ No welcome messages found for group:", groupId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          headline: "Welcome.",
          subline: "Apparently the database is taking a smoke break.",
        }),
      };
    }

    const row = result.rows[0];
    console.log("✨ Welcome message served:", row);

    return {
      statusCode: 200,
      body: JSON.stringify({
        headline: row.headline,
        subline: row.subline,
      }),
    };

  } catch (err) {
    console.error("💥 get-welcome-message error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        detail: err.message,
      }),
    };
  }
};
