// src/components/MenuOverlay.jsx
import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MenuOverlay({ onClose }) {
  const navigate = useNavigate();

  function go(path) {
    navigate(path);
    onClose(); // 👈 cierra el menú y te deja en esa pantalla
  }

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex justify-center">
      <div className="relative w-full max-w-md bg-slate-950 border-l border-slate-800 px-4 pt-4 pb-6 overflow-y-auto">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-1 rounded-full border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/70 transition-colors"
        >
          <X size={16} />
        </button>

        <h1 className="text-sm font-semibold text-slate-100 mb-4">
          3PM menu
        </h1>

        {/* HOME */}
        <section className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => go("/")}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-left hover:border-cyan-400 hover:text-cyan-100 transition-colors"
          >
            Home
            <p className="text-[11px] text-slate-400">
              Back to your clean badge and milestones.
            </p>
          </button>
        </section>

        {/* Daily stuff */}
        <section className="space-y-2 mb-4">
          <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Daily stuff
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => go("/gratitudes/new")}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-left hover:border-cyan-400 hover:text-cyan-100 transition-colors"
            >
              Add a gratitude
              <p className="text-[11px] text-slate-400">
                One tiny thing that didn&apos;t implode.
              </p>
            </button>

            <button
              type="button"
              onClick={() => go("/gratitudes")}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-left hover:border-cyan-400 hover:text-cyan-100 transition-colors"
            >
              View all gratitudes
              <p className="text-[11px] text-slate-400">
                See your week, not your defects.
              </p>
            </button>
          </div>
        </section>

        {/* Milestones & tools */}
        <section className="space-y-2">
          <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
            Milestones & tools
          </h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => go("/chips")}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-left hover:border-cyan-400 hover:text-cyan-100 transition-colors"
            >
              What do the chips mean?
              <p className="text-[11px] text-slate-400">
                NA tags, translated into human.
              </p>
            </button>

            <button
              type="button"
              onClick={() => go("/my-why")}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-sm text-left hover:border-cyan-400 hover:text-cyan-100 transition-colors"
            >
              My why
              <p className="text-[11px] text-slate-400">
                Save the one sentence that keeps you clean.
              </p>
            </button>

            <div className="block bg-slate-900/60 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-500">
              Today&apos;s tool (coming soon)
              <p className="text-[11px] text-slate-500">
                One tiny action for messy days.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
