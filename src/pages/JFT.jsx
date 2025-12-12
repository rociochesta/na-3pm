// src/pages/JFT.jsx
import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronLeft, CalendarDays, Tag } from "lucide-react";
import Header3PM from "../components/Header3PM.jsx";
import { useTodayJFT } from "../hooks/useTodayJFT.js";
import BottomNav from "../components/BottomNav";


const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function JFT() {
  const { entry, loading, error } = useTodayJFT();

  const dateLabel = entry
    ? `${MONTH_NAMES[(entry.month ?? 1) - 1]} ${entry.day}`
    : "";

  const punchline = React.useMemo(() => {
    if (!entry || !Array.isArray(entry.punchlines) || entry.punchlines.length === 0) {
      return null;
    }
    const idx = Math.floor(Math.random() * entry.punchlines.length);
    return entry.punchlines[idx];
  }, [entry?.id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Back link */}
          <div className="flex items-center justify-between mb-1">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <ChevronLeft size={14} />
              <span>Back home</span>
            </Link>
          </div>

          {/* Title */}
          <section className="space-y-1">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-300" />
              <h1 className="text-xl font-semibold tracking-tight">
                Just for Today
              </h1>
            </div>

            {dateLabel && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <CalendarDays size={12} />
                <span>{dateLabel}</span>
              </div>
            )}
          </section>

          {/* Content card */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl px-4 py-4 space-y-3 shadow-lg">
            {loading && (
              <p className="text-[12px] text-slate-400">
                Loading today&apos;s meditation…
              </p>
            )}

            {error && (
              <p className="text-[12px] text-rose-300">
                Couldn&apos;t load JFT summaries. Check your JSON file.
              </p>
            )}

            {!loading && !error && !entry && (
              <p className="text-[12px] text-slate-400">
                No JFT summary defined for today yet. 
                You can still read the official meditation on the NA site.
              </p>
            )}

            {!loading && !error && entry && (
              <>
                {/* Theme / title */}
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    Today&apos;s theme
                  </p>
                  <h2 className="text-lg font-medium text-slate-50 leading-snug">
                    {entry.title}
                  </h2>
                </div>

                {/* Tags */}
                {Array.isArray(entry.theme_tags) && entry.theme_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.theme_tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] text-slate-300"
                      >
                        <Tag size={10} className="text-cyan-300" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div className="pt-2 space-y-1">
                  <p className="text-[11px] text-slate-400 mb-1">
                  
                  </p>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {entry.short_summary}
                  </p>
                </div>

                {/* Punchline */}
                {punchline && (
                  <p className="text-[12px] text-cyan-300 italic pt-2 border-t border-slate-800 mt-2">
                    “{punchline}”
                  </p>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-3 border-t border-slate-800 mt-1">
                  <a
                    href="https://www.jftna.org/jft/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-lg border border-cyan-400 px-3 py-1.5 text-[11px] font-medium text-cyan-100 hover:bg-cyan-400/10 transition-colors"
                  >
                    Read full JFT on NA website
                  </a>

                  {/* Later we can add: copy to WhatsApp, mark as read, etc. */}
                  <p className="text-[10px] text-slate-500 text-center">
                    This is a reflection. NA literature is theirs. Both can
                    coexist.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
          <BottomNav />
    </div>
  );
}
