// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav";

export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [group, setGroup] = useState("3PM"); // must match groups.code in DB
  const [password, setPassword] = useState(""); // not used yet (future group PIN)
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    try {
      setSubmitting(true);

      // 1) Save local profile (offline-friendly)
      const profile = {
        name: trimmedName,
        groupCode: group || null, // e.g. '3PM'
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem("na_userProfile", JSON.stringify(profile));

      // 2) Register (or get existing) member + group from DB
      const res = await fetch("/.netlify/functions/members-self-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          groupCode: group, // e.g. '3PM'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.warn("members-self-register failed:", data);
        setError(data?.error || "Could not register. Try again.");
        return;
      }

      // data shape: { member: {...}, group: {...} }
      if (data?.member?.id) {
        window.localStorage.setItem("na_memberId", data.member.id); // uuid
        window.localStorage.setItem(
          "na_memberName",
          data.member.display_name || trimmedName
        );
      } else {
        setError("Registration returned no member id.");
        return;
      }

      if (data?.group?.id) {
        window.localStorage.setItem("na_groupId", data.group.id); // uuid
        window.localStorage.setItem("na_groupCode", data.group.code || group);
      } else {
        // group is required for the rest of the app (Group/Admin pages)
        setError("Registration returned no group id.");
        return;
      }

      // 3) Go Home
      navigate("/");
    } catch (err) {
      console.error("Login submit error:", err);
      setError("Something went wrong. Try again.");
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
              This app is for NA. Tell us who you are and which group you&apos;re
              using it with.
            </p>
          </section>

          <section className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/30 via-sky-400/10 to-purple-500/20 blur-xl opacity-60 pointer-events-none" />

            <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl px-5 py-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-slate-400">
                <span>Profile</span>
                <span className="text-slate-500">v0.2</span>
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

                {/* Group */}
                <div className="space-y-1">
                  <label
                    htmlFor="group"
                    className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Group
                  </label>
                  <select
                    id="group"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                  >
                    <option value="3PM">3PM NA</option>
                    <option value="NIGHTSHIFT">Night Shift</option>
                    <option value="DEBUG">Debug / Sandbox</option>
                  </select>
                  <p className="text-[11px] text-slate-500">
                    This must match the group <span className="font-mono">code</span> in the DB.
                  </p>
                </div>

                {/* Password / PIN (not required for now) */}
                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-[0.16em] text-slate-300"
                  >
                    Password / PIN{" "}
                    <span className="text-slate-500">(not required for now)</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg bg-slate-950/60 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400"
                    placeholder="Not required for now"
                  />
                  <p className="text-[11px] text-slate-500">
                    Later this can be used as a shared group PIN. For now you can
                    leave it empty.
                  </p>
                </div>

                {error && <p className="text-[11px] text-rose-400 pt-1">{error}</p>}

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center rounded-full border border-cyan-400 bg-cyan-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100 hover:bg-cyan-500/20 hover:border-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Saving…" : "Start"}
                  </button>

                  <p className="text-[10px] text-slate-500 text-center">
                    No signup, no email. Just a simple profile for your recovery
                    tools.
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

      <BottomNav />
    </div>
  );
}
