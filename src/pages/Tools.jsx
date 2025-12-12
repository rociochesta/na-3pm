// src/pages/Tools.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { getDaysClean } from "../utils/getDaysClean.js";
import { useGuidedToolForToday } from "../hooks/useGuidedToolForToday.js";
import { getRandomToolPunchline } from "../utils/getToolPunchline.js";
import GuidedToolModal from "../components/GuidedToolModal.jsx";

export default function ToolsPage() {
  const [soberDate, setSoberDate] = useState(null);
  const [daysClean, setDaysClean] = useState(null);

  const [isToolOpen, setIsToolOpen] = useState(true);
  const [toolDone, setToolDone] = useState(false);
  const [toolDoneLine, setToolDoneLine] = useState("");
  const [isToolGuideOpen, setIsToolGuideOpen] = useState(false);

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
    (toolLoading
      ? "Loading today’s tool…"
      : "No tool assigned for today yet.");

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

          // punchline desde la tool de hoy o fallback
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

  // toolbox “estático” por ahora (luego podemos mapear a la DB)
  const toolboxSections = [
    {
      id: "grounding",
      title: "Grounding tools",
      description: "For when your brain is doing parkour and you just wanted a nap.",
      icon: Brain,
      badge: "Stay in your body",
    },
    {
      id: "connection",
      title: "Connection tools",
      description: "You don’t have to trauma-dump. Just don’t disappear.",
      icon: HeartHandshake,
      badge: "Call, text, exist",
    },
    {
      id: "craving",
      title: "Craving breakers",
      description: "Tiny moves to survive the next 15 minutes without detonating.",
      icon: AlertTriangle,
      badge: "Emergency mode",
    },
    {
      id: "energy",
      title: "Low-energy days",
      description: "For the days when showering feels like step twelve and a half.",
      icon: Coffee,
      badge: "Bare-minimum wins",
    },
    {
      id: "night",
      title: "Night tools",
      description: "When the meeting is over but your brain is still oversharing.",
      icon: Moon,
      badge: "Survive the dark",
    },
    {
      id: "spark",
      title: "Hope sparks",
      description: "Evidence that maybe you’re not completely doomed after all.",
      icon: Sparkles,
      badge: "For later",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* HERO / INTRO */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-4 shadow-xl shadow-black/40">
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-sky-400/15 blur-2xl" />

            <div className="relative flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 border border-cyan-400/70 shadow-inner shadow-black/50">
                <Hammer size={18} className="text-cyan-300 -rotate-12" />
              </div>

              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  Tools for when “I’m fine” is a lie.
                </h1>
                <p className="text-sm text-slate-200">
                  Not every day needs a spiritual awakening. Sometimes you just
                  need one small action that doesn&apos;t make things worse.
                </p>
                <p className="text-[11px] text-slate-400">
                  Pick one. Ignore the rest. Existing today already counts as
                  effort.
                </p>
              </div>
            </div>
          </section>

          {/* TODAY'S TOOL — MISMO BLOQUE QUE EN HOME */}
          <section>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 px-4 py-4 shadow-lg shadow-black/40">
              {/* glows suaves */}
              <div className="pointer-events-none absolute -right-10 -top-14 h-24 w-24 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-sky-400/10 blur-2xl" />

              {/* Header colapsable */}
              <button
                type="button"
                onClick={() => setIsToolOpen((p) => !p)}
                className="relative z-10 w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400"
              >
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-slate-900/60 border border-cyan-400/40">
                    <Hammer size={11} className="text-cyan-300 -rotate-12" />
                  </div>
                  <span>Today&apos;s tool</span>
                </div>

                {isToolOpen ? (
                  <ChevronUp size={14} className="text-slate-400" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400" />
                )}
              </button>

              {/* Contenido */}
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

                  {/* estados del hook: loading / error / ok */}
                  {toolLoading ? (
                    <p className="text-[11px] text-slate-500 italic">
                      Loading today&apos;s tool…
                    </p>
                  ) : toolError ? (
                    <p className="text-[11px] text-rose-400">
                      Couldn&apos;t load today&apos;s tool.
                    </p>
                  ) : (
                    <>
                      {/* título de la tool */}
                      <p
                        className={`text-sm leading-snug font-medium ${
                          toolDone ? "text-cyan-200" : "text-slate-200"
                        }`}
                      >
                        {todaysToolTitle}
                      </p>

                      {/* tagline opcional */}
                      {todaysToolTagline && (
                        <p className="text-[11px] text-slate-400">
                          {todaysToolTagline}
                        </p>
                      )}

                      {/* botón I did this con animación */}
                      <div className="flex justify-end pt-1">
                        <motion.button
                          type="button"
                          onClick={handleToggleToolDone}
                          whileTap={{ scale: 0.94 }}
                          animate={toolDone ? { scale: 1.03 } : { scale: 1 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          className="relative inline-flex items-center"
                        >
                          {/* glow que aparece solo cuando está done */}
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
                            <span className="text-[11px]">
                              {toolDone ? "✓" : "○"}
                            </span>
                            <span>{toolDone ? "Done for today" : "I did this"}</span>
                          </span>
                        </motion.button>
                      </div>

                      {/* punchline SOLO cuando está done */}
                      {toolDone && toolDoneLine && (
                        <p className="text-[11px] text-cyan-300 italic pt-2 border-l border-cyan-400/30 pl-2">
                          {toolDoneLine}
                        </p>
                      )}

                      {/* link al modal guiado */}
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

            <div className="grid grid-cols-1 gap-3">
              {toolboxSections.map(
                ({ id, title, description, icon: Icon, badge }) => (
                  <button
                    key={id}
                    type="button"
                    // más adelante esto podría hacer navigate(`/tools/${id}`)
                    onClick={() => {
                      console.log("TODO: open toolbox section", id);
                    }}
                    className="text-left rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 hover:border-cyan-400/60 hover:bg-slate-900 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/80 border border-slate-700">
                        <Icon size={18} className="text-cyan-300" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-100 truncate">
                            {title}
                          </p>
                          {badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 whitespace-nowrap">
                              {badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          {description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
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
