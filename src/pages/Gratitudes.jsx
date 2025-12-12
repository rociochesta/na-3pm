// src/pages/Gratitudes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SquareX, Copy, Share2 } from "lucide-react";
import Header3PM from "../components/Header3PM";
import BottomNav from "../components/BottomNav";


export default function Gratitudes() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [copiedDate, setCopiedDate] = useState(null);
  const [glowCopyDate, setGlowCopyDate] = useState(null);
  const [glowShareDate, setGlowShareDate] = useState(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("na_gratitudes");
      const list = raw ? JSON.parse(raw) : [];
      if (Array.isArray(list)) {
        // ordenar: más reciente primero
        const sorted = [...list].sort((a, b) => {
          if (a.date === b.date) return (b.id || 0) - (a.id || 0);
          return a.date > b.date ? -1 : 1;
        });
        setEntries(sorted);
      }
    } catch (err) {
      console.error("Error reading gratitudes:", err);
      setEntries([]);
    }
  }, []);

  // borrar una gratitude
  const deleteEntry = (idToDelete) => {
    try {
      const raw = window.localStorage.getItem("na_gratitudes");
      const list = raw ? JSON.parse(raw) : [];
      const filtered = list.filter((item) => item.id !== idToDelete);
      window.localStorage.setItem("na_gratitudes", JSON.stringify(filtered));
      setEntries(filtered);
    } catch (err) {
      console.error("Error deleting gratitude:", err);
    }
  };

  // agrupar por fecha
  const groupedByDate = entries.reduce((acc, item) => {
    const key = item.date || "Unknown date";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedByDate).sort((a, b) =>
    a > b ? -1 : 1
  );

  // copiar lista de un día
  const copyListForDate = (dateKey) => {
    const items = groupedByDate[dateKey] || [];
    if (!items.length) return;

    let prettyDate = dateKey;
    try {
      const d = new Date(dateKey);
      if (!Number.isNaN(d.getTime())) {
        prettyDate = d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      // ignore
    }

    let text = `Gratitude List ${prettyDate}\n\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.text}\n`;
    });

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedDate(dateKey);
          setGlowCopyDate(dateKey);

          setTimeout(() => {
            setCopiedDate(null);
            setGlowCopyDate(null);
          }, 900);
        })
        .catch(() => {
          window.prompt("Copy your gratitude list:", text);
        });
    } else {
      window.prompt("Copy your gratitude list:", text);
    }
  };

  const shareListForDate = (dateKey) => {
    const items = groupedByDate[dateKey] || [];
    if (!items.length) return;

    let prettyDate = dateKey;
    try {
      const d = new Date(dateKey);
      if (!Number.isNaN(d.getTime())) {
        prettyDate = d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      // ignore
    }

    let text = `Gratitude List ${prettyDate}\n\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.text}\n`;
    });

    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encoded}`;

    setGlowShareDate(dateKey);
    setTimeout(() => setGlowShareDate(null), 900);

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* resumen arriba */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{entries.length} saved gratitudes</span>
          </div>

          {entries.length === 0 && (
            <div className="mt-4 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300">
              No gratitudes yet. You can start with one small thing that
              didn&apos;t implode.
            </div>
          )}

          {/* lista agrupada por fecha */}
          <div className="space-y-6">
            {dateKeys.map((dateKey) => {
              const items = groupedByDate[dateKey];

              return (
                <section key={dateKey} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {dateKey}
                    </h2>

                    <div className="flex items-center gap-2">
                      {copiedDate === dateKey && (
                        <span className="text-[10px] text-cyan-300">
                          Copied
                        </span>
                      )}

                      {/* COPY button */}
                      <button
                        type="button"
                        onClick={() => copyListForDate(dateKey)}
                        className={`btn-icon ${
                          glowCopyDate === dateKey
                            ? "btn-icon-glow-cyan border-cyan-400 text-cyan-200 bg-cyan-500/10"
                            : "hover:border-cyan-300 hover:text-cyan-200"
                        }`}
                        aria-label="Copy to clipboard"
                      >
                        <Copy size={14} />
                      </button>

                      {/* SHARE button */}
                      <button
                        type="button"
                        onClick={() => shareListForDate(dateKey)}
                        className={`btn-icon ${
                          glowShareDate === dateKey
                            ? "btn-icon-glow-green border-emerald-400 text-emerald-200 bg-emerald-500/10"
                            : "hover:border-emerald-400 hover:text-emerald-200"
                        }`}
                        aria-label="Share to WhatsApp"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => {
                      const label = item.categoryFunny || item.category || "Gratitude";

                      return (
                        <article
                          key={item.id}
                          className="relative bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 space-y-2"
                        >
                          {/* DELETE BUTTON */}
                          <button
                            type="button"
                            onClick={() => deleteEntry(item.id)}
                            title="Delete"
                            className="absolute right-2 top-2 text-slate-600 hover:text-rose-400 transition-colors"
                          >
                            <SquareX size={16} />
                          </button>

                          {/* categoría como pill */}
                          <span className="inline-flex items-center text-[10px] px-2 py-1 rounded-full border border-slate-600 text-slate-300">
                            {label}
                          </span>

                          {/* texto de gratitude */}
                          <p className="text-sm text-slate-100 whitespace-pre-wrap">
                            {item.text}
                          </p>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* acciones abajo */}
          <div className="pt-4 space-y-2">
            <button
              type="button"
              onClick={() => navigate("/gratitudes/new")}
              className="w-full text-sm font-semibold tracking-wide border border-cyan-400 text-cyan-100 rounded-xl py-2.5 hover:bg-cyan-400/10 transition-colors"
            >
              Add new gratitude
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full text-sm font-semibold tracking-wide border border-slate-600 text-slate-200 rounded-xl py-2.5 hover:bg-slate-800/80 transition-colors"
            >
              Back to home
            </button>
          </div>
        </div>
      </main>
          <BottomNav />
    </div>
  );
}
