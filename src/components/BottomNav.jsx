import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Hammer, Wrench, UsersRound, User } from "lucide-react";

export default function BottomNav() {
  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: Home,
    },
    {
      to: "/tools",
      label: "Tools",
      icon: () => (
        <span className="relative flex">
          <Hammer size={18} className="absolute left-0 top-0 text-current" />
          <Wrench size={18} className="absolute left-2 top-0 text-current" />
        </span>
      ), // overlay de Hammer + Wrench para "toolbox vibe"
    },
    {
      to: "/group",
      label: "Group",
      icon: UsersRound,
    },
    {
      to: "/me",
      label: "Me",
      icon: User,
    },
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
              `flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-cyan-300" : "text-slate-500 hover:text-slate-300"
              }`
            }
          >
            {/* Icon can be component OR function */}
            {typeof Icon === "function" ? <Icon /> : <Icon size={18} />}
            <span className="text-[10px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
