// src/hooks/useGuidedToolForToday.js
import { useEffect, useState } from "react";
import { fetchGuidedTools, pickToolForToday } from "../utils/guidedTools.js";

export function useGuidedToolForToday({ hasSoberDate, daysClean } = {}) {
  const [allTools, setAllTools] = useState([]);
  const [tool, setTool] = useState(null);
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const tools = await fetchGuidedTools();
        if (cancelled) return;

        setAllTools(tools);

        const { tool: picked, index: idx } = pickToolForToday(tools, {
          hasSoberDate,
          daysClean,
        });

        setTool(picked);
        setIndex(idx);
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading guided tools:", err);
        setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [hasSoberDate, daysClean]);

  return {
    tool,
    index,
    allTools,
    loading,
    error,
  };
}
