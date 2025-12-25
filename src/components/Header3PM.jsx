// src/components/Header3PM.jsx
import React, { useState, useEffect } from "react";
import { User } from "lucide-react"; // icono de persona
import { getSlogan } from "../utils/getSlogan.js";
import ProfileMenu from "./ProfileMenu.jsx";

export default function Header3PM({ showMenu = true }) {
  const [slogan, setSlogan] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    // cargar perfil desde localStorage
    try {
      const raw = window.localStorage.getItem("na_userProfile");
      if (raw) setUserProfile(JSON.parse(raw));
    } catch (err) {
      console.error("Error loading user profile for header:", err);
    }

    // cargar slogan desde DB
   const loadSloganFromDb = async () => {
  try {
const groupId = window.localStorage.getItem("na_groupId");

const url = groupId
  ? `/.netlify/functions/get-slogan?groupId=${encodeURIComponent(groupId)}`
  : "/.netlify/functions/get-slogan";

const res = await fetch(url);


    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data?.text) {
      setSlogan(data.text);
    } else {
      setSlogan(getSlogan()); // fallback local
    }
  } catch (err) {
    console.error("No se pudo cargar el slogan desde la DB:", err);
    setSlogan(getSlogan());
  }
};

    loadSloganFromDb();
  }, []);

  // inicial del usuario para el avatar (si existe)
 const userInitial =
  (userProfile?.display_name || userProfile?.name || "")
    .trim()
    .charAt(0)
    .toUpperCase() || null;


  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Marca / Group block */}
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

          {/* Slogan */}
          <div className="flex-1 text-right">
            <p className="text-[11px] text-cyan-300 font-medium leading-snug">
              {slogan || "…"}
            </p>
          </div>

          {/* Botón de perfil / avatar */}
          {showMenu && (
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(true)}
              className="ml-1 h-8 w-8 rounded-full border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/70 transition-colors flex items-center justify-center text-[11px] font-semibold"
            >
              {userInitial ? (
                <span>{userInitial}</span>
              ) : (
                <User size={16} />
              )}
            </button>
          )}
        </div>
      </header>

      {isProfileMenuOpen && (
        <ProfileMenu
          userProfile={userProfile}
          onClose={() => setIsProfileMenuOpen(false)}
        />
      )}
    </>
  );
}
