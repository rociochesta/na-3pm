export function pickRealityCheckResponse({
  thought = "",
  forEvidence = "",
  againstEvidence = "",
  likelyOutcome = "",
}) {
  const clean = (s) => s.toLowerCase().trim();

  const against = clean(againstEvidence);
  const outcome = clean(likelyOutcome);
  const thoughtText = clean(thought);

  // 🔴 Regla 1 — evidencia en contra vacía o mínima
  if (!against || against.length < 10) {
    return "B";
  }

  // 🔴 Regla 2 — lenguaje catastrófico
  const catastrophicWords = [
    "always",
    "never",
    "everything",
    "nothing",
    "ruined",
    "over",
    "no way out",
    "destroyed",
    "end of",
    "can't survive",
    "i will die",
  ];

  const isCatastrophic = catastrophicWords.some((word) =>
    thoughtText.includes(word) || outcome.includes(word)
  );

  if (isCatastrophic) {
    return "C";
  }

  // 🟢 Regla 3 — default
  return "A";
}
