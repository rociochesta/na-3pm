// src/pages/Menu.jsx
import React from "react";
import { Link } from "react-router-dom";
import Header3PM from "../components/Header3PM";

export default function Menu() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
  <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Daily stuff
            </h2>
            <div className="space-y-2">
              <Link
                to="/gratitudes/new"
                className="block bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm hover:border-cyan-400 hover:text-cyan-100 transition-colors"
              >
                Add a gratitude
                <p className="text-[11px] text-slate-400">
                  One tiny thing that didn&apos;t implode.
                </p>
              </Link>

              <Link
                to="/gratitudes"
                className="block bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm hover:border-cyan-400 hover:text-cyan-100 transition-colors"
              >
                View all gratitudes
                <p className="text-[11px] text-slate-400">
                  See your week, not your defects.
                </p>
              </Link>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
              Milestones & tools
            </h2>
            <div className="space-y-2">
              <Link
                to="/chips"
                className="block bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm hover:border-cyan-400 hover:text-cyan-100 transition-colors"
              >
                What do the chips mean?
                <p className="text-[11px] text-slate-400">
                  NA tags, translated into human.
                </p>
              </Link>

              {/* Placeholders for future screens */}
    <Link
  to="/my-why"
  className="block bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm hover:border-cyan-400 hover:text-cyan-100 transition-colors"
>
  My why
  <p className="text-[11px] text-slate-400">
    Save the one sentence that keeps you clean.
  </p>
</Link>

              <div className="block bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-500">
                Today&apos;s tool (coming soon)
                <p className="text-[11px] text-slate-500">
                  One tiny action for messy days.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
