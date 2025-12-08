export function getGratitudeStats() {
  try {
    const raw = window.localStorage.getItem("na_gratitudes");
    if (!raw) return { thisWeek: 0, lastText: null };

    const list = JSON.parse(raw);
    if (!Array.isArray(list) || list.length === 0) {
      return { thisWeek: 0, lastText: null };
    }

    // orden: fecha más nueva primero
    // si la fecha es igual, el id más grande (última guardada) primero
    const sorted = [...list].sort((a, b) => {
      if (a.date === b.date) {
        const idA = Number(a.id || 0);
        const idB = Number(b.id || 0);
        return idB - idA; // último guardado primero
      }
      return b.date.localeCompare(a.date); // fecha más reciente primero
    });

    const last = sorted[0];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 6);

    const thisWeek = sorted.filter((g) => {
      if (!g.date) return false;
      const d = new Date(g.date);
      if (Number.isNaN(d.getTime())) return false;
      d.setHours(0, 0, 0, 0);
      return d >= weekAgo && d <= today;
    }).length;

    return { thisWeek, lastText: last?.text ?? null };
  } catch {
    return { thisWeek: 0, lastText: null };
  }
}
