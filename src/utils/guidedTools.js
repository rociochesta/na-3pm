// src/utils/guidedTools.js

// 1) Cargar desde el JSON público
export async function fetchGuidedTools() {
  const res = await fetch("/data/guidedTodayTools.json");
  if (!res.ok) {
    throw new Error("Failed to load todaysToolsGuided.json");
  }

  const raw = await res.json();

  // 2) Normalizar un poco por si algo viene raro / incompleto
  return (raw || []).map((item, index) => ({
    id: item.id ?? `tool-${index}`,
    title: item.title ?? "Untitled tool",
    how: Array.isArray(item.how) ? item.how : [],
    why: item.why ?? "",
    punchlines: Array.isArray(item.punchlines) ? item.punchlines : [],
  }));
}

// 3) Lógica para elegir tool de hoy
export function pickToolForToday(tools, { hasSoberDate, daysClean } = {}) {
  if (!Array.isArray(tools) || tools.length === 0) {
    return { tool: null, index: -1 };
  }

  // 🔹 AHORA: random cada vez (modo pruebas)
  const randomIndex = Math.floor(Math.random() * tools.length);
  return {
    tool: tools[randomIndex],
    index: randomIndex,
  };

  /*
  // 🔹 DESPUÉS (cuando quieras por día / días clean):
  if (hasSoberDate && typeof daysClean === "number" && daysClean > 0) {
    const idx = (daysClean - 1) % tools.length;
    return { tool: tools[idx], index: idx };
  }

  // Fallback: usar día del mes
  const today = new Date().getDate();
  const idx = today % tools.length;

  return {
    tool: tools[idx],
    index: idx,
  };
  */
}
