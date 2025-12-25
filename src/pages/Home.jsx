// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChessQueen,
  ChessKing,
  Medal,
  Sparkles,
  Flame,
  ChevronUp,
  ChevronDown,
  Target,
  Award, // Oldcomers
  CircleDot, // (no se usa aún)
  BookOpen,
  Users, // Group milestones
  Wrench, // Today’s tool
} from "lucide-react";
import HeaderGeneric from "../components/HeaderGeneric.jsx";
import Header3PM from "../components/Header3PM.jsx";
import NeonBadge from "../components/NeonBadge.jsx";
import { motion } from "framer-motion";
import { useTodayJFT } from "../hooks/useTodayJFT.js";
import { OLDCOMERS } from "../constants/oldcomers.js";
import { getCleanTime } from "../utils/getCleanTime.js";
import { getMilestoneDate } from "../utils/getMilestoneDate.js";
import { getDaysClean } from "../utils/getDaysClean.js";
import { getGratitudeStats } from "../utils/getGratitudeStats.js";
import { getPunchline } from "../utils/getPunchline.js";
import { getMilestonesStatus } from "../utils/getMilestonesStatus.js";
import { getMilestonePunchline } from "../utils/getMilestonePunchline.js";
import { getCleanTimePhrase } from "../utils/getCleanTimePhrase.js";
//import { loadGroupMembers } from "../constants/groupMembers.js";
import {
  getGroupUpcomingMilestones,
  getGroupAllNextMilestones,
} from "../utils/getGroupUpcomingMilestones.js";
import { getRandomToolPunchline } from "../utils/getToolPunchline.js";
import MilestoneIcon from "../components/MilestoneIcon.jsx";
import { useGuidedToolForToday } from "../hooks/useGuidedToolForToday.js";
import GuidedToolModal from "../components/GuidedToolModal.jsx";

const ICONS = {
  queen: ChessQueen,
  king: ChessKing,
  medal: Medal,
};
import BottomNav from "../components/BottomNav";
import { AnimatePresence } from "framer-motion";
import { getTimeUntilMeeting } from "../utils/getTimeUntilMeeting.js";

