// src/pages/ToolRunnerPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header3PM from "../components/Header3PM.jsx";
import BottomNav from "../components/BottomNav.jsx";

function storageKey(sectionId, toolSlug) {
  return `na_toolrun_${sectionId}_${toolSlug}`;
}

function clearDraft(sectionId, toolSlug) {
  try {
    window.localStorage.removeItem(storageKey(sectionId, toolSlug));
  } catch {
    // ignore
  }
}

function readDraft(sectionId, toolSlug) {
  try {
    const raw = window.localStorage.getItem(storageKey(sectionId, toolSlug));
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function pickRealityCheckResponse({ thought, against, likely }) {
  const clean = (s = "") => String(s).toLowerCase().trim();

  const thoughtClean = clean(thought);
  const againstClean = clean(against);
  const likelyClean = clean(likely);

  // Regla B — no hay evidencia en contra (o es muy poca)
  if (!againstClean || againstClean.length < 10) return "B";

  // Regla C — lenguaje catastrófico
  const catastrophicWords = [
    "always",
    "never",
    "everything",
    "nothing",
    "ruined",
    "over",
    "end",
    "no way out",
    "destroyed",
    "cant survive",
    "can't survive",
    "life is over",
  ];

  const text = `${thoughtClean} ${likelyClean}`;
  if (catastrophicWords.some((w) => text.includes(w))) return "C";

  // Default
  return "A";
}

export default function ToolRunnerPage() {
  const { sectionId, toolSlug } = useParams();
  const navigate = useNavigate();

  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resultKey, setResultKey] = useState(null);

  // ✅ 1) cargar tool metadata
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/.netlify/functions/get-toolbox-section?slug=${sectionId}`
        );
        if (!res.ok) throw new Error("Failed to load section");

        const json = await res.json();
        const found = json?.tools?.find((t) => t.slug === toolSlug);
        if (!found) throw new Error("Tool not found");

        if (!ignore) setTool(found);
      } catch (e) {
        if (!ignore) setError(e.message || "Error loading tool");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [sectionId, toolSlug]);

  // ✅ 2) al ENTRAR al runner de reality-check => borrar draft + resultado
  useEffect(() => {
    if (toolSlug !== "reality-check") return;
    clearDraft(sectionId, toolSlug);
    setResultKey(null);
  }, [sectionId, toolSlug]);

  function runResult() {
    const draft = readDraft(sectionId, toolSlug);

    const key = pickRealityCheckResponse({
      thought: draft.thought || "",
      against: draft.against || "",
      likely: draft.likely || "",
    });

    setResultKey(key);
  }

  const minutes =
    tool?.estimatedSeconds != null
      ? Math.max(1, Math.ceil(tool.estimatedSeconds / 60))
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col pb-16">
      <Header3PM showMenu />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <button
            type="button"
            onClick={() => navigate(`/tools/${sectionId}`)}
            className="text-[11px] text-slate-400 underline underline-offset-2 hover:text-cyan-300"
          >
            ← Back
          </button>

          {loading ? (
            <p className="text-sm text-slate-400 italic">Loading tool…</p>
          ) : error ? (
            <p className="text-sm text-rose-400">{error}</p>
          ) : tool ? (
            <>
              <section className="space-y-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  {tool.title}
                </h1>

                {tool.subtitle && (
                  <p className="text-sm text-slate-300">{tool.subtitle}</p>
                )}

                {minutes && (
                  <p className="text-[11px] text-slate-500">
                    Takes about {minutes} min
                  </p>
                )}

                {tool.toneLine && (
                  <div className="border-l border-cyan-400/30 pl-3 text-cyan-300 text-sm italic">
                    {tool.toneLine}
                  </div>
                )}
              </section>

              {!resultKey ? (
                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-4 space-y-3">
                  <p className="text-sm text-slate-200">
                    Four quick questions. No therapy cosplay. Just facts vs fear.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    You don’t need to do it perfectly. Just start.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate(`/tools/${sectionId}/${toolSlug}/1`)}
                    className="w-full rounded-xl bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 py-3 text-sm font-medium transition-colors"
                  >
                    Let’s do this
                  </button>
                </section>
              ) : (
                <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                  {resultKey === "A" && (
                    <>
                      <p className="text-sm text-slate-200 font-medium">
                        Here’s what we know:
                      </p>
                      <p className="text-sm text-slate-300">
                        This isn’t certainty — it’s a prediction. And predictions can be wrong.
                      </p>
                    </>
                  )}

                  {resultKey === "B" && (
                    <>
                      <p className="text-sm text-slate-200 font-medium">
                        Quick reality check:
                      </p>
                      <p className="text-sm text-slate-300">
                        Fear is loud. Facts are quiet. You don’t have to believe the thought to move forward.
                      </p>
                    </>
                  )}

                  {resultKey === "C" && (
                    <>
                      <p className="text-sm text-slate-200 font-medium">
                        Apocalypse mode detected.
                      </p>
                      <p className="text-sm text-slate-300">
                        Discomfort is not danger — even when it’s dramatic.
                      </p>
                    </>
                  )}

                  <div className="pt-2 space-y-2">
                    <button
                      type="button"
                      onClick={runResult}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/30 py-3 text-sm text-slate-200 hover:border-slate-600 transition-colors"
                    >
                      Re-check reality
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        clearDraft(sectionId, toolSlug);
                        setResultKey(null);
                        navigate(`/tools/${sectionId}/${toolSlug}/1`);
                      }}
                      className="w-full rounded-xl border border-slate-800 py-3 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      Start fresh
                    </button>
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
