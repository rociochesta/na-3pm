// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
import HeaderGeneric from "../components/HeaderGeneric.jsx";
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
import { loadGroupMembers } from "../constants/groupMembers.js";
import {
  getGroupUpcomingMilestones,
  getGroupAllNextMilestones,
} from "../utils/getGroupUpcomingMilestones.js";
import Header3PM from "../components/Header3PM.jsx";
import { getRandomToolPunchline } from "../utils/getToolPunchline.js";
import MilestoneIcon from "../components/MilestoneIcon.jsx";
import { useGuidedToolForToday } from "../hooks/useGuidedToolForToday.js";
import GuidedToolModal from "../components/GuidedToolModal.jsx";

const ICONS = {
  queen: ChessQueen,
  king: ChessKing,
  medal: Medal,
};

export default function Home() {
    const navigate = useNavigate();
  const [soberDate, setSoberDate] = useState(null);
  const [daysClean, setDaysClean] = useState(null);
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

  const [gratitudeStats, setGratitudeStats] = useState({
    thisWeek: 0,
    lastText: null,
  });

  const [savedWhy, setSavedWhy] = useState("");
  const [showAllGroup, setShowAllGroup] = useState(false);

  const [toolDone, setToolDone] = useState(false);
  const [toolDoneLine, setToolDoneLine] = useState(null);

  // 🔹 punchline del ÚLTIMO milestone alcanzado (async vía JSON)
  const [lastPunch, setLastPunch] = useState(null);

  useEffect(() => {
    (async () => {
      // ── 1) Clean date from localStorage
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

      // ── 2) User profile (local)
      try {
        const rawProfile = window.localStorage.getItem("na_userProfile");
        if (rawProfile) {
          setUserProfile(JSON.parse(rawProfile));
        }
      } catch (err) {
        console.error("User profile load error:", err);
      }

      // ── 3) Try to read sober_date from DB (if we have memberId)
      try {
        const memberId = window.localStorage.getItem("na_memberId");

        if (memberId) {
          const res = await fetch("/.netlify/functions/get-member", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: Number(memberId) }),
          });

          if (!res.ok) {
            console.warn("Failed to load member from DB:", res.status);
          } else {
            const data = await res.json();
            if (data && data.sober_date) {
              // Supabase returns full timestamp; keep YYYY-MM-DD
              const dbDate = String(data.sober_date).slice(0, 10);

              // If local is empty or different → sync from DB
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

      // ── 4) Group members (JSON público)
      loadGroupMembers()
        .then((data) => setGroupMembers(data))
        .catch((err) => console.error("Group members load error:", err));

      // ── 5) My Why
      const w = window.localStorage.getItem("na_myWhy");
      if (w) setSavedWhy(w);

      // ── 6) Gratitudes
      const stats = getGratitudeStats();
      if (stats) setGratitudeStats(stats);

      // ── 7) Today’s tool done?
      const todayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const doneKey = `na_toolDone_${todayKey}`;
      const punchKey = `na_toolDoneLine_${todayKey}`;

      const storedDone = window.localStorage.getItem(doneKey);
      const storedLine = window.localStorage.getItem(punchKey);

      setToolDone(storedDone === "1");
      if (storedLine) setToolDoneLine(storedLine);
    })();
  }, []);


  const hasSoberDate = Boolean(soberDate) && daysClean !== null;

  // ─────────────────────────────────────────────
  // TODAY'S TOOL – usando hook + JSON
  // ─────────────────────────────────────────────
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

  // 🔹 cargar punchline async cuando cambien los milestones alcanzados
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
 
useEffect(() => {
  const profileRaw = window.localStorage.getItem("na_userProfile");
  const memberId = window.localStorage.getItem("na_memberId");

  console.log("Guard check → profile:", profileRaw, "memberId:", memberId);

  // Si no hay nada de nada → mandar a login
  if (!profileRaw && !memberId) {
    navigate("/login", { replace: true });
    return;
  }

  // Si HAY perfil pero NO memberId → intentar crearlo en la BD
  if (profileRaw && !memberId) {
    const profile = JSON.parse(profileRaw);

    (async () => {
      try {
        const res = await fetch("/.netlify/functions/register-member", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profile.name,
            groupId: 1, // 3PM
          }),
        });

        const text = await res.text();
        if (!res.ok) {
          console.warn("Auto-register member failed:", res.status, text);
          return;
        }

        let data = null;
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }

        if (data && data.id) {
          window.localStorage.setItem("na_memberId", String(data.id));
          console.log("Auto-saved na_memberId:", data.id);
        } else {
          console.warn("register-member (auto) sin id en respuesta:", text);
        }
      } catch (err) {
        console.warn("Error calling register-member (auto):", err);
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
          const line = getRandomToolPunchline();
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
      {/* Top bar */}

   <Header3PM />



      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Hero text */}
<section className="space-y-2">
  <h2 className="text-2xl font-semibold tracking-tight">
    YOU&apos;RE STILL CLEAN TODAY.
  </h2>
  <p className="text-sm text-slate-300">{punchline}</p>

  {userProfile?.name && (
    <p className="text-[11px] text-slate-400">
      Hi {userProfile.name}. This is your 3PM dashboard.
    </p>
  )}
</section>

          {/* Badge + status */}
          <section>
            {hasSoberDate ? (
              <div className="relative">
                {/* glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-sky-400/10 to-purple-500/20 blur-lg opacity-60 pointer-events-none" />
                {/* main card */}
                <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl px-5 py-5 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    <span>Clean badge</span>
                  </div>

                  <div className="mt-1 flex items-center gap-3">
                    <div className="flex items-center justify-center">
                      <NeonBadge num={daysClean} />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                        Days clean
                      </span>
                      <span className="text-[11px] text-slate-400 mt-1">
                        You&apos;re still clean today.
                      </span>
                      {cleanDateLabel && (
                        <span className="text-[10px] text-slate-500 mt-1">
                          Since {cleanDateLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/sober-date"
                    className="inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-cyan-300 underline underline-offset-2 mt-1"
                  >
                    Change date
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl px-5 py-4">
                <p className="text-sm text-slate-200">
                  Set your clean date to start tracking your time.
                </p>

                <Link
                  to="/sober-date"
                  className="inline-flex mt-3 text-xs font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-4"
                >
                  Set clean date
                </Link>
              </div>
            )}
          </section>

          {/* TODAY'S TOOL (card estándar) */}
          <section>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
              <button
                type="button"
                onClick={() => setIsToolOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <Wrench size={13} className="text-cyan-400" />
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
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-2 pt-1"
                >
                  <p className="text-[11px] text-slate-400">
                    One tiny action for messy days.
                  </p>

                  {/* estados del hook: loading / error / ok */}
                  {toolLoading ? (
                    <p className="text-[11px] text-slate-500 italic">
                      Loading today&apos;s tool...
                    </p>
                  ) : toolError ? (
                    <p className="text-[11px] text-rose-400">
                      Couldn&apos;t load today&apos;s tool.
                    </p>
                  ) : (
                    <>
                      {/* título de la tool, ahora desde el objeto */}
                      <p
                        className={`text-sm leading-snug ${
                          toolDone ? "text-cyan-200" : "text-slate-200"
                        }`}
                      >
                        {todaysToolTitle}
                      </p>

                      {/* botón I did this + punchline cuando está done */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <p className="text-[10px] text-cyan-400 italic min-h-[1.25rem]">
                          {toolDone && toolDoneLine ? toolDoneLine : ""}
                        </p>

                        <button
                          type="button"
                          onClick={handleToggleToolDone}
                          className={`ml-auto inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors
                  ${
                    toolDone
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                      : "border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-200"
                  }`}
                        >
                          <span className="text-[11px]">
                            {toolDone ? "✓" : "○"}
                          </span>
                          <span>
                            {toolDone ? "Done for today" : "I did this"}
                          </span>
                        </button>
                      </div>

                      {/* link para abrir el modal guiado (solo si hay tool) */}
                      {todaysTool && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => setIsToolGuideOpen(true)}
                            className="text-[10px] text-slate-500 hover:text-cyan-300 underline underline-offset-2"
                          >
                            How do I do this?
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </section>

          {/* 🔹 Just For Today block */}
          <section className="space-y-2 pt-2">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-3 space-y-2">
              {/* Header button */}
              <button
                type="button"
                onClick={() => setIsJftOpen((p) => !p)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-cyan-300" />
                  <span>Just for Today</span>
                </div>

                {isJftOpen ? (
                  <ChevronUp size={14} className="text-slate-400" />
                ) : (
                  <ChevronDown size={14} className="text-slate-400" />
                )}
              </button>

              {/* Content */}
              {isJftOpen && (
                <div className="space-y-2 mt-1">
                  {jftLoading && (
                    <p className="text-[11px] text-slate-500">
                      Loading today&apos;s meditation…
                    </p>
                  )}

                  {jftError && (
                    <p className="text-[11px] text-rose-300">
                      Couldn&apos;t load JFT summaries. Check your JSON on
                      Netlify.
                    </p>
                  )}

                  {!jftLoading && !jftError && !jftEntry && (
                    <p className="text-[11px] text-slate-500">
                      No JFT summary set for today yet.
                    </p>
                  )}

                  {!jftLoading && jftEntry && (
                    <>
                      {/* Date */}
                      <p className="text-[10px] text-slate-500">
                        {String(jftEntry.month).padStart(2, "0")}/
                        {String(jftEntry.day).padStart(2, "0")}
                      </p>

                      {/* Title */}
                      <p className="text-sm text-slate-200 font-medium leading-snug">
                        {jftEntry.title}
                      </p>

                      {/* Punchline */}
                      {Array.isArray(jftEntry.punchlines) &&
                        jftEntry.punchlines.length > 0 && (
                          <p className="text-[11px] text-cyan-300 italic mt-1">
                            “
                            {
                              jftEntry.punchlines[
                                Math.floor(
                                  Math.random() * jftEntry.punchlines.length
                                )
                              ]
                            }
                            ”
                          </p>
                        )}

                      {/* CTA */}
                      <div className="flex flex-col gap-2 pt-2">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to="/jft"
                            className="inline-flex items-center gap-1 rounded-full border border-cyan-400 px-3 py-1 text-[10px] font-medium text-cyan-100 hover:bg-cyan-400/10 transition-colors"
                          >
                            Read summary
                          </Link>

                          <a
                            href="https://www.jftna.org/jft/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-slate-600 px-3 py-1 text-[10px] font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
                          >
                            Official JFT
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* BLOQUES INFERIORES — espaciado unificado */}
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
                      This isn&apos;t a competition. It&apos;s proof that
                      people like you are still doing this.
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
    </div>
  );
}
