// src/pages/SoberDate.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sunrise, AlertTriangle } from "lucide-react";
import Header3PM from "../components/Header3PM";

export default function SoberDate() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hadExistingDate, setHadExistingDate] = useState(false);

  // leer sober date si ya existe (local)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("na_soberDate");
      if (stored) {
        setDate(stored); // asumimos formato YYYY-MM-DD
        setHadExistingDate(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!date) {
      setError("Pick a date. Any date that actually exists.");
      return;
    }

    const chosen = new Date(date);
    const today = new Date();
    chosen.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(chosen.getTime())) {
      setError("That doesn’t look like a real date.");
      return;
    }

    if (chosen > today) {
      setError("Future clean time doesn’t count yet.");
      return;
    }

    setSaving(true);

    try {
      // 1) guardar localmente para que la app funcione aunque falle el backend
      window.localStorage.setItem("na_soberDate", date);

      // 2) intentar guardar en la base de datos vía Netlify function
      try {
        const memberId = window.localStorage.getItem("na_memberId");

        if (!memberId) {
          console.warn(
            "No na_memberId in localStorage; skipping DB update for sober date."
          );
        } else {
          const res = await fetch("/.netlify/functions/update-sober-date", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memberId: Number(memberId),
              soberDate: date, // YYYY-MM-DD
            }),
          });

          if (!res.ok) {
            console.warn(
              "Failed to update sober date in DB:",
              res.status,
              await res.text()
            );
          } else {
            const data = await res.json();
            console.log("Sober date saved in DB:", data);
          }
        }
      } catch (dbErr) {
        console.warn("Error calling update-sober-date function:", dbErr);
      }

      // 3) back home
      navigate("/");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    if (!date) {
      setError("");
      return;
    }

    const ok = window.confirm(
      "Clear your clean date? This doesn’t erase your story or your wreckage — it just resets the counter."
    );
    if (!ok) return;

    try {
      window.localStorage.removeItem("na_soberDate");
    } catch {
      // ignore
    }
    setDate("");
    setError("");
    setHadExistingDate(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-10 space-y-7">
          {/* Hero ilustrado */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-950/80 via-slate-950 to-slate-900 px-4 py-6 shadow-xl shadow-black/40">
            <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-cyan-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-sky-400/15 blur-2xl" />

            <div className="flex items-start gap-3 relative">
              <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 border border-cyan-400/70 shadow-inner shadow-black/50">
                <Sunrise size={22} className="text-cyan-300" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  {hadExistingDate
                    ? "So… when did your clean time actually start?"
                    : "When did you stop getting high on purpose?"}
                </h1>
                <p className="text-sm text-slate-200">
                  We don&apos;t need the TED talk — just the day your chaos
                  took a smoke break.
                </p>
                <p className="text-xs text-slate-400">
                  Being honest about this date doesn&apos;t revoke your clean
                  time. It just keeps your counter from lying on your behalf.
                </p>
              </div>
            </div>
          </section>

          {/* Card de formulario */}
          <section className="rounded-2xl border border-slate-800 bg-slate-950/95 shadow-lg shadow-black/40 px-4 py-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="soberDate"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  Clean date
                </label>
                <input
                  id="soberDate"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
                <p className="text-xs text-slate-500">
                  Choose the first full day you weren&apos;t using. If
                  you&apos;re changing this, we still won&apos;t ask what
                  happened.
                </p>
              </div>

              {error && (
                <p className="text-xs text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full text-sm font-semibold tracking-wide rounded-xl py-2.5 bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md shadow-cyan-500/25"
                >
                  {saving ? "Saving…" : "Save clean date"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full text-sm font-semibold tracking-wide rounded-xl py-2.5 border border-slate-600 text-slate-200 hover:bg-slate-800/80 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 text-xs text-red-300 hover:text-red-200"
                >
                  <AlertTriangle size={13} />
                  <span>Clear clean date</span>
                </button>
              </div>
            </form>

            <p className="pt-2 text-center text-[11px] text-slate-500">
              Updating this date doesn&apos;t make you a failure. It makes you a
              brutally honest addict — which is basically a superpower in this
              program.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
