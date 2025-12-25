// src/pages/Group.jsx
import React, { useEffect, useState } from "react";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";
import MilestoneIcon from "../components/MilestoneIcon.jsx";

import { UsersRound, CalendarClock, MapPin, Video, Users } from "lucide-react";

//import { loadGroupMembers } from "../constants/groupMembers.js";
import {
  getGroupUpcomingMilestones,
  getGroupAllNextMilestones,
} from "../utils/getGroupUpcomingMilestones.js";
import { getTimeUntilMeeting } from "../utils/getTimeUntilMeeting.js";
import { getMilestoneDate } from "../utils/getMilestoneDate.js";

export default function GroupPage() {
  const [groupMembers, setGroupMembers] = useState([]);
  const [timeUntilMeeting, setTimeUntilMeeting] = useState("");

  const [groupMilestones, setGroupMilestones] = useState([]);
  const [allNextMilestones, setAllNextMilestones] = useState([]);

  useEffect(() => {
  (async () => {
    try {
      const groupId = window.localStorage.getItem("na_groupId");
      if (!groupId) {
        console.warn("Group page: no na_groupId in localStorage");
        setGroupMembers([]);
        setGroupMilestones([]);
        setAllNextMilestones([]);
        return;
      }

      const res = await fetch("/.netlify/functions/get-group-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("get-group-members failed:", data);
        setGroupMembers([]);
        setGroupMilestones([]);
        setAllNextMilestones([]);
        return;
      }

      // Adapt DB shape -> old shape used by milestone utils
      const normalized = (data.members || []).map((m) => ({
        id: m.id,
        name: m.display_name,
        soberDate: m.sober_date, // could be null
        role: m.role,
      }));

      setGroupMembers(normalized);

      const upcoming = getGroupUpcomingMilestones(normalized, 7);
      const allNext = getGroupAllNextMilestones(normalized);

      setGroupMilestones(upcoming);
      setAllNextMilestones(allNext);
    } catch (err) {
      console.error("Group members load error (Group page):", err);
      setGroupMembers([]);
      setGroupMilestones([]);
      setAllNextMilestones([]);
    }
  })();
}, []);


  // actualizar contador de próxima reunión
  useEffect(() => {
    function updateCountdown() {
      try {
        const text = getTimeUntilMeeting();
        setTimeUntilMeeting(text);
      } catch (err) {
        console.error("getTimeUntilMeeting error:", err);
        setTimeUntilMeeting("");
      }
    }

    updateCountdown();
    const id = setInterval(updateCountdown, 60 * 1000); // cada minuto
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* HERO - INFO DEL GRUPO */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-5 shadow-xl shadow-black/40">
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-12 bottom-0 h-24 w-24 rounded-full bg-sky-400/15 blur-2xl" />

            <div className="relative flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 border border-cyan-400/70 shadow-inner shadow-black/50">
                <UsersRound size={20} className="text-cyan-300" />
              </div>

              <div className="space-y-1">
                <h1 className="text-lg font-semibold tracking-tight">
                  3PM Homegroup.
                </h1>
                <p className="text-sm text-slate-200">
                  A daily Zoom meeting for people who didn&apos;t think
                  they&apos;d live long enough to be &quot;regulars&quot;.
                </p>
                <p className="text-[11px] text-slate-400">
                  Show up messy. Cameras, off or on. We&apos;re not here for
                  posture, we&apos;re here to not use.
                </p>
              </div>
            </div>
          </section>

          {/* NEXT MEETING */}
          <section className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-lg shadow-black/30">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500 flex items-center gap-1.5">
                  <CalendarClock size={13} className="text-cyan-300" />
                  <span>Next meeting</span>
                </p>

                <p className="text-sm font-medium text-slate-200">
                  {timeUntilMeeting || "Calculating…"}
                </p>

                <p className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>Daily at 3PM (Edmonton)</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                    <MapPin size={11} />
                    Zoom only
                  </span>
                </p>
              </div>

              <a
                href="https://zoom.us" // TODO: poner el link real de Zoom
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-cyan-400 px-3 py-1.5 text-[11px] font-medium text-cyan-100 hover:bg-cyan-400/10 transition-colors"
              >
                <Video size={13} />
                <span>Join Zoom</span>
              </a>
            </div>
          </section>

          {/* GROUP MILESTONES THIS WEEK */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-lg shadow-black/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-cyan-300" />
                <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  Group milestones this week
                </h2>
              </div>
              <span className="text-[10px] text-slate-500">
                Your little cult of survival.
              </span>
            </div>

            {groupMilestones.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No chips this week yet. Don&apos;t worry, your turn to be
                uncomfortable will come.
              </p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-200 mt-1">
                {groupMilestones.map(({ member, milestone, daysToGo }) => (
                  <li
                    key={member.name + milestone.id}
                    className="flex gap-2 items-start"
                  >
                    <span
                      className={`text-base mt-[2px] ${
                        daysToGo === 0 ? "icon-shimmer" : ""
                      }`}
                    >
                      <MilestoneIcon milestone={milestone} />
                    </span>

                    <div className="flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="font-medium truncate">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {milestone.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {daysToGo === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/60 text-[10px] font-semibold icon-shimmer">
                            <span>🎉</span>
                            <span>today</span>
                          </span>
                        ) : (
                          <>
                            In {daysToGo} day
                            {daysToGo === 1 ? "" : "s"} —{" "}
                            {getMilestoneDate(member.soberDate, milestone.days)}
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-[10px] text-slate-500 pt-1">
              This isn&apos;t a scoreboard. It&apos;s proof that people with
              your brain chemistry can still collect plastic chips.
            </p>
          </section>

          {/* EVERYONE'S NEXT CHIP */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-4 shadow-lg shadow-black/30 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Everyone&apos;s next chip
              </h2>
              <span className="text-[10px] text-slate-500">
                Different numbers. Same disease.
              </span>
            </div>

            {allNextMilestones.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No data yet. The spreadsheet is probably offended.
              </p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-200 mt-1">
                {allNextMilestones.map(({ member, milestone, daysToGo }) => (
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
                      <div className="flex justify-between gap-2">
                        <span className="font-medium truncate">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {milestone.label}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {daysToGo === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/60 text-[10px] font-semibold icon-shimmer">
                            <span>🎉</span>
                            <span>today</span>
                          </span>
                        ) : (
                          <>
                            {daysToGo} day
                            {daysToGo === 1 ? "" : "s"} to go •{" "}
                            {getMilestoneDate(member.soberDate, milestone.days)}
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-[10px] text-slate-500 pt-1">
              You don&apos;t have to catch up. You just have to not vanish.
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
