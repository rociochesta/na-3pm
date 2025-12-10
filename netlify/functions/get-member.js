// netlify/functions/get-member.js
import { Client } from "pg";

const connectionString =
  process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let client;

  try {
    if (!connectionString) {
      console.error("get-member: MISSING connectionString env");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal server error",
          details: "Missing DATABASE_URL / SUPABASE_DB_URL",
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { memberId } = body;

    if (!memberId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "memberId is required" }),
      };
    }

    client = new Client({ connectionString });
    await client.connect();

    const result = await client.query(
      `
      SELECT id, display_name, sober_date
      FROM group_members
      WHERE id = $1;
      `,
      [memberId]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Member not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    console.error("get-member error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch {
        // ignore
      }
    }
  }
};
