// src/utils/getDaysClean.js

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// 👇 helper para parsear "YYYY-MM-DD" sin sorpresas de timezone
function parseYMD(dateString) {
  if (!dateString) return null;
  const [y, m, d] = dateString.split("-").map(Number);
  if (!y || !m || !d) return null;
  // new Date(año, mesIndex, día) = fecha local, sin UTC raro
  return new Date(y, m - 1, d);
}

// Hoy en zona horaria de Edmonton, normalizado a medianoche
export function getTodayInEdmonton() {
  const edmontonNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Edmonton" })
  );
  edmontonNow.setHours(0, 0, 0, 0);
  return edmontonNow;
}

/**
 * Días limpios estilo NA:
 * - La fecha de sobriedad cuenta como Día 1 (INCLUSIVO).
 * - Se calcula usando "hoy" en Edmonton.
 */
export function getDaysClean(soberDateString, todayOverride) {
  const start = parseYMD(soberDateString);
  if (!start) return null;

  start.setHours(0, 0, 0, 0);

  const today = todayOverride ?? getTodayInEdmonton();
  today.setHours(0, 0, 0, 0);

  const diffMs = today - start;
  if (diffMs < 0) return 0;

  const diffDays = Math.floor(diffMs / MS_PER_DAY);

  // +1 porque la soberDate es Día 1
  return diffDays + 1;
}
