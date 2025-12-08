import { SLOGAN_SETS } from "../constants/slogans.js";

export function getSlogan({ groupKey } = {}) {
  let effectiveKey;

  if (groupKey && SLOGAN_SETS[groupKey]) {
    effectiveKey = groupKey;
  } else if (groupKey && !SLOGAN_SETS[groupKey]) {
    effectiveKey = "generic";
  } else {
    effectiveKey = "3PM";
  }

  const list = SLOGAN_SETS[effectiveKey] || SLOGAN_SETS.generic || [];
  if (!list.length) return "One more clean day is still one more.";

  const item = list[Math.floor(Math.random() * list.length)];
  return item.text;
}
