// src/pages/Debug.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Code } from "lucide-react";
import BottomNav from "../components/BottomNav";


export default function Debug() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    try {
      const data = [];

      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (!key || !key.startsWith("na_")) continue;

        const raw = window.localStorage.getItem(key);
        let parsed = null;

        try {
          parsed = JSON.parse(raw);
        } catch {
          parsed = null;
        }

        data.push({ key, raw, parsed });
      }

      // ordenar por key
      data.sort((a, b) => a.key.localeCompare(b.key));

      setEntries(data);
    } catch (err) {
      console.error("Debug load error:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <main className="w-full max-w-md px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
          >
            <ArrowLeft size={14} />
            <span>Back home</span>
          </Link>

          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Debug panel
          </p>
        </header>

        {/* Title */}
        <section className="space-y-1">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Code size={18} className="text-cyan-400" />
            <span>NA localStorage</span>
          </h1>
          <p className="text-[12px] text-slate-400">
            Vista rápida de todas las claves que empiezan con{" "}
            <code className="text-cyan-300">na_</code>. Útil para migrar a base
            de datos o debugear.
          </p>
        </section>

        {/* Entries */}
        <section className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-[12px] text-slate-500">
              No se encontraron claves que empiecen con{" "}
              <code className="text-cyan-300">na_</code>.
            </p>
          ) : (
            entries.map((item) => (
              <div
                key={item.key}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-cyan-300">
                    {item.key}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {item.parsed ? "JSON" : "string"}
                  </span>
                </div>

                {item.parsed ? (
                  <pre className="text-[11px] text-slate-200 bg-slate-950/70 border border-slate-800 rounded-lg px-2 py-1.5 whitespace-pre-wrap break-words">
                    {JSON.stringify(item.parsed, null, 2)}
                  </pre>
                ) : (
                  <p className="text-[11px] text-slate-300 break-words">
                    {item.raw}
                  </p>
                )}
              </div>
            ))
          )}
        </section>
      </main>
          <BottomNav />
    </div>
  );
}