import { Video } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [soberDate, setSoberDate] = useState(null);
  const [daysClean, setDaysClean] = useState(null);

  // punchline antiguo, lo dejamos por si lo usamos en otros lugares más adelante
  const [punchline] = useState(() => getPunchline());
  const [cleanPhrase] = useState(() => getCleanTimePhrase());

  const { entry: jftEntry, loading: jftLoading, error: jftError } =
    useTodayJFT();

  const [isToolOpen, setIsToolOpen] = useState(true);
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isGratsOpen, setIsGratsOpen] = useState(false);
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [isOldOpen, setIsOldOpen] = useState(false);
  const [isJftOpen, setIsJftOpen] = useState(false);
  const [isToolGuideOpen, setIsToolGuideOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const [groupMembers, setGroupMembers] = useState([]);
const memberId = window.localStorage.getItem("na_memberId");
const isGuest = !memberId;

  const [gratitudeStats, setGratitudeStats] = useState({
    thisWeek: 0,
    lastText: null,
  });

  const [savedWhy, setSavedWhy] = useState("");
  const [showAllGroup, setShowAllGroup] = useState(false);

  const [toolDone, setToolDone] = useState(false);
  const [toolDoneLine, setToolDoneLine] = useState(null);

  // punchline del ÚLTIMO milestone alcanzado (async vía JSON)
  const [lastPunch, setLastPunch] = useState(null);

  // 🔹 mensajes de bienvenida rotativos desde Supabase
  const [welcomeHeadline, setWelcomeHeadline] = useState("Welcome back.");
  const [welcomeSubline, setWelcomeSubline] = useState("");
const [timeUntilMeeting, setTimeUntilMeeting] = useState("");
const [showHiLine] = useState(() => Math.random() < 0.35); // 35% de las veces

const displayName =
  userProfile?.name ||
  window.localStorage.getItem("na_memberName") ||
  "";


  // ─────────────────────────────────────────────
  // Cargar welcome message desde Netlify function
  // ─────────────────────────────────────────────

  // ─────────────────────────────────────────────
// Welcome message (DB via Netlify function)
// ─────────────────────────────────────────────
useEffect(() => {
  const loadWelcome = async () => {
    try {
      const groupId = window.localStorage.getItem("na_groupId");

      const url = groupId
        ? `/.netlify/functions/get-welcome?groupId=${encodeURIComponent(groupId)}`
        : "/.netlify/functions/get-welcome";

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      setWelcomeHeadline(
        data?.headline || "Welcome back. Again. That’s how recovery works."
      );
      setWelcomeSubline(
        data?.subline || "The server is hungover, but you still logged in. Bold move."
      );
    } catch (err) {
      console.error("Failed to load welcome message:", err);

      // fallback local
      setWelcomeHeadline("Welcome back. If you relapsed, you still get to be here.");
      setWelcomeSubline("We don’t grade your days. We just keep you company in them.");
    }
  };

  loadWelcome();
}, []);

useEffect(() => {
  (async () => {
    // 1) Clean date from localStorage
    let storedSoberDate = null;
    try {
      const stored = window.localStorage.getItem("na_soberDate");
      if (stored) {
        storedSoberDate = stored;
        setSoberDate(stored);
        setDaysClean(getDaysClean(stored));
      }
    } catch {
      // ignore
    }

    // 2) User profile (local)
    try {
      const rawProfile = window.localStorage.getItem("na_userProfile");
      if (rawProfile) setUserProfile(JSON.parse(rawProfile));
    } catch (err) {
      console.error("User profile load error:", err);
    }

    // 3) Try to read sober_date from DB (if we have memberId)
    try {
      const memberId = window.localStorage.getItem("na_memberId");

      if (memberId) {
        const res = await fetch("/.netlify/functions/get-member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId }), // ✅ uuid (NO Number)
        });

        if (!res.ok) {
          console.warn("Failed to load member from DB:", res.status);
        } else {
          const data = await res.json();
          if (data && data.sober_date) {
            const dbDate = String(data.sober_date).slice(0, 10);

            if (!storedSoberDate || storedSoberDate !== dbDate) {
              window.localStorage.setItem("na_soberDate", dbDate);
              setSoberDate(dbDate);
              setDaysClean(getDaysClean(dbDate));
            }
          }
        }
      }
    } catch (err) {
      console.warn("Error fetching sober date from DB:", err);
    }

    // 4) Group members (DB)
    try {
      const groupId = window.localStorage.getItem("na_groupId");

      if (groupId) {
        const res = await fetch("/.netlify/functions/get-group-members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.warn("Failed to load group members from DB:", data);
          setGroupMembers([]);
        } else {
          // normalize for existing utils expecting { name, soberDate }
          const normalized = (data.members || []).map((m) => ({
            id: m.id,
            name: m.display_name,
            soberDate: m.sober_date, // can be null
            role: m.role,
          }));

          setGroupMembers(normalized);
        }
      } else {
        setGroupMembers([]);
      }
    } catch (err) {
      console.warn("Group members DB fetch error:", err);
      setGroupMembers([]);
    }

    // 5) My Why
    try {
      const w = window.localStorage.getItem("na_myWhy");
      if (w) setSavedWhy(w);
    } catch {
      // ignore
    }

    // 6) Gratitudes
    try {
      const stats = getGratitudeStats();
      if (stats) setGratitudeStats(stats);
    } catch {
      // ignore
    }

    // 7) Today’s tool done?
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
  })();
}, []);


  const hasSoberDate = Boolean(soberDate) && daysClean !== null;

  // TODAY'S TOOL – usando hook + JSON
  const {
    tool: todaysTool,
    index: todaysToolIndex,
    allTools: allGuidedTools,
    loading: toolLoading,
    error: toolError,
  } = useGuidedToolForToday({ hasSoberDate, daysClean });

  const todaysToolTitle =
    todaysTool?.title ||
    (toolLoading ? "Today's tool is loading..." : "No tool available today");

  const { reached: reachedMilestones, next: nextMilestone } =
    getMilestonesStatus(daysClean);

  // cargar punchline async cuando cambien los milestones alcanzados
  useEffect(() => {
    if (!reachedMilestones || reachedMilestones.length === 0) {
      setLastPunch(null);
      return;
    }

    const last = reachedMilestones[reachedMilestones.length - 1];
    let cancelled = false;

    getMilestonePunchline(last.id).then((text) => {
      if (!cancelled) setLastPunch(text);
    });

    return () => {
      cancelled = true;
    };
  }, [reachedMilestones]);
