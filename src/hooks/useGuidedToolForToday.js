import { useEffect, useMemo, useState } from "react";

function pickIndex(tools, daysClean) {
  if (!tools || tools.length === 0) return null;

  // Si tenemos días limpios, usamos eso como seed determinista
  if (typeof daysClean === "number" && Number.isFinite(daysClean)) {
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

async function fetchWithDebug(url, options) {
  const res = await fetch(url, options);
  const text = await res.text(); // 👈 SIEMPRE leemos texto primero

  if (!res.ok) {
    const snippet = (text || "").slice(0, 400);
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${snippet || "no body"}`);
  }

  // Intentamos parsear JSON desde el texto
  try {
    return JSON.parse(text);
  } catch (e) {
    // Si vino HTML o algo raro
    throw new Error(
      `Invalid JSON from ${url} — ${String(e?.message || e)} — body: ${(text || "").slice(0, 200)}`
    );
  }
}

export function useGuidedToolForToday({ hasSoberDate, daysClean }) {
  const [tool, setTool] = useState(null);
  const [allTools, setAllTools] = useState([]);
  const [index, setIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Normaliza daysClean a number (o null)
  const days = useMemo(() => {
    const n = Number(daysClean);
    return Number.isFinite(n) ? n : null;
  }, [daysClean]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // ✅ Si aún no corresponde (no soberDate/days), no es error.
      // Evita el "Couldn't load" falso.
      if (!hasSoberDate || days === null) {
        setTool(null);
        setAllTools([]);
        setIndex(null);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const json = await fetchWithDebug("/.netlify/functions/get-guided-tools", {
          method: "GET",
        });

        const tools = Array.isArray(json?.tools) ? json.tools : [];

        if (cancelled) return;

        setAllTools(tools);

        if (tools.length === 0) {
          setTool(null);
          setIndex(null);
          setLoading(false);
          return;
        }

        // Filtrar por min/max días (solo si tenemos soberDate y days)
        const eligible = tools.filter((t) => {
          const min = t?.minDays ?? null;
          const max = t?.maxDays ?? null;

          if (min != null && days < min) return false;
          if (max != null && days > max) return false;
          return true;
        });

        const list = eligible.length > 0 ? eligible : tools;

        // ✅ Revertimos el random de prueba:
        // 1 tool por día, determinista
        const idx = pickIndex(list, days);
        const chosen = idx != null ? list[idx] : null;

        setIndex(idx);
        setTool(chosen);
        setLoading(false);
      } catch (err) {
        console.error("useGuidedToolForToday error:", err);
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [hasSoberDate, days]);

  return {
    tool,
    allTools,
    index,
    loading,
    error, // 👈 Error object (o null)
  };
}
