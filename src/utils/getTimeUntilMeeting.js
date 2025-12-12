export function getTimeUntilMeeting() {
  const now = new Date();

  // construir la hora de la reunión en zona Edmonton
  const meetingInEdmonton = new Date(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Edmonton",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date())
  );

  // poner la hora a exactamente 15:00 Edmonton time
  meetingInEdmonton.setHours(15, 0, 0, 0);

  // convertir esa hora Edmonton → timestamp real
  const meetingLocalTimestamp = new Date(
    meetingInEdmonton.toLocaleString("en-CA", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );

  let diffMs = meetingLocalTimestamp - now;

  // si ya pasó hoy → usar mañana
  if (diffMs < 0) {
    meetingInEdmonton.setDate(meetingInEdmonton.getDate() + 1);
    const tomorrowLocal = new Date(
      meetingInEdmonton.toLocaleString("en-CA", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
    );
    diffMs = tomorrowLocal - now;
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `in ${hours}h ${minutes}m`;
}
