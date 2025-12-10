// src/hooks/useGuidedToolForToday.js
import { useEffect, useState } from "react";

function pickIndex(tools, daysClean) {
  if (!tools || tools.length === 0) return null;

  // Si tenemos días limpios, usamos eso como “seed”
  if (typeof daysClean === "number" && !Number.isNaN(daysClean)) {
    return daysClean % tools.length;
  }

  // Fallback: seed por fecha (AAAA MM DD → número)
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return seed % tools.length;
}

export function useGuidedToolForToday({ hasSoberDate, daysClean }) {
  const [tool, setTool] = useState(null);
  const [allTools, setAllTools] = useState([]);
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/.netlify/functions/get-guided-tools", {
          method: "GET",
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(
            `get-guided-tools failed: ${res.status} – ${txt || "no body"}`
          );
        }

        const json = await res.json();
        const tools = Array.isArray(json.tools) ? json.tools : [];

        if (cancelled) return;

        setAllTools(tools);

        if (tools.length === 0) {
          setTool(null);
          setIndex(null);
          setLoading(false);
          return;
        }

        // Filtrar por min/max días si tenemos soberDate
        const eligible = tools.filter((t) => {
          if (!hasSoberDate || daysClean == null) return true;

          const min = t.minDays ?? null;
          const max = t.maxDays ?? null;

          if (min != null && daysClean < min) return false;
          if (max != null && daysClean > max) return false;
          return true;
        });

        const list = eligible.length > 0 ? eligible : tools;
/*
        const idx = pickIndex(list, daysClean);
        const chosen = idx != null ? list[idx] : null;

        setIndex(idx);
        setTool(chosen);
        */
       // Versión de prueba: elige una herramienta aleatoria cada vez
const randomIndex = Math.floor(Math.random() * list.length);
const randomTool = list[randomIndex];

setIndex(randomIndex);
setTool(randomTool);
        setLoading(false);
      } catch (err) {
        console.error("useGuidedToolForToday error:", err);
        if (!cancelled) {
          setError(err.message || "Could not load tools");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [hasSoberDate, daysClean]);

  return {
    tool,
    allTools,
    index,
    loading,
    error,
  };
}
