// src/components/NeonBadge.jsx
import React from "react";
import { motion } from "framer-motion";

export default function NeonBadge({ num, size = 64, className = "" }) {
  const dimension = size; // px

  return (
    <motion.svg
      width={dimension}
      height={dimension}
      viewBox="0 0 84 84"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{ scale: 1, opacity: 0.96 }}
      animate={{ scale: [1, 1.03, 1], opacity: [0.96, 1, 0.96] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="badgeGlow" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#22D3EE" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer glow */}
      <circle cx="42" cy="42" r="40" fill="url(#badgeGlow)" />

      {/* Neon ring */}
      <circle
        cx="42"
        cy="42"
        r="32"
        stroke="#22D3EE"
        strokeWidth="2.2"
        opacity="0.75"
      />

      {/* Inner circle */}
      <circle
        cx="42"
        cy="42"
        r="26"
        fill="rgba(15,23,42,0.95)" // bg-slate-900-ish
        stroke="rgba(34,211,238,0.5)"
        strokeWidth="1.4"
      />

      {/* Number */}
      <text
        x="42"
        y="42"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#A5F3FC" // cyan-200-ish
        fontSize="26"
        fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        fontWeight="600"
      >
        {num}
      </text>
    </motion.svg>
  );
}
