// src/pages/Me.jsx
import React, { useEffect, useState } from "react";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { User, CalendarClock, Target, LogOut } from "lucide-react";

export default function MePage() {
  const [profile, setProfile] = useState(null);
  const [cleanDate, setCleanDate] = useState(null);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("na_userProfile"));
      setProfile(p || null);

      const sd = localStorage.getItem("na_soberDate");
      setCleanDate(sd || null);
    } catch {
      // ignore
    }
  }, []);

  const initial =
    profile?.display_name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-20">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-8 space-y-8">
          {/* Avatar + name card */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-6 shadow-xl shadow-black/30">
            <div className="pointer-events-none absolute -left-8 -top-10 h-28 w-28 rounded-full bg-cyan-500/20 blur-2xl" />
            <div className="pointer-events-none absolute -right-6 bottom-0 h-24 w-24 rounded-full bg-sky-400/15 blur-2xl" />

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-slate-950 border border-cyan-400/60 flex items-center justify-center text-cyan-300 text-lg font-semibold">
                {initial}
              </div>

              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                  Your profile
                </span>
                <span className="text-base font-medium text-slate-100">
                  {profile?.display_name || "Unnamed addict"}
                </span>
              </div>
            </div>
          </section>

          {/* Clean date info */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 shadow-md shadow-black/20 space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <CalendarClock size={16} className="text-cyan-300" />
              <span className="text-sm font-medium">Clean date</span>
            </div>

            {cleanDate ? (
              <p className="text-sm text-slate-400 pl-6">
                {cleanDate}
              </p>
            ) : (
              <p className="text-sm text-slate-500 pl-6">
                You haven’t set a clean date yet.
              </p>
            )}

            <a
              href="/sober-date"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-4 pl-6"
            >
              Change clean date
            </a>
          </section>

          {/* Group link */}
          <section className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-4 shadow-md shadow-black/20 space-y-2">
            <div className="flex items-center gap-2 text-slate-300">
              <Target size={16} className="text-cyan-300" />
              <span className="text-sm font-medium">Your homegroup</span>
            </div>

            <p className="text-sm text-slate-400 pl-6">3PM Homegroup</p>

            <a
              href="/group"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 underline underline-offset-4 pl-6"
            >
              Visit group page
            </a>
          </section>

          {/* Log out */}
          <section className="pt-2">
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("na_userProfile");
                localStorage.removeItem("na_memberId");
                window.location.href = "/login";
              }}
              className="flex items-center gap-2 text-sm text-red-300 hover:text-red-200 transition-colors"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
