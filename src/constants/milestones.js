// src/constants/milestones.js

// Cada milestone: días limpios necesarios + metadata para UI
export const MILESTONES = [
  // Días iniciales
  {
    id: "24h",
    label: "24 hours",
    days: 1,
    isOfficial: true,
    color: "#e5e7eb", // white-ish
  },
  {
    id: "1w",
    label: "1 week",
    days: 7,
    isOfficial: false, // semana sin chip oficial
  },
  {
    id: "2w",
    label: "2 weeks",
    days: 14,
    isOfficial: false,
  },

  // 1–3 meses
  {
    id: "30d",
    label: "1 month",
    days: 30,
    isOfficial: true,
    color: "#fb923c", // orange
  },
  {
    id: "60d",
    label: "2 months",
    days: 60,
    isOfficial: true,
    color: "#4ade80", // green
  },
  {
    id: "90d",
    label: "3 months",
    days: 90,
    isOfficial: true,
    color: "#ef4444", // red
  },

  // 4–5 meses (sin chip)
  {
    id: "4m",
    label: "4 months",
    days: 120,
    isOfficial: false,
  },
  {
    id: "5m",
    label: "5 months",
    days: 150,
    isOfficial: false,
  },

  // 6 meses
  {
    id: "6m",
    label: "6 months",
    days: 182, // aprox
    isOfficial: true,
    color: "#3b82f6", // blue
  },

  // 7–8 meses (sin chip)
  {
    id: "7m",
    label: "7 months",
    days: 213,
    isOfficial: false,
  },
  {
    id: "8m",
    label: "8 months",
    days: 243,
    isOfficial: false,
  },

  // 9 meses
  {
    id: "9m",
    label: "9 months",
    days: 273,
    isOfficial: true,
    color: "#facc15", // yellow
  },

  // 10–11 meses (sin chip)
  {
    id: "10m",
    label: "10 months",
    days: 304,
    isOfficial: false,
  },
  {
    id: "11m",
    label: "11 months",
    days: 335,
    isOfficial: false,
  },

  // 1 año
  {
    id: "1y",
    label: "1 year",
    days: 365,
    isOfficial: true,
    color: "#a855f7", // purple
  },

  // Años (todos oficiales)
  {
    id: "2y",
    label: "2 years",
    days: 730,
    isOfficial: true,
    color: "#4ade80", // green
  },
  {
    id: "3y",
    label: "3 years",
    days: 1095,
    isOfficial: true,
    color: "#3b82f6", // blue
  },
  {
    id: "4y",
    label: "4 years",
    days: 1460,
    isOfficial: true,
    color: "#a855f7", // purple
  },
  {
    id: "5y",
    label: "5 years",
    days: 1825,
    isOfficial: true,
    color: "#000000", // black
  },
  {
    id: "6y",
    label: "6 years",
    days: 2190,
    isOfficial: true,
    color: "#fbbf24", // gold-ish
  },
  {
    id: "7y",
    label: "7 years",
    days: 2555,
    isOfficial: true,
    color: "#64748b", // slate
  },
  {
    id: "8y",
    label: "8 years",
    days: 2920,
    isOfficial: true,
    color: "#0f172a", // very dark
  },

  // 9 & 10 años: estrella / corona
  {
    id: "9y",
    label: "9 years",
    days: 3285,
    isOfficial: true,
    special: "star",
    color: "#facc15",
  },
  {
    id: "10y",
    label: "10 years",
    days: 3650,
    isOfficial: true,
    special: "crown",
    color: "#facc15",
  },
];
