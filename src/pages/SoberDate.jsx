// src/pages/SoberDate.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header3PM from "../components/Header3PM";

export default function SoberDate() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // leer sober date si ya existe (local)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("na_soberDate");
      if (stored) setDate(stored); // asumimos formato YYYY-MM-DD
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
    try {
      window.localStorage.removeItem("na_soberDate");
    } catch {
      // ignore
    }
    setDate("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-5">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              When did you stop using?
            </h2>
            <p className="text-sm text-slate-300">
              No ceremony. No confession. We&apos;ll just start counting from
              there.
            </p>
          </section>

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
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <p className="text-xs text-slate-500">
                If you&apos;re changing this date, we won&apos;t ask why.
              </p>
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full text-sm font-semibold tracking-wide border border-cyan-400 text-cyan-100 rounded-xl py-2.5 hover:bg-cyan-400/10 disabled:opacity-60 transition-colors"
              >
                {saving ? "Saving…" : "Save clean date"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full text-sm font-semibold tracking-wide border border-slate-600 text-slate-200 rounded-xl py-2.5 hover:bg-slate-800/80 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="w-full text-xs text-slate-500 underline underline-offset-4 mt-1 hover:text-slate-300"
              >
                Clear clean date
              </button>
            </div>
          </form>

          <p className="pt-2 text-center text-[11px] text-slate-500">
            Resetting the date doesn&apos;t erase your story. It just updates
            the counter.
          </p>
        </div>
      </main>
    </div>
  );
}
