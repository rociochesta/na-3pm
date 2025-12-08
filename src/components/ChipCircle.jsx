// src/components/ChipCircle.jsx
import React from "react";

export default function ChipCircle({
  size = 14,
  color = "#22d3ee",
  filled = false,
  className = "",
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke={color}
        strokeWidth="2"
        fill={filled ? color : "transparent"}
      />
    </svg>
  );
}
