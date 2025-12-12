// src/pages/ToolQuestionPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";

const QUESTIONS = [
  {
    step: 1,
    key: "thought",
    label: "What thought is bothering you right now?",
    hint: "Write it as a sentence.",
    subtext: "This is the line your brain keeps replaying. Put it on the table.",
    placeholder: "“I’m going to screw this up.”",
  },
  {
    step: 2,
    key: "for",
    label: "What facts support this thought?",
    hint: "Only things you could prove to someone else.",
    subtext: "Not vibes. Not fears. Actual receipts.",
    placeholder: "“She said X.” “I missed the deadline.”",
  },
  {
    step: 3,
    key: "against",
    label: "What facts do NOT support this thought?",
    hint: "Evidence that goes against it.",
    subtext: "Yes, this part is annoying. Do it anyway.",
    placeholder: "“They also said Y.” “No one confirmed the fear.”",
  },
  {
    step: 4,
    key: "likely",
    label: "What is the most likely outcome?",
    hint: "Not the worst-case. Not the best-case. The realistic one.",
    subtext: "If this were a boring Tuesday, how would it probably end?",
    placeholder: "“Uncomfortable conversation. Then life continues.”",
  },
];

function getStorageKey(sectionId, toolSlug) {
  return `na_toolrun_${sectionId}_${toolSlug}`;
}

function readDraft(sectionId, toolSlug) {
  try {
    const raw = localStorage.getItem(getStorageKey(sectionId, toolSlug));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeDraft(sectionId, toolSlug, patch) {
  try {
    const current = readDraft(sectionId, toolSlug);
    localStorage.setItem(
      getStorageKey(sectionId, toolSlug),
      JSON.stringify({
        ...current,
        ...patch,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch {}
}

export default function ToolQuestionPage() {
  const { sectionId, toolSlug, step } = useParams();
  const navigate = useNavigate();

  const stepNum = Number(step || 1);

  const q = useMemo(
    () => QUESTIONS.find((x) => x.step === stepNum) || QUESTIONS[0],
    [stepNum]
  );

  const [value, setValue] = useState("");

  useEffect(() => {
    const draft = readDraft(sectionId, toolSlug);
    setValue(typeof draft[q.key] === "string" ? draft[q.key] : "");
  }, [sectionId, toolSlug, q.key]);

  useEffect(() => {
    writeDraft(sectionId, toolSlug, { [q.key]: value });
  }, [sectionId, toolSlug, q.key, value]);

  function goBack() {
    if (stepNum <= 1) {
      navigate(`/tools/${sectionId}/${toolSlug}`);
    } else {
      navigate(`/tools/${sectionId}/${toolSlug}/${stepNum - 1}`);
    }
  }

  function goNext() {
    if (stepNum >= 4) {
      navigate(`/tools/${sectionId}/${toolSlug}`);
    } else {
      navigate(`/tools/${sectionId}/${toolSlug}/${stepNum + 1}`);
    }
  }

 const canContinue = value.trim().length > 0;


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <button
            onClick={goBack}
            className="text-[11px] text-slate-400 underline hover:text-cyan-300"
          >
            ← Back
          </button>

          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
            Question {q.step} of 4
          </p>

          <div className="space-y-2">
            <h1 className="text-lg font-semibold">{q.label}</h1>
            <p className="text-[12px] text-slate-400">{q.hint}</p>
            <p className="text-sm text-slate-400">{q.subtext}</p>
          </div>

          <textarea
            rows={4}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={q.placeholder}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-cyan-400/60"
          />
<button
  type="button"
  onClick={() => setValue("I don’t know.")}
  className="text-[11px] text-slate-500 underline hover:text-slate-300"
>
  I don’t know
</button>

          <div className="flex gap-2">
            <button
              onClick={goBack}
              className="flex-1 rounded-xl border border-slate-800 py-3 text-sm"
            >
              Back
            </button>

            <button
              disabled={!canContinue}
              onClick={goNext}
              className={`flex-1 rounded-xl py-3 text-sm font-medium ${
                !canContinue
                  ? "bg-slate-800 text-slate-500"
                  : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
              }`}
            >
              {q.step === 4 ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
