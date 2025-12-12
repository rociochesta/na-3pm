// src/pages/BossAccess.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BOSS_PIN } from "../constants/bossConfig.js";
import { ArrowLeft } from "lucide-react";
import BottomNav from "../components/BottomNav";


export default function BossAccess() {
  const nav = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (pin === BOSS_PIN) {
      window.localStorage.setItem("na_boss", "1");
      nav("/admin");
    } else {
      setError("Invalid pin.");
      setPin("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <main className="w-full max-w-xs px-4 py-10 space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </Link>

        <h1 className="text-sm font-semibold text-center">Boss Access</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-[13px] outline-none focus:border-cyan-400"
            placeholder="Enter PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />

          {error && (
            <p className="text-[11px] text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full text-[12px] border border-slate-700 rounded-full py-1.5 hover:border-cyan-400 hover:bg-slate-800 transition-colors"
          >
            Unlock
          </button>
        </form>
      </main>
          <BottomNav />
    </div>
  );
}
