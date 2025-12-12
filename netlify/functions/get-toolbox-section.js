// netlify/functions/get-toolbox-section.js
import { pool } from "./_db.js";

export const handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const slug = event.queryStringParameters?.slug;
  if (!slug) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing slug" }) };
  }

  try {
    // 1) section row
    const secRes = await pool.query(
      `
      SELECT id, slug, title, description, badge, icon
      FROM toolbox_sections
      WHERE slug = $1 AND is_active = true
      LIMIT 1;
      `,
      [slug]
    );

    const section = secRes.rows[0];
    if (!section) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Section not found" }),
      };
    }

    // 2) tools
    const toolsRes = await pool.query(
      `
      SELECT
        id, section_id, slug, title, subtitle, tone_line,
        estimated_seconds, kind, is_pinned, pinned_order, sort_order
      FROM toolbox_tools
      WHERE section_id = $1 AND is_active = true
      ORDER BY
        is_pinned DESC,
        pinned_order ASC NULLS LAST,
        sort_order ASC;
      `,
      [section.id]
    );

    // 3) groups
    const groupsRes = await pool.query(
      `
      SELECT id, section_id, title, sort_order
      FROM toolbox_groups
      WHERE section_id = $1
      ORDER BY sort_order ASC;
      `,
      [section.id]
    );

    const groupIds = groupsRes.rows.map((g) => g.id);

    // 4) group items (only if there are groups)
    let groupItems = [];
    if (groupIds.length > 0) {
      const itemsRes = await pool.query(
        `
        SELECT group_id, tool_id, sort_order
        FROM toolbox_group_items
        WHERE group_id = ANY($1::uuid[])
        ORDER BY sort_order ASC;
        `,
        [groupIds]
      );
      groupItems = itemsRes.rows;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        section: {
          id: section.id,
          slug: section.slug,
          title: section.title,
          description: section.description || "",
          badge: section.badge || "",
          icon: section.icon || null,
        },
        tools: toolsRes.rows.map((t) => ({
          id: t.id,
          sectionId: t.section_id,
          slug: t.slug,
          title: t.title,
          subtitle: t.subtitle || "",
          toneLine: t.tone_line || "",
          estimatedSeconds: t.estimated_seconds ?? null,
          kind: t.kind || "cards",
          isPinned: t.is_pinned === true,
          pinnedOrder: t.pinned_order ?? null,
          sortOrder: t.sort_order ?? 0,
        })),
        groups: groupsRes.rows.map((g) => ({
          id: g.id,
          sectionId: g.section_id,
          title: g.title,
          sortOrder: g.sort_order ?? 0,
        })),
        groupItems: groupItems.map((x) => ({
          groupId: x.group_id,
          toolId: x.tool_id,
          sortOrder: x.sort_order ?? 0,
        })),
      }),
    };
  } catch (err) {
    console.error("get-toolbox-section error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal server error",
        details: err.message,
      }),
    };
  }
};
