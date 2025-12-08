// src/utils/getToolForTheDay.js
import { TODAYS_TOOLS_GUIDED } from "../constants/todaysTools";

// evita índices negativos o fuera de rango
function wrapIndex(idx, length) {
  if (!length) return 0;
  return ((idx % length) + length) % length;
}

/**
 * Obtiene la tool del día desde TODAYS_TOOLS_GUIDED
 *
 * @param {object} opts
 * @param {number} [opts.dayNumber] - opcional (ej: días clean - 1)
 * @param {Date}   [opts.date]      - opcional, si no hay dayNumber usamos la fecha
 *
 * @returns {{ tool: any, index: number } | null}
 */
export function getToolForTheDay(opts = {}) {
  const tools = TODAYS_TOOLS_GUIDED;
  if (!Array.isArray(tools) || tools.length === 0) return null;

  const { dayNumber, date = new Date() } = opts;

  let index;

  if (typeof dayNumber === "number" && Number.isFinite(dayNumber)) {
    // modo “días clean”
    index = wrapIndex(dayNumber, tools.length);
  } else {
    // modo “fecha calendario” (fallback si no hay sober date)
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const base = new Date("2025-01-01T00:00:00Z"); // ancla fija

    const todayLocal = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const diffDays = Math.floor((todayLocal - base) / MS_PER_DAY);
    index = wrapIndex(diffDays, tools.length);
  }

  const tool = tools[index];

  return { tool, index };
}
