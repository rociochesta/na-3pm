// src/pages/Tools.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Hammer,
  Sparkles,
  HeartHandshake,
  Brain,
  Moon,
  AlertTriangle,
  Coffee,
  ChevronUp,
  ChevronDown,
  Wrench,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { getDaysClean } from "../utils/getDaysClean.js";
import { useGuidedToolForToday } from "../hooks/useGuidedToolForToday.js";
import { getRandomToolPunchline } from "../utils/getToolPunchline.js";
import GuidedToolModal from "../components/GuidedToolModal.jsx";

const ICONS = {
  Brain,
  Sparkles,
  HeartHandshake,
  Moon,
  AlertTriangle,
  Coffee,
};

export default function ToolsPage() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ hook dentro del componente

  const [soberDate, setSoberDate] = useState(null);
  const [daysClean, setDaysClean] = useState(null);

  const [isToolOpen, setIsToolOpen] = useState(true);
  const [toolDone, setToolDone] = useState(false);
  const [toolDoneLine, setToolDoneLine] = useState("");
  const [isToolGuideOpen, setIsToolGuideOpen] = useState(false);

  // ✅ Toolbox sections from DB (via Netlify function)
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState(""); // ✅ faltaba

  // ✅ recargar secciones cada vez que vuelves a /tools
  useEffect(() => {
    let ignore = false;

    async function loadSections() {
      try {
        setSectionsLoading(true);
        setSectionsError("");

        const res = await fetch("/.netlify/functions/get-toolbox-sections");
        if (!res.ok) throw new Error("Failed to load toolbox sections");

        const json = await res.json();
        const next = Array.isArray(json.sections) ? json.sections : [];

        if (!ignore) setSections(next);
      } catch (e) {
        if (!ignore) {
          setSectionsError(e?.message || "Failed to load sections");
          // NO: setSections([])  ← así evitas quedarte en "empty" por un error momentáneo
        }
      } finally {
        if (!ignore) setSectionsLoading(false);
      }
    }

    loadSections();
    return () => (ignore = true);
  }, [location.key]);

  // leer clean date local (Home ya se encarga de sincronizar con DB)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("na_soberDate");
      if (stored) {
        setSoberDate(stored);
        setDaysClean(getDaysClean(stored));
      }
    } catch {
      // ignore
    }

    // recuperar estado de la tool del día (igual que en Home)
    try {
      const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const doneKey = `na_toolDone_${todayKey}`;
      const punchKey = `na_toolDoneLine_${todayKey}`;

      const storedDone = window.localStorage.getItem(doneKey);
      const storedLine = window.localStorage.getItem(punchKey);

      setToolDone(storedDone === "1");
      if (storedLine) setToolDoneLine(storedLine);
    } catch {
      // ignore
    }
  }, []);

  const hasSoberDate = Boolean(soberDate) && daysClean !== null;

  // tool del día (mismo hook que en Home)
  const {
    tool: todaysTool,
    loading: toolLoading,
    error: toolError,
  } = useGuidedToolForToday({ hasSoberDate, daysClean });

  const todaysToolTitle =
    todaysTool?.title ||
    (toolLoading ? "Loading today’s tool…" : "No tool assigned for today yet.");

  const todaysToolTagline =
    todaysTool?.tagline || "One tiny action for when white-knuckling isn’t working.";

  function handleToggleToolDone() {
    const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const doneKey = `na_toolDone_${todayKey}`;
    const punchKey = `na_toolDoneLine_${todayKey}`;

    setToolDone((prev) => {
      const next = !prev;

      try {
        if (next) {
          window.localStorage.setItem(doneKey, "1");

          let line = "";
          if (
            todaysTool &&
            Array.isArray(todaysTool.punchlines) &&
            todaysTool.punchlines.length > 0
          ) {
            const i = Math.floor(Math.random() * todaysTool.punchlines.length);
            line = todaysTool.punchlines[i];
          } else {
            line = getRandomToolPunchline();
          }

          setToolDoneLine(line);
          window.localStorage.setItem(punchKey, line);
        } else {
          window.localStorage.removeItem(doneKey);
          window.localStorage.removeItem(punchKey);
          setToolDoneLine("");
        }
      } catch {
        // ignore
      }

      return next;
    });
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* HERO / INTRO — Option C (almost invisible, premium) */}
<section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 shadow-lg shadow-black/30">
  {/* ultra-soft glow (barely there) */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-28 w-28 rounded-full bg-cyan-500/10 blur-3xl" />
  <div className="pointer-events-none absolute -left-20 -bottom-16 h-24 w-24 rounded-full bg-sky-400/5 blur-3xl" />

  <div className="relative flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/60 border border-slate-800">
      <Hammer size={12} className="text-cyan-300" />
    </div>

    <h1 className="text-[15px] font-semibold tracking-tight text-slate-100">
      Tools for when “I’m fine” is a lie.
    </h1>
  </div>
</section>


          {/* TODAY'S TOOL */}
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4 py-4 shadow-lg shadow-black/40">
              <div className="pointer-events-none absolute -right-10 -top-14 h-24 w-24 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-sky-400/10 blur-2xl" />

              <button
                type="button"
                onClick={() => setIsToolOpen((p) => !p)}
                className="relative z-10 w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400"
              >
                        <div className="flex items-center gap-2">
                        <div className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-900/60 border border-cyan-400/40">
                            <Wrench size={11} className="text-cyan-300 -rotate-12" />
                        </div>
                        <span>Today&apos;s tool</span>
                        </div>

                        {isToolOpen ? (
                        <ChevronUp size={14} className="text-slate-400" />
                        ) : (
                        <ChevronDown size={14} className="text-slate-400" />
                        )}
                    </button>

                    {isToolOpen && (
                <motion.div
                  key="tool-content"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="relative z-10 space-y-3 pt-3"
                >
                  <p className="text-[11px] text-slate-400">
                    One tiny action to shift the whole day.
                  </p>

                  {toolLoading ? (
                    <p className="text-[11px] text-slate-500 italic">
                      Loading today&apos;s tool…
                    </p>
                  ) : toolError ? (
                    <p className="text-[11px] text-rose-400">
                      Couldn&apos;t load today&apos;s tool.
                    </p>
                  ) : (
                    <>|
                      <p
                        className={`text-sm leading-snug font-medium ${
                          toolDone ? "text-cyan-200" : "text-slate-200"
                        }`}
                      >
                        {todaysToolTitle}
                      </p>

                      {todaysToolTagline && (
                        <p className="text-[11px] text-slate-400">{todaysToolTagline}</p>
                      )}

                      <div className="flex justify-end pt-1">
                        <motion.button
                          type="button"
                          onClick={handleToggleToolDone}
                          whileTap={{ scale: 0.94 }}
                          animate={toolDone ? { scale: 1.03 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          className="relative inline-flex items-center"
                        >
                          <AnimatePresence>
                            {toolDone && (
                              <motion.span
                                key="tool-glow"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                className="absolute inset-0 rounded-full bg-cyan-400/25 blur-sm"
                              />
                            )}
                          </AnimatePresence>

                          <span
                            className={`relative inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors
                              ${
                                toolDone
                                  ? "border-cyan-400 bg-cyan-400/10 text-cyan-100"
                                  : "border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
                              }`}
                          >
                            <span className="text-[11px]">{toolDone ? "✓" : "○"}</span>
                            <span>{toolDone ? "Done for today" : "I did this"}</span>
                          </span>
                        </motion.button>
                      </div>

                      {toolDone && toolDoneLine && (
                        <p className="text-[11px] text-cyan-300 italic pt-2 border-l border-cyan-400/30 pl-2">
                          {toolDoneLine}
                        </p>
                      )}

                      {!toolDone && todaysTool && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setIsToolGuideOpen(true)}
                            className="inline-flex items-center gap-1 text-[10px] text-slate-400 underline underline-offset-2 hover:text-cyan-300"
                          >
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-slate-600 text-[9px]">
                              ?
                            </span>
                            <span>How do I do this?</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </section>

          {/* TOOLBOX GRID */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Toolbox
              </h2>
              <p className="text-[10px] text-slate-500">
                Use what helps. Leave what doesn&apos;t.
              </p>
            </div>

            {sectionsLoading ? (
              <p className="text-[11px] text-slate-500 italic">Loading toolbox…</p>
            ) : sectionsError ? (
              <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 px-4 py-3">
                <p className="text-sm text-rose-300">Couldn’t load toolbox.</p>
                <p className="text-[11px] text-rose-200/70 mt-1">{sectionsError}</p>
              </div>
            ) : sections.length === 0 ? (
              <p className="text-[11px] text-slate-500">No toolbox sections yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {sections.map((row) => {
                  const Icon = ICONS[row.icon] ?? Wrench;

                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => navigate(`/tools/${row.slug}`)}
                      className="text-left rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 hover:border-cyan-400/60 hover:bg-slate-900 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 border border-slate-700">
                          <Icon size={18} className="text-cyan-300" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-100 truncate">
                              {row.title}
                            </p>
                            {row.badge ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 whitespace-nowrap">
                                {row.badge}
                              </span>
                            ) : null}
                          </div>

                          {row.description ? (
                            <p className="text-[11px] text-slate-400 mt-1">
                              {row.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <GuidedToolModal
        open={isToolGuideOpen}
        onClose={() => setIsToolGuideOpen(false)}
        tool={todaysTool}
      />

      <BottomNav />
    </div>
  );
}
