// src/components/BottomNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Hammer, UsersRound, User } from "lucide-react";

export default function BottomNav() {
  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/tools", label: "Tools", icon: Hammer },
    { to: "/group", label: "Group", icon: UsersRound },
    { to: "/me", label: "Me", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg">
      <div className="max-w-md mx-auto flex justify-between px-6 py-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `group flex flex-col items-center gap-1 transition-colors ${
                isActive
                  ? "text-cyan-300"
                  : "text-slate-500 hover:text-slate-300"
              }`
            }
          >
            <Icon
              size={18}
              className={
                label === "Tools"
                  ? // animación solo para el martillo
                    "transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:-rotate-6"
                  : ""
              }
            />
            <span className="text-[10px] font-medium tracking-wide">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
