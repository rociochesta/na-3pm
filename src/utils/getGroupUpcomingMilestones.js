// src/utils/getGroupUpcomingMilestones.js
import { MILESTONES } from "../constants/milestones.js";
import { getDaysClean, getTodayInEdmonton } from "./getDaysClean.js";
/**
 * Milestones de grupo que caen HOY o dentro de windowDays días.
 * (Se usa para "Group milestones this week")
 */
export function getGroupUpcomingMilestones(members, windowDays = 7) {
  if (!Array.isArray(members)) return [];

  const today = getTodayInEdmonton();
  const result = [];

  for (const member of members) {
    if (!member.soberDate) continue;

    const daysClean = getDaysClean(member.soberDate, today);
    if (daysClean == null || daysClean <= 0) continue;

    let bestFuture = null;

    for (const m of MILESTONES) {
      const daysToGo = m.days - daysClean;

      // milestone en el pasado
      if (daysToGo < 0) continue;

      // milestone EXACTO hoy → siempre entra
      if (daysToGo === 0) {
        result.push({
          member,
          milestone: m,
          daysToGo: 0,
        });
        bestFuture = null;
        break; // ya está el más relevante de este bloque para esta persona
      }

      // futuro pero fuera de la ventana
      if (daysToGo > windowDays) continue;

      // nos quedamos con el más cercano dentro de la ventana
      if (!bestFuture || daysToGo < bestFuture.daysToGo) {
        bestFuture = { member, milestone: m, daysToGo };
      }
    }

    if (bestFuture) {
      result.push(bestFuture);
    }
  }

  // ordenar por proximidad y luego por nombre
  result.sort((a, b) => {
    if (a.daysToGo !== b.daysToGo) return a.daysToGo - b.daysToGo;
    return a.member.name.localeCompare(b.member.name);
  });

  return result;
}

/**
 * Próximo chip para TODOS, sin límite de ventana.
 * (Se usa para "Everyone's next chip")
 */
export function getGroupAllNextMilestones(members) {
  if (!Array.isArray(members)) return [];

  const today = getTodayInEdmonton();
  const result = [];

  for (const member of members) {
    if (!member.soberDate) continue;

    const daysClean = getDaysClean(member.soberDate, today);
    if (daysClean == null || daysClean <= 0) continue;

    let best = null;

    for (const m of MILESTONES) {
      const daysToGo = m.days - daysClean;

      // pasado → saltar
      if (daysToGo < 0) continue;

      // nos quedamos con el milestone más cercano (0 = hoy 🎉)
      if (!best || daysToGo < best.daysToGo) {
        best = { member, milestone: m, daysToGo };
      }
    }

    if (best) result.push(best);
  }

  result.sort((a, b) => {
    if (a.daysToGo !== b.daysToGo) return a.daysToGo - b.daysToGo;
    return a.member.name.localeCompare(b.member.name);
  });

  return result;
}