useEffect(() => {
  function update() {
    setTimeUntilMeeting(getTimeUntilMeeting());
  }

  update(); // primera vez
  const id = setInterval(update, 30 * 1000); // cada 30s
  return () => clearInterval(id);
}, []);



  // Fecha bonita “Since Nov 23, 2025”
  const cleanDateLabel =
    soberDate && hasSoberDate
      ? (() => {
          const [year, month, day] = soberDate.split("-");
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const monthIndex = Number(month) - 1;
          return `${monthNames[monthIndex]} ${Number(day)}, ${year}`;
        })()
      : "";

  const groupMilestones = getGroupUpcomingMilestones(groupMembers, 7);
  const allNextMilestones = getGroupAllNextMilestones(groupMembers);

  const lastGratitude = gratitudeStats.lastText;

  // guard / auto-register member
  useEffect(() => {
  const profileRaw = window.localStorage.getItem("na_userProfile");
  const memberId = window.localStorage.getItem("na_memberId");

  console.log("Guard check → profile:", profileRaw, "memberId:", memberId);

  // If no profile and no memberId -> go login
  if (!profileRaw && !memberId) {
    navigate("/login", { replace: true });
    return;
  }

  // If profile exists but no memberId -> self-register
  if (profileRaw && !memberId) {
    const profile = JSON.parse(profileRaw);

    const groupCode =
      profile?.groupCode ||
      window.localStorage.getItem("na_groupCode") ||
      "3PM";

    (async () => {
      try {
        const res = await fetch("/.netlify/functions/members-self-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            groupCode,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          console.warn("Auto self-register failed:", data);
          return;
        }

        // save uuid ids
        if (data?.member?.id) {
          window.localStorage.setItem("na_memberId", data.member.id);
          window.localStorage.setItem(
            "na_memberName",
            data.member.display_name || profile.name
          );
          console.log("Auto-saved na_memberId:", data.member.id);
        }

        if (data?.group?.id) {
          window.localStorage.setItem("na_groupId", data.group.id);
          window.localStorage.setItem("na_groupCode", data.group.code || groupCode);
        }
      } catch (err) {
        console.warn("Error calling members-self-register (auto):", err);
      }
    })();
  }
}, [navigate]);


  function handleToggleToolDone() {
    const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const doneKey = `na_toolDone_${todayKey}`;
    const punchKey = `na_toolDoneLine_${todayKey}`;

    setToolDone((prev) => {
      const next = !prev;

      try {
        if (next) {
          window.localStorage.setItem(doneKey, "1");

          // 1) Intentar sacar punchline desde la tool de hoy (DB)
          let line = "";
          if (
            todaysTool &&
            Array.isArray(todaysTool.punchlines) &&
            todaysTool.punchlines.length > 0
          ) {
            const i = Math.floor(Math.random() * todaysTool.punchlines.length);
            line = todaysTool.punchlines[i];
          } else {
            // 2) Fallback: lista vieja de punchlines genéricos
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

  const hasGroup = Boolean(userProfile?.groupCode);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Hero premium con welcome rotativo */}
{/* Hero compacto */}
<section className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3 flex items-start gap-3">
  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/80 border border-cyan-400/60">
    <Sparkles size={18} className="text-cyan-300" />
  </div>

  <div className="space-y-1">
    <h2 className="text-sm font-semibold leading-snug">
      {welcomeHeadline}
    </h2>
{welcomeSubline && (
  <p className="text-[12px] text-slate-300 leading-snug">
    {welcomeSubline}
  </p>
)}

{displayName && showHiLine && (
  <p className="text-[11px] text-slate-500">
    Hi {displayName}. However yesterday went, you still made it here.
  </p>
)}


  </div>
</section>
{/* NEXT MEETING — premium block */}
<section className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-lg shadow-black/30">
  <div className="flex items-center justify-between gap-3">
    {/* Left side: text */}
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
        Next meeting
      </p>

      <p className="text-sm font-medium text-slate-200 mt-1">
        {timeUntilMeeting}
      </p>

      <p className="text-[11px] text-slate-400 mt-0.5">
        3PM Homegroup • Daily
      </p>
    </div>

    {/* Right side: pill-style button (match app style) */}
    <a
      href="https://zoom.us/whatever"
      target="_blank"
      rel="noreferrer"
      className="shrink-0 inline-flex items-center gap-1 rounded-full border border-cyan-400/80 
                 bg-slate-950/70 px-3 py-1.5 text-[11px] font-medium text-cyan-100 
                 hover:bg-cyan-400/10 hover:border-cyan-300 transition-colors"
    >
      <Video size={14} className="text-cyan-200" />
      <span>Join Zoom</span>
    </a>
  </div>
</section>




{/* Badge + status — ahora más premium */}
{/* Badge + status — ahora más premium */}
<section>
  {hasSoberDate ? (
    <div className="relative">
      {/* glow fuerte detrás de la badge */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-sky-400/10 to-purple-500/25 blur-xl opacity-70 pointer-events-none" />

      {/* tarjeta principal */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-5 py-5 shadow-xl shadow-black/40">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400 mb-1">
          <span>Clean badge</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/70 border border-slate-700 text-slate-300">
            {daysClean} day{daysClean === 1 ? "" : "s"} in
          </span>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <div className="flex items-center justify-center">
            <NeonBadge num={daysClean} />
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
              Days clean
            </span>
            <span className="text-[11px] text-slate-300 mt-1">
              This is how long you&apos;ve been annoying your addiction on purpose.
            </span>
            {cleanDateLabel && (
              <span className="text-[10px] text-slate-500 mt-1">
                Since {cleanDateLabel}. Your old dealer is bored.
              </span>
            )}
          </div>
        </div>

        {/* pill con days to next milestone (usando el mismo nextMilestone) */}
        {nextMilestone && (
          <div className="flex justify-end mt-3">
            <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-0.5 text-[10px] text-slate-400">
              Next milestone: {nextMilestone.label}
              <span className="ml-1 text-slate-500">
                ({nextMilestone.days - daysClean} day
                {nextMilestone.days - daysClean === 1 ? "" : "s"} left)
              </span>
            </span>
          </div>
        )}

        <Link
          to="/sober-date"
          className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 mt-3"
        >
          Change date
        </Link>
      </div>
    </div>
  ) : (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/80 px-5 py-4 space-y-2">
      <p className="text-sm text-slate-200">
        Set your clean date so we can start counting the days you
        didn&apos;t self-destruct on purpose.
      </p>

      <Link
        to="/sober-date"
        className="inline-flex mt-2 text-xs font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
      >
        Set clean date
      </Link>
    </div>
  )}
</section>


{/* TODAY'S TOOL — versión premium con micro-animación */}
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
          <Wrench size={11} className="text-cyan-300" />
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


        

        {/* JFT – Premium teaser (sin CTA) */}
{/* JFT – Premium teaser con fecha + link suave */}
<section className="pt-2">
  <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-4 shadow-lg shadow-black/30">

    {/* Glows decorativos */}
    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-2xl" />
    <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-sky-400/10 blur-xl" />

    {/* Header con fecha */}
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <BookOpen size={14} className="text-cyan-300" />
        <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
          Just for Today
        </span>
      </div>

      {/* pill de fecha solo si hay entrada */}
      {!jftLoading && !jftError && jftEntry && (
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400">
          {String(jftEntry.month).padStart(2, "0")}/
          {String(jftEntry.day).padStart(2, "0")}
        </span>
      )}
    </div>

    {/* Estados de carga / error */}
    {jftLoading && (
      <p className="text-[11px] text-slate-500 italic">Loading…</p>
    )}

    {jftError && (
      <p className="text-[11px] text-rose-300">
        Couldn&apos;t load today&apos;s meditation.
      </p>
    )}

    {/* Contenido cuando sí hay entrada */}
    {!jftLoading && !jftError && jftEntry && (
      <>
        {/* Título del día */}
        <p className="text-sm font-medium text-slate-200 leading-snug line-clamp-1">
          {jftEntry.title}
        </p>

        {/* Punchline corta */}
        {Array.isArray(jftEntry.punchlines) &&
          jftEntry.punchlines.length > 0 && (
            <p className="text-[11px] text-cyan-300 italic mt-1 line-clamp-1">
              “{
                jftEntry.punchlines[
                  Math.floor(Math.random() * jftEntry.punchlines.length)
                ]
              }”
            </p>
          )}

        {/* CTA muy discreto */}
        <div className="pt-2 flex justify-end">
          <Link
            to="/jft" // cámbialo a "/readings" cuando tengas esa página
            className="text-[10px] text-slate-400 hover:text-cyan-300 underline underline-offset-4"
          >
            Read more
          </Link>
        </div>
      </>
    )}

    {/* Sin entrada */}
    {!jftLoading && !jftError && !jftEntry && (
      <p className="text-[11px] text-slate-500">No entry for today.</p>
    )}
  </div>
</section>



          {/* BLOQUES INFERIORES */}
          <section className="space-y-4 pt-2">
            {/* YOUR MILESTONES */}
            {hasSoberDate && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsMilestonesOpen((p) => !p)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
                >
                  <div className="flex items-center gap-2">
                    <Target size={13} className="text-cyan-400" />
                    <span>Your milestones</span>
                  </div>

                  {isMilestonesOpen ? (
                    <ChevronUp size={14} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400" />
                  )}
                </button>

                {isMilestonesOpen && (
                  <motion.div
                    key="my-milestones-content"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="space-y-2 pt-1"
                  >
                    {reachedMilestones.length === 0 ? (
                      <p className="text-[11px] text-slate-500">
                        Your first milestone is the white chip (24 hours).
                        You&apos;re closer than you think.
                      </p>
                    ) : (
                      <>
                        <ul className="space-y-1 text-sm text-slate-200">
                          {reachedMilestones.map((m) => {
                            const isTodayMilestone = m.days === daysClean;

                            return (
                              <li
                                key={m.id}
                                className="flex justify-between"
                              >
                                <span className="flex items-center gap-1.5">
                                  <MilestoneIcon
                                    milestone={m}
                                    isToday={isTodayMilestone}
                                  />
                                  <span>{m.label}</span>
                                </span>

                                <span className="text-slate-400">
                                  {getMilestoneDate(soberDate, m.days)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>

                        {lastPunch && (
                          <p className="text-[11px] text-cyan-300 italic pt-1">
                            “{lastPunch}”
                          </p>
                        )}
                      </>
                    )}

                    {nextMilestone && (
                      <p className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                        Next:
                        <MilestoneIcon milestone={nextMilestone} />
                        {nextMilestone.label} •{" "}
                        {nextMilestone.days - daysClean} day
                        {nextMilestone.days - daysClean === 1 ? "" : "s"} to go.
                      </p>
                    )}

                    <p className="pt-1">
                      <Link
                        to="/chips"
                        className="text-[11px] text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                      >
                        What do the chips mean?
                      </Link>
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* GROUP MILESTONES */}
            {groupMilestones.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsGroupOpen((p) => !p)}
                  className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
                >
                  <div className="flex items-center gap-2">
                    <Users size={13} className="text-cyan-400" />
                    <span>Group milestones this week</span>
                  </div>

                  {isGroupOpen ? (
                    <ChevronUp size={14} className="text-slate-400" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400" />
                  )}
                </button>

                {isGroupOpen && (
                  <div className="space-y-2 pt-1">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      your homegroup
                    </span>

                    <ul className="space-y-1 text-sm text-slate-200 mt-1">
                      {groupMilestones.map(
                        ({ member, milestone, daysToGo }) => (
                          <li
                            key={member.name + milestone.id}
                            className="flex gap-2"
                          >
                            <span
                              className={`text-base mt-[2px] ${
                                daysToGo === 0 ? "icon-shimmer" : ""
                              }`}
                            >
                              <MilestoneIcon milestone={milestone} />
                            </span>

                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  {member.name}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {milestone.label}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-400">
                                {daysToGo === 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/60 text-[10px] font-semibold icon-shimmer">
                                    <span>🎉</span>
                                    <span>today</span>
                                  </span>
                                ) : (
                                  <>
                                    <span>
                                      {daysToGo} day
                                      {daysToGo === 1 ? "" : "s"}
                                    </span>{" "}
                                    to go
                                  </>
                                )}
                              </p>
                            </div>
                          </li>
                        )
                      )}
                    </ul>

                    <button
                      type="button"
                      onClick={() => setShowAllGroup((p) => !p)}
                      className="mt-3 w-full text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-2 transition-colors"
                    >
                      {showAllGroup
                        ? "Hide full milestone tracker"
                        : "View all upcoming milestones"}
                    </button>

                    {showAllGroup && (
                      <div className="mt-3 border-t border-slate-800 pt-3 space-y-2">
                        <h4 className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                          Everyone&apos;s next chip
                        </h4>

                        <ul className="space-y-1 text-sm text-slate-200">
                          {allNextMilestones.map(
                            ({ member, milestone, daysToGo }) => (
                              <li
                                key={"all-" + member.name + milestone.id}
                                className="flex gap-2"
                              >
                                <span
                                  className={`text-base mt-[2px] ${
                                    daysToGo === 0 ? "icon-shimmer" : ""
                                  }`}
                                >
                                  <MilestoneIcon milestone={milestone} />
                                </span>

                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {member.name}
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                      {milestone.label}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-slate-400">
                                    {daysToGo === 0 ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/60 text-[10px] font-semibold icon-shimmer">
                                        <span>🎉</span>
                                        <span>today</span>
                                      </span>
                                    ) : (
                                      <>
                                        {daysToGo} day
                                        {daysToGo === 1 ? "" : "s"} to go
                                      </>
                                    )}
                                  </p>
                                </div>
                              </li>
                            )
                          )}
                        </ul>

                        <p className="text-[10px] text-slate-500">
                          Different milestones. Same urge to bolt. Still showed
                          up at 3PM.
                        </p>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500">
                      This isn&apos;t a competition. It&apos;s proof that people
                      like you are still doing this.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* GRATITUDES */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
              <button
                type="button"
                onClick={() => setIsGratsOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan-300" />
                  <span>Gratitudes</span>
                </div>

                {isGratsOpen ? (
                  <ChevronUp size={14} className="text-slate-400" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400" />
                )}
              </button>

              {isGratsOpen && (
                <div className="border-t border-slate-800 pt-2 space-y-2">
                  {gratitudeStats?.thisWeek > 0 && (
                    <p className="text-[10px] text-slate-500 mb-1">
                      You’ve added {gratitudeStats.thisWeek} gratitude
                      {gratitudeStats.thisWeek === 1 ? "" : "s"} this week.
                    </p>
                  )}

                  {lastGratitude ? (
                    <div className="border-l border-cyan-400/40 pl-3">
                      <p className="text-[11px] text-slate-400 mb-1">
                        Your latest gratitude:
                      </p>
                      <p className="text-sm text-slate-200 leading-snug">
                        “{lastGratitude}”
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-300">
                      Start with one sentence. It doesn&apos;t have to be deep,
                      just honest.
                    </p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Link
                      to="/gratitudes/new"
                      className="flex-1 text-[11px] text-center border border-cyan-400 text-cyan-100 rounded-lg py-1.5 hover:bg-cyan-400/10 transition-colors"
                    >
                      Add gratitude
                    </Link>
                    <Link
                      to="/gratitudes"
                      className="flex-1 text-[11px] text-center border border-slate-600 text-slate-200 rounded-lg py-1.5 hover:bg-slate-800/80 transition-colors"
                    >
                      View all
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* MY WHY */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
              <button
                type="button"
                onClick={() => setIsWhyOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <Flame size={14} className="text-cyan-300" />
                  <span>My why</span>
                </div>

                {isWhyOpen ? (
                  <ChevronUp size={14} className="text-slate-400" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400" />
                )}
              </button>

              {isWhyOpen && (
                <div className="border-t border-slate-800 pt-2 space-y-2">
                  <div className="border-l border-cyan-400/40 pl-3">
                    {savedWhy ? (
                      <>
                        <p className="text-[11px] text-slate-400 mb-1">
                          The sentence you don&apos;t want to forget:
                        </p>
                        <p className="text-sm text-slate-200 italic leading-snug">
                          “{savedWhy}”
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-300">
                        Save one line future you can read when everything in
                        your head says &quot;use&quot;.
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <Link
                      to="/my-why"
                      className="text-[11px] text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
                    >
                      {savedWhy ? "Change my why" : "Write my why"}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* OLDCOMERS */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
              <button
                type="button"
                onClick={() => setIsOldOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <Award size={13} className="text-amber-300" />
                  <span>The Oldcomers</span>
                </div>

                {isOldOpen ? (
                  <ChevronUp size={14} className="text-slate-400" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400" />
                )}
              </button>

              {isOldOpen && (
                <>
                  <ul className="space-y-2 text-sm text-slate-200 pt-1">
                    {OLDCOMERS.map((person) => {
                      const Icon = ICONS[person.icon] || Medal;

                      return (
                        <li
                          key={person.name}
                          className="flex items-center justify-between bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            {Icon && (
                              <Icon
                                size={16}
                                className="text-cyan-300 icon-shimmer"
                              />
                            )}
                            <span>{person.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {getCleanTime(person.soberDate)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <p className="text-[10px] text-slate-500 pt-1">
                    They kept coming. That&apos;s all anyone ever did.
                  </p>
                </>
              )}
            </div>
          </section>

          {/* Modal de herramienta guiada */}
          <GuidedToolModal
            open={isToolGuideOpen}
            onClose={() => setIsToolGuideOpen(false)}
            tool={todaysTool}
          />

          {/* Boss access (super stealth) */}
          <Link
            to="/boss"
            className="text-[10px] text-slate-700 hover:text-cyan-400 underline underline-offset-2 block text-right"
          >
            system / root / backdoor / control panel
          </Link>
        </div>
      </main>
          <BottomNav />
    </div>
  );
}
