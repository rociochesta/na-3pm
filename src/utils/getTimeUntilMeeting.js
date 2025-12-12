// src/utils/getTimeUntilMeeting.js

export function getTimeUntilMeeting() {
  // reunión diaria a las 3PM Edmonton
  const MEETING_HOUR = 15; // 3 PM
  const MEETING_MINUTE = 0;

  // 1) Fecha actual en la zona horaria del usuario
  const now = new Date();

  // 2) Construir la fecha/hora de la reunión EN Edmonton
  const edmontonNow = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Edmonton" })
  );

  const edmontonMeeting = new Date(edmontonNow);
  edmontonMeeting.setHours(MEETING_HOUR, MEETING_MINUTE, 0, 0);

  // 3) Si la reunión ya pasó hoy → usar mañana
  if (edmontonNow > edmontonMeeting) {
    edmontonMeeting.setDate(edmontonMeeting.getDate() + 1);
  }

  // 4) Convertir la reunión Edmonton → hora local del usuario
  const meetingLocal = new Date(
    edmontonMeeting.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );

  // 5) Diferencia final
  const diffMs = meetingLocal - now;
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffH <= 0 && diffM <= 0) return "starting now";
  if (diffH === 0) return `in ${diffM}m`;

  return `in ${diffH}h ${diffM}m`;
}
