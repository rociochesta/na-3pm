// netlify/functions/get-welcome.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    // ✅ groupId dinámico (querystring) + fallback a null (global)
    // En el front: fetch("/.netlify/functions/get-welcome?groupId=" + na_groupId)
    const groupIdRaw = event.queryStringParameters?.groupId || null;
    const groupId = groupIdRaw && String(groupIdRaw).trim() ? String(groupIdRaw).trim() : null;

    // Helper: trae 1 texto por type, priorizando grupo > global
    async function pickOne(type) {
      const result = await pool.query(
        `
        select id, text
        from group_messages
        where
          type = $2
          and is_active = true
          and (
            ($1::uuid is not null and group_id = $1::uuid)
            or group_id is null
          )
        order by
          case when group_id = $1::uuid then 0 else 1 end,
          (random() * weight) desc,
          created_at desc
        limit 1;
        `,
        [groupId, type]
      );

      return result.rowCount ? result.rows[0].text : null;
    }

    const headline =
      (await pickOne("welcome_headline")) ||
      "Welcome back. If you relapsed, you still get to be here.";

    const subline =
      (await pickOne("welcome_subline")) ||
      "We don’t grade your days. We just keep you company in them.";

    return {
      statusCode: 200,
      body: JSON.stringify({ headline, subline }),
    };
  } catch (err) {
    console.error("💥 get-welcome error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        detail: err.message,
      }),
    };
  }
};
