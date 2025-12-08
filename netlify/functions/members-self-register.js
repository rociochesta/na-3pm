// netlify/functions/members-self-register.js
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL; // el KEY que pusiste en Netlify

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, groupCode } = body;

    if (!name || !name.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Name is required" }),
      };
    }

    const client = new Client({ connectionString });
    await client.connect();

    // ⚠️ Asegúrate de tener una tabla "members" en Supabase
    // con al menos: id (serial PK), name (text), group_code (text), created_at (timestamptz)
    const result = await client.query(
      `
      INSERT INTO members (name, group_code, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (name)
      DO UPDATE SET group_code = EXCLUDED.group_code
      RETURNING id, name, group_code, created_at;
      `,
      [name.trim(), groupCode || null]
    );

    await client.end();

    const member = result.rows[0];

    return {
      statusCode: 200,
      body: JSON.stringify(member),
    };
  } catch (err) {
    console.error("Error in members-self-register:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
