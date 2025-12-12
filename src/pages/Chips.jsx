// src/pages/Chips.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header3PM from "../components/Header3PM";
import BottomNav from "../components/BottomNav";


const CHIP_DEFS = [
  {
    id: "24h",
    label: "White chip",
    time: "24 hours clean",
    emoji: "🤍",
    neutral:
      "The first surrender: asking for help and starting clean time, one day at a time.",
    humor: [
      "You survived one full day without your favorite disaster.",
      "Your body is confused. Your dealer probably is too.",
      "24 hours clean. Your addiction did not see that plot twist coming.",
      "Today you didn’t explode. That’s not nothing.",
    ],
  },
  {
    id: "30d",
    label: "Orange chip",
    time: "30 days clean",
    emoji: "🟠",
    neutral:
      "One month clean. The fog starts to lift and reality becomes a little clearer.",
    humor: [
      "Thirty days clean. Your brain wanted chaos. You said ‘not this month’.",
      "You outlived an entire month of your impulses. Rude, but impressive.",
      "One month without your favorite self-destruction. Who even are you.",
      "30 days: your using story is officially in the prequel category.",
    ],
  },
  {
    id: "60d",
    label: "Green chip",
    time: "60 days clean",
    emoji: "🟢",
    neutral:
      "Two months clean. Emotions and clarity show up, and you learn to stay anyway.",
    humor: [
      "Sixty days. Feelings fully installed. Uninstall option is still not available.",
      "Two months clean: your emotions are loud, but they’re not in charge anymore.",
      "You’re starting to feel things before you ruin them. That’s new.",
      "60 days: you’re clean enough to know when you’re lying to yourself. Annoying, but useful.",
    ],
  },
  {
    id: "90d",
    label: "Red chip",
    time: "90 days clean",
    emoji: "🔴",
    neutral:
      "Three months clean. Stability grows and you start taking responsibility for your life.",
    humor: [
      "Ninety days: you remember everything now. Terrible feature, excellent progress.",
      "Three months clean. You can’t blame everything on detox anymore. Tragic.",
      "90 days: your sponsor’s favorite sentence is now ‘Have you prayed about it?’",
      "You made it to the part where you don’t implode every time a feeling shows up. Only sometimes.",
    ],
  },
  {
    id: "6m",
    label: "Blue chip",
    time: "6 months clean",
    emoji: "🔵",
    neutral:
      "Half a year clean. Recovery becomes a part of your daily life, not a side quest.",
    humor: [
      "Six months: your old life is now a plot twist, not your default setting.",
      "Half a year clean. You’re calm sometimes and you still don’t trust it.",
      "6 months: people say ‘you seem different’ and your first instinct is to apologize.",
      "You’ve been choosing life for six months straight. That’s not an accident anymore.",
    ],
  },
  {
    id: "9m",
    label: "Yellow chip",
    time: "9 months clean",
    emoji: "🟡",
    neutral:
      "Nine months clean. You show consistency even when life doesn’t go your way.",
    humor: [
      "Nine months: you’ve become the person newcomers accidentally trauma-dump on.",
      "You keep showing up even when life doesn’t clap. That’s recovery, not vibes.",
      "9 months clean. You’re basically doing a functional adult cosplay.",
      "Nine months: you can carry other people’s chaos without using. That’s dark magic.",
    ],
  },
  {
    id: "1y",
    label: "Purple chip",
    time: "1 year clean",
    emoji: "💜",
    neutral:
      "One year clean. A solid foundation in recovery and a new way of living.",
    humor: [
      "One year clean. People plug their trauma into you like you’re Recovery USB-C.",
      "You didn’t just stay — you became part of the furniture.",
      "365 days of not disappearing. That’s a personality now.",
      "One year: you’re the ‘it gets better’ spoiler for someone who still thinks it doesn’t.",
    ],
  },
  {
    id: "years",
    label: "Black/Gold chip",
    time: "Multiple years clean",
    emoji: "⚫",
    neutral:
      "Multiple years clean. Ongoing commitment, service, and showing that long-term recovery is possible.",
    humor: [
      "You run on coffee, slogans, and unresolved childhood shit — but you’re still clean.",
      "Multiple years clean: you are living proof that miracles can be sarcastic.",
      "You became the person you needed when you thought you wouldn’t make it.",
      "Years clean: your relapse story is now a horror anecdote, not a prophecy.",
    ],
  },
];

function pickRandomHumorMap() {
  const map = {};
  CHIP_DEFS.forEach((chip) => {
    const list = chip.humor;
    if (list && list.length > 0) {
      const index = Math.floor(Math.random() * list.length);
      map[chip.id] = list[index];
    } else {
      map[chip.id] = null;
    }
  });
  return map;
}

export default function Chips() {
  const [showNeutral, setShowNeutral] = useState(false);
  const [humorMap] = useState(() => pickRandomHumorMap());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Top bar */}

  <Header3PM />

      {/* Main */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Intro */}
          <section className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              What do the chips mean?
            </h2>
            <p className="text-sm text-slate-300">
              NA chips mark clean time. They&apos;re not grades, trophies, or
              guarantees — just reminders that you kept coming back.
            </p>

          </section>

          {/* Chip list */}
          <section className="space-y-3">
            {CHIP_DEFS.map((chip) => (
              <div
                key={chip.id}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{chip.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {chip.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {chip.time}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[13px] text-slate-300 pt-1">
                  {showNeutral
                    ? chip.neutral
                    : humorMap[chip.id] ?? chip.neutral}
                </p>
              </div>
            ))}
          </section>

          {/* Footer note */}
          <p className="pt-2 text-[11px] text-slate-500">
            Chips don&apos;t measure your worth. They just mark the days you
            didn&apos;t disappear.
          </p>
        </div>
      </main>
          <BottomNav />
    </div>
  );
}
