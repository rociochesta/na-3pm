// src/pages/Tools.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Hammer,
  Wrench,
  Sparkles,
  HeartHandshake,
  Brain,
  Moon,
  AlertTriangle,
  Coffee,
} from "lucide-react";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { getDaysClean } from "../utils/getDaysClean.js";
import { useGuidedToolForToday } from "../hooks/useGuidedToolForToday.js";

export default function ToolsPage() {
  const [soberDate, setSoberDate] = useState(null);
  const [daysClean, setDaysClean] = useState(null);

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
    todaysTool?.tagline || "One tiny action for messy days.";

  // toolbox “estático” por ahora (luego podemos mapear a la DB)
  const toolboxSections = [
    {
      id: "grounding",
      title: "Grounding tools",
      description: "When your brain is doing cartwheels at 3AM.",
      icon: Brain,
      badge: "Stay in your body",
    },
    {
      id: "connection",
      title: "Connection tools",
      description: "For when isolation starts narrating your story.",
      icon: HeartHandshake,
      badge: "Call, text, exist",
    },
    {
      id: "craving",
      title: "Craving breakers",
      description: "Small actions to survive the next 15 minutes.",
      icon: AlertTriangle,
      badge: "Emergency mode",
    },
    {
      id: "energy",
      title: "Low-energy days",
      description: "When basic hygiene feels like step twelve.",
      icon: Coffee,
      badge: "Bare-minimum wins",
    },
    {
      id: "night",
      title: "Night tools",
      description: "When the meeting is over but your head isn’t.",
      icon: Moon,
      badge: "Survive the dark",
    },
    {
      id: "spark",
      title: "Hope sparks",
      description: "Tiny reminders that you’re not actually doomed.",
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
                <Wrench size={18} className="text-cyan-300 rotate-12 -ml-3" />
              </div>

              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  Your recovery toolbox.
                </h1>
                <p className="text-sm text-slate-200">
                  Not every day needs a full share. Sometimes you just need one
                  tiny action that doesn&apos;t suck.
                </p>
                <p className="text-[11px] text-slate-400">
                  Pick what fits today. Ignore the rest. You&apos;re still
                  here, that already counts as effort.
                </p>
              </div>
            </div>
          </section>

          {/* TODAY'S TOOL TEASER */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Today&apos;s tool
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  One tiny action to shift the whole day.
                </p>
              </div>

              <Link
                to="/"
                className="text-[11px] text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
              >
                View on Home
              </Link>
            </div>

            <div className="mt-1 space-y-1">
              {toolLoading && (
                <p className="text-[11px] text-slate-500 italic">
                  Loading today&apos;s tool…
                </p>
              )}

              {toolError && (
                <p className="text-[11px] text-rose-300">
                  Couldn&apos;t load today&apos;s tool. Try again later.
                </p>
              )}

              {!toolLoading && !toolError && (
                <>
                  <p className="text-sm text-slate-100 font-medium leading-snug">
                    {todaysToolTitle}
                  </p>
                  <p className="text-[11px] text-slate-400">{todaysToolTagline}</p>
                </>
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
              {toolboxSections.map(({ id, title, description, icon: Icon, badge }) => (
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
              ))}
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

