// src/pages/Me.jsx
import React, { useEffect, useState } from "react";
import Header3PM from "../components/Header3PM";
import { Link } from "react-router-dom";
import { User, CalendarDays, UsersRound, LogOut } from "lucide-react";

export default function Me() {
  const [userProfile, setUserProfile] = useState(null);
  const [soberDate, setSoberDate] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("na_userProfile");
      if (raw) setUserProfile(JSON.parse(raw));
    } catch {}

    try {
      const sd = localStorage.getItem("na_soberDate");
      if (sd) setSoberDate(sd);
    } catch {}
  }, []);

  function handleLogout() {
    localStorage.removeItem("na_userProfile");
    localStorage.removeItem("na_memberId");
    window.location.href = "/login";
  }

  const cleanDateLabel =
    soberDate &&
    (() => {
      const [y, m, d] = soberDate.split("-");
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
      return `${monthNames[m - 1]} ${Number(d)}, ${y}`;
    })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-8">

          {/* USER SECTION */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/30">
            <div className="absolute -top-10 -right-10 h-24 w-24 bg-cyan-500/10 blur-3xl rounded-full" />

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-slate-900/90 border border-slate-700">
                <User size={22} className="text-cyan-300" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                  This is you. Allegedly.
                </p>
                <p className="text-lg font-semibold text-slate-200 mt-1">
                  {userProfile?.name || "Unnamed addict"}
                </p>
              </div>
            </div>
          </section>

          {/* CLEAN DATE */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-lg shadow-black/20 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
              <CalendarDays size={14} className="text-cyan-300" />
              <span>Clean date</span>
            </div>

            {cleanDateLabel ? (
              <p className="text-sm text-slate-300">
                You've been clean since{" "}
                <span className="text-cyan-300 font-medium">{cleanDateLabel}</span>.  
                Flex on your old habits a little.
              </p>
            ) : (
              <p className="text-sm text-slate-400">
                No clean date set. Bold choice.
              </p>
            )}

            <Link
              to="/sober-date"
              className="inline-flex text-[11px] text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
            >
              Edit clean date
            </Link>
          </section>

          {/* GROUP */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-lg shadow-black/20 space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-500">
              <UsersRound size={14} className="text-cyan-300" />
              <span>Your group</span>
            </div>

            <p className="text-sm text-slate-300">
              3PM Homegroup. The place where we pretend to have it together.
            </p>

            <Link
              to="/group"
              className="text-[11px] text-cyan-300 underline underline-offset-4 hover:text-cyan-200"
            >
              Visit group page
            </Link>
          </section>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-800 bg-slate-900/80 text-[12px] text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-colors"
          >
            <LogOut size={14} />
            Log out (go touch grass or something)
          </button>
        </div>
      </main>
    </div>
  );
}
