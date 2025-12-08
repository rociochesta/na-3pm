// src/components/Header3PM.jsx
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { getSlogan } from "../utils/getSlogan.js";
import MenuOverlay from "./MenuOverlay.jsx";

export default function Header3PM({ showMenu = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    try {
      // Always use the 3PM slogans
      const text = getSlogan({ groupKey: "3PM" });
      setSlogan(text);
    } catch (err) {
      console.error("Error loading slogan for header:", err);
      setSlogan(getSlogan()); // fallback
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Left: fixed 3PM brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full border border-cyan-400/70 flex items-center justify-center text-[11px] font-semibold text-cyan-300">
              3PM
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                3PMERS
              </span>
              <span className="text-[11px] text-slate-500">NA homegroup</span>
            </div>
          </div>

          {/* Center/right: slogan */}
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
