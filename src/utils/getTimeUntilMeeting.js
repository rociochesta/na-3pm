// src/utils/getTimeUntilMeeting.js
export function getTimeUntilMeeting() {
  const now = new Date();

  // formatter para obtener componentes en zona Edmonton
  const edmontonFmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Edmonton",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // separar componentes
  const parts = edmontonFmt.formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value;

  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));

  // construir fecha EXACTA en Edmonton
  const edmontonNow = new Date(Date.UTC(year, month - 1, day, hour, minute));

  // construir la reunión (3pm Edmonton)
  const edmontonMeeting = new Date(
    Date.UTC(year, month - 1, day, 15, 0, 0, 0)
  );

  // si ya pasó hoy → usar mañana
  if (edmontonNow > edmontonMeeting) {
    edmontonMeeting.setUTCDate(edmontonMeeting.getUTCDate() + 1);
  }

  // diferencia
  const diffMs = edmontonMeeting - edmontonNow;
  if (diffMs <= 0) return "starting now";

  const totalMinutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `in ${minutes}m`;
  if (minutes === 0) return `in ${hours}h`;

  return `in ${hours}h ${minutes}m`;
}
