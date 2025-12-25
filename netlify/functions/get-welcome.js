import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    // puedes pasar groupId por query en el futuro: /get-welcome?groupId=...
    const groupId = event.queryStringParameters?.groupId || null;

    const result = await pool.query(
      `
      SELECT id, headline, subline
      FROM welcome_messages
      WHERE is_active = true
        AND (
          ($1::uuid is not null and group_id = $1::uuid)
          OR
          ($1::uuid is null and group_id is null)
          OR
          (group_id is null)
        )
      ORDER BY
        CASE
          WHEN $1::uuid is not null AND group_id = $1::uuid THEN 0
          WHEN group_id is null THEN 1
          ELSE 2
        END,
        RANDOM()
      LIMIT 1;
      `,
      [groupId]
    );

    if (result.rowCount === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          headline: "Welcome.",
          subline: "Apparently the database is taking a smoke break.",
        }),
      };
    }

    const row = result.rows[0];
    return { statusCode: 200, body: JSON.stringify({ headline: row.headline, subline: row.subline }) };
  } catch (err) {
    console.error("💥 get-welcome error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error", detail: err.message }),
    };
  }
};
