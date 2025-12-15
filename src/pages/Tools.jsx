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


  // ✅ Toolbox sections from DB (via Netlify function)
  const [sections, setSections] = useState([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionsError, setSectionsError] = useState(""); // ✅ faltaba
  const [toolsWelcomeHeadline, setToolsWelcomeHeadline] = useState("");
const [toolsWelcomeSubline, setToolsWelcomeSubline] = useState("");

// ─────────────────────────────────────────────
// Load TOOLS welcome message from Netlify
// ─────────────────────────────────────────────
useEffect(() => {
  const loadToolsWelcome = async () => {
    try {
      // raw_3pm | soft_3pm | null
      const variant = "raw_3pm";

      const res = await fetch(
        `/.netlify/functions/get-tools-welcome?variant=${variant}`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setToolsWelcomeHeadline(
        data?.headline ||
          "Tools for when your brain is loud and patience is gone."
      );
      setToolsWelcomeSubline(
        data?.subline ||
          "Nothing here will fix everything. That’s not the job."
      );
    } catch (err) {
      console.error("Failed to load tools welcome:", err);

      // fallback seguro 3PM
      setToolsWelcomeHeadline(
        "You don’t need motivation. You need traction."
      );
      setToolsWelcomeSubline(
        "Pick one thing. Let the rest wait."
      );
    }
  };

  loadToolsWelcome();
}, []);


  
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
  

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Hero compacto */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex items-start gap-3">
  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 border border-cyan-400/60">
    <Hammer size={18} className="text-cyan-300" />
  </div>

  <div className="space-y-1">
    <h2 className="text-sm font-semibold leading-snug">
      {toolsWelcomeHeadline}
    </h2>

    {toolsWelcomeSubline && (
      <p className="text-[12px] text-slate-300 leading-snug">
        {toolsWelcomeSubline}
      </p>
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



      <BottomNav />
    </div>
  );
}
