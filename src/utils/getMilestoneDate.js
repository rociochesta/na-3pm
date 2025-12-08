// src/utils/getMilestoneDate.js

function parseYMD(dateString) {
  if (!dateString) return null;
  const [y, m, d] = dateString.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function getMilestoneDate(soberDateString, milestoneDays) {
  if (!soberDateString || typeof milestoneDays !== "number") return "";

  const base = parseYMD(soberDateString);
  if (!base) return "";

  base.setHours(0, 0, 0, 0);

  // milestoneDays = días limpios necesarios → caen en el día N
  // ej: 1 día → mismo día; 7 días → día 7; 14 días → día 14
  base.setDate(base.getDate() + (milestoneDays - 1));

  return base.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
