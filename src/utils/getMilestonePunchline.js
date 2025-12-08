// src/utils/getMilestonePunchline.js

let cache = null; // evita recargar el JSON cada vez

export async function getMilestonePunchline(milestoneId) {
  try {
    // 1) si ya está cargado, usar memoria
    if (!cache) {
      const res = await fetch("/data/milestonePunchlines.json");
      if (!res.ok) throw new Error("Failed to load milestone punchlines JSON");
      cache = await res.json();
    }

    // 2) buscamos la lista de ese milestone
    const list = cache[milestoneId];
    if (!Array.isArray(list) || list.length === 0) return null;

    // 3) random
    const i = Math.floor(Math.random() * list.length);
    return list[i];

  } catch (err) {
    console.error("Milestone punchline error:", err);
    return null;
  }
}
