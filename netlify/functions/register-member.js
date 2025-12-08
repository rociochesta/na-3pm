import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

export const handler = async (event) => {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method not allowed" };

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, groupId = 1 } = body; // 1 = 3PM group

    if (!name || !name.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name is required" }),
      };
    }

    const client = new Client({ connectionString });
    await client.connect();

    const result = await client.query(
      `
      INSERT INTO group_members (group_id, display_name, created_at)
      VALUES ($1, $2, NOW())
      RETURNING id, display_name;
      `,
      [groupId, name.trim()]
    );

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };

  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
