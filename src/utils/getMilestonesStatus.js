import { MILESTONES } from "../constants/milestones.js";

export function getMilestonesStatus(daysClean) {
  if (daysClean == null) return { reached: [], next: null };

  const reached = MILESTONES.filter((m) => daysClean >= m.days);
  const next = MILESTONES.find((m) => daysClean < m.days) || null;

  return { reached, next };
}
