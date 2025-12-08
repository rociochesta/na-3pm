// src/components/Header3PM.jsx
import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { getSlogan } from "../utils/getSlogan.js";
import MenuOverlay from "./MenuOverlay.jsx";

export default function Header3PM({ showMenu = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [slogan, setSlogan] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("na_userProfile");
      const profile = raw ? JSON.parse(raw) : null;
      setUserProfile(profile);

      // 🔹 Definir groupKey para slogans:
      // - sin perfil o sin grupo → "3PM"
      // - con grupo (pero aún sin config propia) → "generic"
      // más adelante: profile.groupKey vendrá desde la BD
      let groupKey = "3PM";

      if (profile?.groupKey) {
        // futuro: si guardamos un ID propio de grupo
        groupKey = profile.groupKey;
      } else if (profile?.groupCode) {
        // tiene grupo pero todavía no hay slogans custom
        groupKey = "generic";
      }

      const text = getSlogan({ groupKey });
      setSlogan(text);
    } catch (err) {
      console.error("Error loading user profile for header:", err);
      setSlogan(getSlogan()); // fallback: 3PM por defecto
    }
  }, []);

  const hasGroup = Boolean(userProfile?.groupCode);
  const groupName = userProfile?.groupCode;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Marca / Group block */}
          {!hasGroup ? (
            // 🔹 Modo 3PM (por defecto, sin grupo)
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
          ) : (
            // 🔹 Modo genérico para otros grupos
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-[0.20em] text-slate-400">
                NA Group
              </span>
              <span className="text-[11px] font-medium text-cyan-300">
                {groupName}
              </span>
            </div>
          )}

          {/* Slogan */}
          <div className="flex-1 text-right">
            <p className="text-[11px] text-cyan-300 font-medium leading-snug">
              {slogan}
            </p>
          </div>

          {/* Botón menú */}
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
