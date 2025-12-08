// src/components/HeaderGeneric.jsx
import React, { useState } from "react";
import { Menu } from "lucide-react";
import MenuOverlay from "./MenuOverlay.jsx";
import { getSlogan } from "../utils/getSlogan.js";

export default function HeaderGeneric({ group, showMenu = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slogan] = useState(() => getSlogan());

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">

          {/* Group info (replaces 3PM badge) */}
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.20em] text-slate-400">
              NA Group
            </span>
            <span className="text-[11px] font-medium text-cyan-300">
              {group}
            </span>
          </div>

          {/* Slogan */}
          <div className="flex-1 text-right">
            <p className="text-[11px] text-cyan-300 font-medium leading-snug">
              {slogan}
            </p>
          </div>

          {/* Menu button */}
          {showMenu && (
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="ml-1 p-1 rounded-full border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/70 transition-colors"
            >
              <Menu size={15} />
            </button>
          )}
        </div>
      </header>

      {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} />}
    </>
  );
}
