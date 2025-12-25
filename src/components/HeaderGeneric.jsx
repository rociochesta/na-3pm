// src/components/HeaderGeneric.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { getSlogan } from "../utils/getSlogan.js";

export default function HeaderGeneric({ group = "NA Group", showMenu = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slogan, setSlogan] = useState("…");

  // read group context from localStorage (if available)
  const groupId = useMemo(() => {
    try {
      return window.localStorage.getItem("na_groupId") || null;
    } catch {
      return null;
    }
  }, []);

  const groupCode = useMemo(() => {
    try {
      return window.localStorage.getItem("na_groupCode") || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const loadSloganFromDb = async () => {
      try {
        // Prefer groupId if we have it
        const url = groupId
          ? `/.netlify/functions/get-slogan?groupId=${encodeURIComponent(groupId)}`
          : "/.netlify/functions/get-slogan";

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (data?.text) {
          setSlogan(data.text);
        } else {
          // fallback local (use groupCode if you want)
          setSlogan(getSlogan({ groupKey: groupCode || undefined }));
        }
      } catch (err) {
        console.error("No se pudo cargar el slogan desde la DB:", err);
        setSlogan(getSlogan({ groupKey: groupCode || undefined }));
      }
    };

    loadSloganFromDb();
  }, [groupId, groupCode]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Group info */}
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.20em] text-slate-400">
              NA Group
            </span>
            <span className="text-[11px] font-medium text-cyan-300">{group}</span>
          </div>

          {/* Slogan */}
          <div className="flex-1 text-right">
            <p className="text-[11px] text-cyan-300 font-medium leading-snug">
              {slogan || "…"}
            </p>
          </div>

          {/* Menu button */}
          {showMenu && (
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="ml-1 h-8 w-8 rounded-full border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/70 transition-colors flex items-center justify-center"
            >
              <Menu size={16} />
            </button>
          )}
        </div>
      </header>

      {/* if you actually have a menu component, open it here */}
      {/* {isMenuOpen && <YourMenu onClose={() => setIsMenuOpen(false)} />} */}
    </>
  );
}
