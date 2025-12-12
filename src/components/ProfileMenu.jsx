// src/components/ProfileMenu.jsx
import React, { useEffect } from "react";
import {
  X,
  LogOut,
  Settings,
  Info,
  User,
  CalendarClock,
} from "lucide-react";

export default function ProfileMenu({ userProfile, onClose }) {
  // cerrar con ESC
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const displayName = userProfile?.display_name || "Friend";
  const cleanDate = userProfile?.sober_date || null; // si lo tienes guardado ahí

  return (
    // overlay oscuro POR ENCIMA de todo
    <div
      className="fixed inset-0 z-40 bg-black/40"
      onClick={onClose}
    >
      {/* Panel anclado al header, arriba a la derecha */}
      <div
        className="absolute right-4 top-[3.25rem] w-64 rounded-2xl border border-slate-700 bg-slate-900/95 shadow-xl backdrop-blur p-3 text-slate-100"
        onClick={(e) => e.stopPropagation()} // no cerrar al hacer click dentro
      >
        {/* Header del menú */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center">
              <User size={16} className="text-cyan-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Logged in as
              </span>
              <span className="text-sm font-medium text-slate-100 truncate max-w-[9rem]">
                {displayName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            aria-label="Close profile menu"
          >
            <X size={14} />
          </button>
        </div>

        {cleanDate && (
          <div className="flex items-center gap-2 mb-3 text-[11px] text-slate-400">
            <CalendarClock size={13} className="text-cyan-300" />
            <span>Sober date: {cleanDate}</span>
          </div>
        )}

        <hr className="border-slate-800 mb-2" />

        {/* Opciones (placeholder) */}
        <nav className="flex flex-col gap-1 text-sm">
          <button
            type="button"
            onClick={() => console.log("TODO: ir a perfil")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-left"
          >
            <User size={14} className="text-slate-400" />
            <span>My profile</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("TODO: cambiar sober date")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-left"
          >
            <CalendarClock size={14} className="text-slate-400" />
            <span>Change sober date</span>
          </button>

          {/* TODO: multi-group */}
          <button
            type="button"
            onClick={() => console.log("TODO: seleccionar grupo")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-left"
          >
            <Info size={14} className="text-slate-400" />
            <span>My group (3PM)</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("TODO: abrir settings")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-left"
          >
            <Settings size={14} className="text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={() => console.log("TODO: about this app")}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 text-left"
          >
            <Info size={14} className="text-slate-400" />
            <span>About 3PMers</span>
          </button>
        </nav>

        <hr className="border-slate-800 my-2" />

        <button
          type="button"
          onClick={() => console.log("TODO: log out")}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-red-900/30 text-left text-xs text-red-300"
        >
          <LogOut size={13} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
