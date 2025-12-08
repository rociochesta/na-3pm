// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [group, setGroup] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

const profile = {
  name: trimmedName,
  email: email.trim() || null,
  groupCode: group.trim() || null, // lo que escribe la persona
  groupKey: null,                   // futuro ID real de grupo en la BD
  createdAt: new Date().toISOString(),
};

window.localStorage.setItem("na_userProfile", JSON.stringify(profile));


    try {
      setSubmitting(true);

      // 🔹 Guardar perfil localmente (después esto se mandará a la BD)
      window.localStorage.setItem("na_userProfile", JSON.stringify(profile));

      // opcional: log para debug
      console.log("Saved user profile:", profile);

      // 🔹 Ir a Home
      navigate("/");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Before we start…
            </h2>
            <p className="text-sm text-slate-300">
              This app is for NA brains. Tell us who you are and, if you
              want, where you usually sit.
            </p>
          </section>

          <section className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-sky-400/10 to-purple-500/20 blur-xl opacity-60 pointer-events-none" />

            <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl px-5 py-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <span>Profile</span>
                <span className="text-slate-500">v0.1</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name (required) */}
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                    placeholder="First name, nickname, whatever you use in meetings"
                  />
                  <p className="text-[11px] text-slate-500">
                    This is the name we&apos;ll use inside the app.
                  </p>
                </div>

                {/* Email (optional) */}
                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Email <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                    placeholder="Only if you want updates later"
                  />
                </div>

                {/* Group (optional) */}
                <div className="space-y-1">
                  <label
                    htmlFor="group"
                    className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Group <span className="text-slate-500">(optional)</span>
                  </label>
                  <input
                    id="group"
                    type="text"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                    placeholder="3PM NA, Sunday Night, Zoom ID… or leave empty"
                  />
                  <p className="text-[11px] text-slate-500">
                    Leave this empty if you&apos;re just using it for yourself.
                  </p>
                </div>

                {error && (
                  <p className="text-[11px] text-rose-400 pt-1">{error}</p>
                )}

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center rounded-full border border-cyan-400 bg-cyan-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Saving…" : "Start"}
                  </button>

                  <p className="text-[10px] text-slate-500 text-center">
                    No password, no login. Just your name and a place to keep
                    track of your recovery.
                  </p>
                </div>
              </form>
            </div>
          </section>

          <div className="flex justify-end">
            <Link
              to="/"
              className="text-[10px] text-slate-600 hover:text-cyan-300 underline underline-offset-2"
            >
              Skip for now
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
