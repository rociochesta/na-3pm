// src/utils/cleanTime.js
import { MILESTONES } from "../constants/milestones.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function normalizeToLocalMidnight(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// 🔹 1) Canonical: how many days clean (inclusive, NA style)
export function getDaysClean(soberDateString, now = new Date()) {
  if (!soberDateString) return null;

  const start = normalizeToLocalMidnight(soberDateString);
  const today = normalizeToLocalMidnight(now);

  const diffMs = today - start;
  if (diffMs < 0) return null; // future date

  const wholeDays = Math.floor(diffMs / MS_PER_DAY);

  // +1 because the sober date itself is Day 1
  return wholeDays + 1;
}

// 🔹 2) Everything else derived from daysClean
export function getCleanTimeInfo(soberDateString, now = new Date()) {
  const daysClean = getDaysClean(soberDateString, now);
  if (daysClean == null) return null;

  const weeksClean = Math.floor(daysClean / 7);

  const reached = MILESTONES.filter(m => daysClean >= m.days);

  const upcoming = MILESTONES
    .filter(m => daysClean < m.days)
    .map(m => ({
      ...m,
      daysToGo: m.days - daysClean,
    }))
    .sort((a, b) => a.days - b.days);

  const nextMilestone = upcoming[0] ?? null;

  return {
    daysClean,      // 15
    weeksClean,     // 2
    reached,        // all milestones already hit
    upcoming,       // all future milestones with daysToGo
    nextMilestone,  // closest milestone ahead, or null
  };
}
