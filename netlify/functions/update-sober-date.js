// netlify/functions/update-sober-date.js
import { Client } from "pg";

// Use whatever env var name you set in Netlify
const connectionString = process.env.DATABASE_URLL;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { memberId, soberDate } = body;

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

    const client = new Client({ connectionString });
    await client.connect();

    // Update the group_members table
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

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    console.error("update-sober-date error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
