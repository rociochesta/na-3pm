// src/utils/getTimeUntilMeeting.js

export function getTimeUntilMeeting() {
  const now = new Date();

  // Hora actual "vista" desde Edmonton
  const edmontonNow = new Date(
    now.toLocaleString("en-CA", { timeZone: "America/Edmonton" })
  );

  // Próxima reunión: 15:00 (3PM) en Edmonton, hoy
  const edmontonMeeting = new Date(edmontonNow);
  edmontonMeeting.setHours(15, 0, 0, 0);

  // Si ya pasó la reunión de hoy, usamos mañana
  if (edmontonNow > edmontonMeeting) {
    edmontonMeeting.setDate(edmontonMeeting.getDate() + 1);
  }

  // Diferencia en ms (en "tiempo Edmonton": es la misma para todo el mundo)
  const diffMs = edmontonMeeting - edmontonNow;

  if (diffMs <= 0) return "starting now";

  const totalMinutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `in ${minutes}m`;
  if (minutes === 0) return `in ${hours}h`;

  return `in ${hours}h ${minutes}m`;
}
