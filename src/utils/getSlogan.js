import { SLOGAN_SETS } from "../constants/slogans.js";

/**
 * Local FALLBACK slogan picker.
 * DB is the source of truth.
 */
export function getSlogan({ groupKey } = {}) {
  let list = [];

  // 1) Group-specific fallback if explicitly provided and exists
  if (groupKey && Array.isArray(SLOGAN_SETS[groupKey])) {
    list = SLOGAN_SETS[groupKey];
  }
  // 2) Generic fallback
  else if (Array.isArray(SLOGAN_SETS.generic)) {
    list = SLOGAN_SETS.generic;
  }

  if (!list.length) {
    return "One more clean day is still one more.";
  }

  const item = list[Math.floor(Math.random() * list.length)];
  return item.text;
}
