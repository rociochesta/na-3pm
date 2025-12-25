// src/pages/Admin.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Plus, Quote } from "lucide-react";

//import { loadGroupMembers } from "../constants/groupMembers.js";
import { SLOGAN_SETS } from "../constants/slogans.js";
import BottomNav from "../components/BottomNav";


export default function Admin() {
  const [name, setName] = useState("");
  const [soberDate, setSoberDate] = useState("");
  const [members, setMembers] = useState([]);

  const [slogans, setSlogans] = useState([]);
  const [newSlogan, setNewSlogan] = useState("");

  const nav = useNavigate();

  useEffect(() => {
    // check boss access
    const ok = window.localStorage.getItem("na_boss") === "1";
    if (!ok) nav("/boss");
  }, [nav]);

useEffect(() => {
  (async () => {
    try {
      const groupId = window.localStorage.getItem("na_groupId");
      if (!groupId) {
        console.warn("Admin: no na_groupId in localStorage");
        setMembers([]);
        return;
      }

      const res = await fetch("/.netlify/functions/get-group-members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("get-group-members failed:", data);
        setMembers([]);
        return;
      }

      setMembers(data.members || []);
    } catch (e) {
      console.error("Admin load members failed:", e);
      setMembers([]);
    }
  })();

  // slogans: por ahora mock
  const base = SLOGAN_SETS["3PM"] || [];
  setSlogans(base);
}, []);


  // Por ahora solo front: no guarda nada, no toca el JSON.
  function handleFakeSubmit(e) {
    e.preventDefault();
    console.log("Preview new member (not saved yet):", { name, soberDate });
  }

  // Mock para añadir slogan (solo front)
  function handleAddSlogan(e) {
    e.preventDefault();
    const text = newSlogan.trim();
    if (!text) return;

    const preview = {
      id: `preview-${Date.now()}`,
      groupKey: "3PM", // más adelante será dinámico por grupo
      text,
    };

    console.log("Preview new slogan (not saved yet):", preview);

    // lo agregamos sólo en memoria, al principio de la lista
    setSlogans((prev) => [preview, ...prev]);
    setNewSlogan("");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <main className="w-full max-w-md px-4 py-6 space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
            >
              <ArrowLeft size={14} />
              <span>Back home</span>
            </Link>
          </div>

          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Boss access
          </p>
        </header>

        {/* Title */}
        <section className="space-y-1">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Users size={18} className="text-cyan-400" />
            <span>Group admin</span>
          </h1>
          <p className="text-[12px] text-slate-400">
            Aquí vas a poder editar miembros, slogans y tablas cuando tengamos
            base de datos. Por ahora, solo visual y mock.
          </p>
        </section>

        {/* Current members */}
        <section className="space-y-2">
          <h2 className="text-[12px] font-semibold text-slate-300 uppercase tracking-[0.16em]">
            Current members
          </h2>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2 max-h-64 overflow-y-auto">
            {members.map((m, idx) => (
              <div
                key={`${m.name}-${idx}`}
                className="flex items-center justify-between text-[12px] text-slate-200 border-b border-slate-800/60 last:border-none pb-1.5 last:pb-0"
              >
<span>{m.display_name}</span>
<span className="text-[11px] text-slate-400">
  {m.sober_date || "—"}
</span>

              </div>
            ))}
          </div>
        </section>

        {/* Add member block (sin backend todavía) */}
        <section className="space-y-2">
          <h2 className="text-[12px] font-semibold text-slate-300 uppercase tracking-[0.16em]">
            Add member (preview only)
          </h2>

          <form
            onSubmit={handleFakeSubmit}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">Name</label>
              <input
                type="text"
                className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-[12px] text-slate-100 outline-none focus:border-cyan-400"
                placeholder="NA name / nickname"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">
                Sober date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-[12px] text-slate-100 outline-none focus:border-cyan-400"
                value={soberDate}
                onChange={(e) => setSoberDate(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:bg-slate-900/60 transition-colors"
            >
              <Plus size={14} />
              <span>Preview add member</span>
            </button>

            <p className="text-[10px] text-slate-500 pt-1">
              No se guarda nada todavía. Más adelante esto va a hablar con la
              base de datos.
            </p>
          </form>
        </section>

        {/* 🔹 Group slogans (mock) */}
        <section className="space-y-2">
          <h2 className="text-[12px] font-semibold text-slate-300 uppercase tracking-[0.16em]">
            Group slogans (preview only)
          </h2>

          {/* Lista de slogans actuales */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-2 max-h-64 overflow-y-auto">
            {slogans.length === 0 ? (
              <p className="text-[11px] text-slate-500">
                No slogans loaded yet. Más adelante vas a poder traer tus
                slogans desde la base de datos.
              </p>
            ) : (
              slogans.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start gap-2 text-[11px] text-slate-200 border-b border-slate-800/60 last:border-none pb-2 last:pb-0"
                >
                  <Quote size={14} className="mt-[2px] text-cyan-400" />
                  <p className="leading-snug">{s.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Form para añadir slogan (mock) */}
          <form
            onSubmit={handleAddSlogan}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-400">
                New slogan (preview)
              </label>
              <textarea
                rows={2}
                className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1.5 text-[12px] text-slate-100 outline-none focus:border-cyan-400 resize-none"
                placeholder="Write a new slogan for this group..."
                value={newSlogan}
                onChange={(e) => setNewSlogan(e.target.value)}
              />
              <p className="text-[10px] text-slate-500">
                Más adelante esto se guardará por grupo en la base de datos.
                Ahora solo es mock en memoria y console.log.
              </p>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1.5 text-[11px] text-slate-200 hover:border-cyan-400 hover:text-cyan-200 hover:bg-slate-900/60 transition-colors"
            >
              <Plus size={14} />
              <span>Preview add slogan</span>
            </button>
          </form>
        </section>
        {/* Danger zone */}
<section className="space-y-2 border-t border-rose-900/40 pt-6">
  <h2 className="text-[12px] text-rose-400 font-semibold uppercase tracking-[0.16em]">
    Danger zone
  </h2>

  <button
    type="button"
    className="w-full text-[11px] border border-rose-500 text-rose-300 rounded-lg py-2 hover:bg-rose-900/30 transition-colors"
    onClick={async () => {
      const yes = window.confirm(
        "This will delete YOUR profile, clean date, why, gratitudes and remove you from the group.\n\nIt does NOT delete other members.\n\nAre you absolutely sure?"
      );
      if (!yes) return;

      try {
        const memberId = window.localStorage.getItem("na_memberId");

        if (memberId) {
          await fetch("/.netlify/functions/delete-member", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ memberId }),

          });
        }

        window.localStorage.clear();
        window.location.href = "/login";
      } catch (err) {
        console.error("Full reset failed:", err);
        alert("Something went wrong deleting your profile.");
      }
    }}
  >
    Delete my profile
  </button>

  <p className="text-[10px] text-slate-500">
    This is irreversible. Your data dies, your story doesn't.
  </p>
</section>

      </main>
          <BottomNav />
    </div>
  );
}
