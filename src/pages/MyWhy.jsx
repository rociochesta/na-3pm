// src/pages/MyWhy.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header3PM from "../components/Header3PM";

export default function MyWhy() {
  const [savedWhy, setSavedWhy] = useState("");
  const [draft, setDraft] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // load from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("na_myWhy") || "";
      setSavedWhy(stored);
      setDraft(stored);
      // if nothing saved, start in edit mode
      if (!stored) setIsEditing(true);
    } catch {
      setSavedWhy("");
      setDraft("");
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    const clean = draft.trim();
    setSavedWhy(clean);
    try {
      if (clean) {
        window.localStorage.setItem("na_myWhy", clean);
      } else {
        window.localStorage.removeItem("na_myWhy");
      }
    } catch (err) {
      console.error("Error saving my why:", err);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(savedWhy);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
  <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-5">
          {/* intro */}
          <section className="space-y-2">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
              Anchor
            </p>
            <p className="text-sm text-slate-200">
              This isn&apos;t your life story. It&apos;s just one sentence that
              reminds you why staying clean matters to you.
            </p>
          </section>

          {/* card */}
          <section className="bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-[0.16em] text-slate-500">
                Your why right now
              </h2>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-[10px] px-2 py-1 border border-slate-700 rounded-full text-slate-300 hover:text-cyan-300 hover:border-cyan-300 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {/* view mode */}
            {!isEditing && savedWhy && (
              <p className="text-sm text-slate-100 italic whitespace-pre-wrap">
                “{savedWhy}”
              </p>
            )}

            {!isEditing && !savedWhy && (
              <p className="text-sm text-slate-400">
                You haven&apos;t written your why yet. It can be as simple as
                “I&apos;m tired of disappearing.”
              </p>
            )}

            {/* edit mode */}
            {isEditing && (
              <div className="space-y-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
                  placeholder={`Example: "I want a life where I don't have to apologize for existing."`}
                />

                <p className="text-[10px] text-slate-500">
                  One or two lines is enough. You can change this whenever you
                  need.
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 text-sm font-semibold tracking-wide border border-cyan-400 text-cyan-100 rounded-xl py-2 hover:bg-cyan-400/10 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 text-sm font-semibold tracking-wide border border-slate-600 text-slate-200 rounded-xl py-2 hover:bg-slate-800/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* footer text */}
          <p className="pt-2 text-[11px] text-center text-slate-500">
            Your why can change. The important part is that you still have one.
          </p>
        </div>
      </main>
    </div>
  );
}
