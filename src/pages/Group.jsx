// src/pages/Group.jsx
import React from "react";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";

export default function GroupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM />
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-lg font-semibold">Group</h1>
          <p className="text-sm text-slate-400 mt-2">
            TODO: group milestones, meeting info, etc.
          </p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
