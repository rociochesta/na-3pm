import { useEffect, useState } from "react";

export function useTodayJFT() {
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadJFT() {
      const url = "/data/jft_summaries.json";
      console.log("[JFT] Trying to load:", url);

      try {
        const res = await fetch(url, {
          cache: "no-store", // para que no se quede pegado con versiones viejas
        });

        console.log("[JFT] Response status:", res.status);

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          console.error("[JFT] Fetch NOT OK", res.status, text);
          throw new Error(`HTTP ${res.status}`);
        }

        let list;
        try {
          list = await res.json();
        } catch (jsonErr) {
          console.error("[JFT] JSON parse error:", jsonErr);
          throw new Error("JSON_PARSE_ERROR");
        }

        if (!Array.isArray(list)) {
          console.error("[JFT] JSON is not an array:", list);
          throw new Error("INVALID_FORMAT");
        }

        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        console.log("[JFT] Today:", { month, day });

        const todayEntry = list.find(
          (item) => item.month === month && item.day === day
        );

        console.log("[JFT] Today entry:", todayEntry);

        setEntry(todayEntry || null);
        setError(null);
      } catch (err) {
        console.error("[JFT] Error in hook:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadJFT();
  }, []);

  return { entry, loading, error };
}
