import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";

export default function ToolSectionPage() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          <button
            type="button"
            onClick={() => navigate("/tools")}
            className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-cyan-300"
          >
            ← Back to Toolbox
          </button>

          <h1 className="text-lg font-semibold tracking-tight">
            {sectionId === "grounding" ? "Grounding tools" : `${sectionId} tools`}
          </h1>

          <p className="text-sm text-slate-300">
            Hub page. Next step: two big “do now” buttons + grouped list.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
