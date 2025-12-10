// netlify/functions/seed-tools.js
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

const tools = [
  // 🔹 pega aquí tus objetos tal cual (sin comentarios //)
  // ej:
  {
    id: "show-up-early",
    title: "Show up five minutes early. Don’t think. Just go.",
    how: [
      "Decide the place.",
      "Leave when the thought says 'you can still stay'.",
      "Arrive early and let reality beat your imagination.",
    ],
    why: "Action gives proof your brain can't argue with.",
    punchlines: ["Early is confidence disguised as punctuality."],
  },
  // ... todo el resto hasta "chaos-not-personality"
];

// helper para asignar category_id por posición
function getCategoryId(index) {
  const n = index + 1; // 1–60
  if (n <= 10) return 3;        // Behavior > Feelings
  if (n <= 20) return 4;        // Boundary Practice
  if (n <= 30) return 5;        // Identity In Progress
  if (n <= 40) return 6;        // Craving Interruptions
  if (n <= 50) return 7;        // Emotional Survival
  return 8;                     // 51–60 Anti-Self-Sabotage
}

export const handler = async () => {
  const client = new Client({ connectionString });

  try {
    await client.connect();

    for (let i = 0; i < tools.length; i++) {
      const t = tools[i];
      const categoryId = getCategoryId(i);

      await client.query(
        `
        INSERT INTO tools (id, title, how, why, punchlines, category_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            how = EXCLUDED.how,
            why = EXCLUDED.why,
            punchlines = EXCLUDED.punchlines,
            category_id = EXCLUDED.category_id;
      `,
        [t.id, t.title, t.how, t.why, t.punchlines, categoryId]
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, count: tools.length }),
    };
  } catch (err) {
    console.error("Seed error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.end();
  }
};
