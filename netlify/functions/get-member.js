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

  try {
    const body = JSON.parse(event.body || "{}");
    const { memberId } = body;

    if (!memberId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "memberId is required" }),
      };
    }
const result = await client.query(
  `
  SELECT id, name AS display_name, sober_date
  FROM group_members
  WHERE id = $1;
  `,
  [memberId]
);


    await Client.end();

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
  }
};
