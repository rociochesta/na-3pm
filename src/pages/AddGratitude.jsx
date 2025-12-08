// src/pages/AddGratitude.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCcw, Eraser } from "lucide-react";
import Header3PM from "../components/Header3PM.jsx";

const PROMPTS = [
  "What didn’t emotionally assassinate you today?",
  "What tiny thing kept you from setting everything on fire?",
  "Name one thing that didn’t implode.",
  "What helped you not relapse today?",
  "Something stupidly small you’re still grateful for.",
];

// Generic / NA-friendly gratitude ideas
const SUGGESTIONS = [
  "I didn’t use today, even though my brain held a board meeting about it.",
  "I woke up clean, and apparently that’s allowed now.",
  "I had coffee instead of a breakdown, which feels like spiritual progress.",
  "I said 'no' to something I used to say 'yes' to without thinking.",
  "Someone checked on me, and I didn’t assume they wanted something.",
  "I slept without negotiating with substances. Miracles are weird.",
  "My brain wanted chaos, but I gave it hydration and a chair.",
  "I felt feelings and didn’t explode. Science can’t explain this.",
  "I laughed at something that used to destroy me. That’s evolution.",
  "I ate actual food instead of using adrenaline as a meal replacement.",
  "I reached out before falling apart, which is new behavior for me.",
  "My addiction is offended I’m still alive. That’s kind of hilarious.",
  "I noticed silence didn’t kill me. Turns out it’s just quiet.",
  "I remembered I don’t have to answer every thought that shows up.",
  "I survived a craving without applause, trophies, or cocaine.",
  "I respected a boundary without resenting the person who set it.",
  "I didn’t disappear, even though disappearing felt comfortable.",
  "I realized I’m allowed to rest before I earn it.",
  "I handled something badly, but not destructively. That matters.",
  "I didn’t text someone who belongs in my past. Growth is petty and powerful.",
  "I had a roof over my head, which used to feel optional.",
  "I found reasons to stay when I used to look for exits.",
  "I didn’t try to fix myself in one day. I let time breathe.",
  "My feelings showed up uninvited, and I didn’t evacuate the building.",
  "I wasn’t alone today, even when my brain tried to convince me I was.",
  "I surprised myself by caring, even a little.",
  "I handled a thought without turning it into a catastrophe.",
  "I didn’t search for chaos just because things felt calm.",
  "I lived today instead of surviving it. I didn’t know that was allowed.",
  "I didn’t ask the universe to delete me. That’s a plot twist.",
  "I chose reality instead of nostalgia for destruction.",
  "I didn’t apologize for existing. That feels illegal.",
  "I let someone help me without dying of embarrassment.",
  "I didn’t sabotage a good moment just because I didn’t trust it.",
  "I showed up, even when my brain told me not to.",
  "I didn’t quit on myself, even when it felt pointless.",
  "I gave my future a chance to exist past today.",
  "I didn’t relapse just because I was uncomfortable.",
  "I remembered that not everything is a red flag — some things are just people.",
  "I didn’t use today, which feels rude to my addiction’s expectations.",
  "I drank water like a responsible mammal. Who am I becoming?",
  "I didn’t lose my mind today — just misplaced it for a few hours.",
  "I ate breakfast before overthinking my existence.",
  "I ignored a craving like it was a spam email. Deleted.",
  "I kept my mouth shut in a situation where chaos wanted a sequel.",
  "I remembered deodorant. Recovery has layers.",
  "I didn’t Google my symptoms. I let my anxiety rest.",
  "I left the house and didn’t need a reward or a drug medal.",
  "I sat still for five minutes without filing an emotional complaint.",
  "I survived a feeling without needing a chemical translator.",
  "I didn’t stalk my past today. Let the dead stay dead.",
  "I used my actual phone alarm instead of emotional emergencies.",
  "I said ‘no’ and didn’t internally combust.",
  "I didn’t try to trauma-bond with a stranger. Progress.",
  "I considered running away, but gas prices said no.",
  "I didn’t argue with my brain out loud today. Small win.",
  "I remembered passwords instead of relapsing.",
  "I didn’t spiral over a text bubble. Olympic-level restraint.",
  "I let someone finish their sentence. Revolutionary.",
  "I didn’t mistake boredom for destiny. New behavior unlocked.",
  "I realized not every thought is a subpoena.",
  "I avoided someone who drains my sanity. Health is weird.",
  "I didn’t go looking for red flags. They can find me if they want me that bad.",
  "I found my keys where I left them. Miracles everywhere.",
  "I didn’t apologize for existing in a three-minute conversation.",
  "I used my inside voice even though chaos wanted the mic.",
  "I didn’t compare myself to someone who isn’t me. Unbelievable.",
  "I cooked something that didn’t come from a box. My ancestors are confused.",
  "I survived a phone call without emotionally flatlining.",
  "I didn’t fantasize about moving countries to avoid responsibility.",
  "I sat with discomfort instead of upgrading it to a crisis.",
  "I made a decision without having to scroll through existential dread.",
  "I didn’t mistake hunger for doom. Turns out I just needed lunch.",
  "I let myself laugh without needing a disaster as context.",
  "I didn’t diagnose myself with five new mental illnesses before breakfast.",
  "I avoided a meltdown by blinking aggressively instead of exploding.",
  "I didn’t rehearse conversations that haven't happened yet. My brain is offended.",
  "I let someone care about me without running toward the nearest exit.",
  "I’m grateful I didn’t use today, even though part of me still wanted to.",
  "I’m grateful I stayed alive long enough for things to get slightly less unbearable.",
  "I’m grateful I can feel pain without needing to disappear from it.",
  "I’m grateful I don’t have to lie to everyone just to function anymore.",
  "I’m grateful I no longer wake up wondering if today will be the day I lose everything.",
  "I’m grateful I don’t hate myself as consistently as I used to.",
  "I’m grateful I can admit I was wrong without collapsing into shame.",
  "I’m grateful I don’t have to pretend I’m okay to be accepted.",
  "I’m grateful my cravings don’t control my calendar anymore.",
  "I’m grateful I can be honest without expecting punishment.",
  "I’m grateful I can sit with my thoughts without needing to sedate them.",
  "I’m grateful I know what help feels like, even if I still struggle to ask for it.",
  "I’m grateful I don’t mistake numbness for peace anymore.",
  "I’m grateful I don’t need chaos to feel alive.",
  "I’m grateful I don’t have to earn rest like a hostage negotiation.",
  "I’m grateful that facing myself didn’t kill me, even when it felt like it would.",
  "I’m grateful I can see my patterns before they destroy me.",
  "I’m grateful I don’t have to perform strength to be accepted.",
  "I’m grateful I can tell the difference between love and attention now.",
  "I’m grateful I can feel something other than panic.",
  "I’m grateful for the moments where joy didn’t feel suspicious.",
  "I’m grateful that guilt isn’t my entire personality anymore.",
  "I’m grateful I’m not chasing validation like it's oxygen.",
  "I’m grateful that loneliness doesn’t automatically turn into self-destruction.",
  "I’m grateful I can recognize a boundary before I bleed through it.",
  "I’m grateful I don’t apologize for existing as often.",
  "I’m grateful that silence doesn’t feel like a threat anymore.",
  "I’m grateful I don’t worship my pain like it’s my identity.",
  "I’m grateful that not everything is my fault.",
  "I’m grateful I don’t confuse attention with affection.",
  "I’m grateful that hope didn’t stay dead forever.",
  "I’m grateful that I finally stopped auditioning for people who never chose me.",
  "I’m grateful that my life isn’t just something I survive anymore.",
  "I’m grateful I’m no longer waiting for someone to save me.",
  "I’m grateful that my addiction didn’t get the last word.",
  "I’m grateful I can miss people without disappearing.",
  "I’m grateful that my past no longer predicts my future.",
  "I’m grateful that existing doesn’t feel like a crime.",
  "I'm grateful for the white chip, because admitting I had no control was somehow the most powerful thing I’ve ever done.",
  "I'm grateful I don’t have to explain my crazy — everyone in the room already speaks the language.",
  "I'm grateful for the old-timer whose stories scare me sober.",
  "I'm grateful for slogans that sounded stupid until they kept me alive.",
  "I'm grateful the meeting starts on time, even if my emotions don’t.",
  "I'm grateful I can sit in a room full of strangers and feel more understood than I ever did at home.",
  "I'm grateful the coffee tastes terrible, because it reminds me I’m not here for comfort.",
  "I'm grateful for the newcomer who accidentally tells my story with different words.",
  "I'm grateful for the person who shares exactly what I needed to hear without knowing it.",
  "I'm grateful that ‘just for today’ is the only commitment my brain can handle.",
  "I'm grateful for the parking lot therapy that lasts longer than the meeting.",
  "I'm grateful there’s always someone who laughs at things civilians would call concerning.",
  "I'm grateful for the silence after someone tells the truth — it feels like church without the pews.",
  "I'm grateful I don’t have to earn my seat here. Showing up is enough.",
  "I'm grateful for the chip I swore I’d never get.",
  "I'm grateful for the person who texts me when I disappear before I implode.",
  "I'm grateful that no one in NA expects me to be fine.",
  "I'm grateful for the sponsor who answers the phone even when I don’t know what I’m asking for.",
  "I'm grateful that relapse isn’t the end of my story — just a plot complication.",
  "I'm grateful I learned that God is a concept, not a threat.",
  "I'm grateful I can say 'I don’t know' without feeling stupid.",
  "I'm grateful my pain has subtitles now.",
  "I'm grateful I don’t have to pretend my past was normal.",
  "I'm grateful someone said ‘keep coming back’ before I believed I should.",
  "I'm grateful that Step One didn't kill me, even though it killed my ego.",
  "I'm grateful I learned that asking for help isn’t a personality flaw.",
  "I'm grateful the steps don’t care how broken I think I am.",
  "I'm grateful the room welcomes the version of me I tried to bury.",
  "I'm grateful that laughter in NA sounds like survival.",
  "I'm grateful I found a place where my worst moments are qualifications, not disqualifications.",
  "I'm grateful the meeting ended, but the fellowship didn’t.",
  "I'm grateful someone told me my story isn’t unique — and meant it as comfort.",
  "I'm grateful I don't have to solve my entire life before the closing prayer.",
  "I'm grateful I stopped mistaking self-destruction for personality.",
  "I'm grateful NA gave me people who understand sentences that start with ‘I swear I wasn’t gonna use, but—’",
  "I'm grateful I learned that being vulnerable doesn't mean being disposable.",
  "I'm grateful I finally understand why people clap — it’s not applause, it’s permission to exist.",
  "I'm grateful I didn’t relapse just to prove someone right.",
  "I'm grateful I outlived people’s expectations of me — emotionally and statistically.",
  "I'm grateful I’m getting better while they’re still talking about who I used to be.",
  "I'm grateful I don’t need to destroy myself to get attention anymore.",
  "I'm grateful I didn’t respond to that message my trauma wrote.",
  "I'm grateful I can walk away without needing an audience.",
  "I'm grateful my peace annoys the version of me who loved chaos.",
  "I'm grateful my growth is happening quietly — it confuses the people waiting for my downfall.",
  "I'm grateful I can say ‘no’ without composing a five-paragraph essay about it.",
  "I'm grateful I stopped apologizing for existing. It ruined so many people's plans.",
  "I'm grateful I didn’t shrink myself to make someone else feel comfortable.",
  "I'm grateful my progress is none of the people-pleasers’ business.",
  "I'm grateful I learned that not everyone deserves access to me.",
  "I'm grateful my silence says more than my explanations ever did.",
  "I'm grateful I’m healing in ways that make my past irrelevant.",
  "I'm grateful I don’t panic when I’m not included in things I don’t want to attend.",
  "I'm grateful I no longer confuse being needed with being valued.",
  "I'm grateful I’m no longer addicted to proving myself to people who never mattered.",
  "I'm grateful my boundaries are now wall-mounted and visible.",
  "I'm grateful I don't chase closure that I can give myself.",
  "I'm grateful I don’t argue with people committed to misunderstanding me.",
  "I'm grateful I no longer perform stability for people who prefer me broken.",
  "I'm grateful I let go of people who only loved me when I was losing.",
  "I'm grateful I know the difference between being ignored and being freed.",
  "I'm grateful my phone no longer decides my self-worth.",
  "I'm grateful I don’t need to win arguments I don’t want to be in.",
  "I'm grateful my healing ruined my taste for chaos.",
  "I'm grateful the person I used to be no longer gets a vote.",
  "I'm grateful I didn’t self-destruct just to make a point.",
  "I'm grateful I outgrew people who expected me to relapse.",
  "I'm grateful I finally understand that silence can be a boundary.",
  "I'm grateful I choose my peace over their opinions.",
  "I'm grateful I'm the one who got away — from myself.",
  "I'm grateful I proved my addiction wrong by existing.",
  "I'm grateful I’m becoming someone I would have envied before recovery.",
  "I'm grateful I don’t talk to myself like I'm the enemy anymore.",
  "I'm grateful I finally understand that wanting love doesn't make me weak.",
  "I'm grateful I no longer treat kindness like a trap.",
  "I'm grateful I can accept compliments without needing evidence.",
  "I'm grateful I'm learning to believe people mean it when they say they care.",
  "I'm grateful I stopped confusing being needed with being worthy.",
  "I'm grateful I no longer apologize for existing.",
  "I'm grateful I’m starting to see myself as someone worth staying clean for.",
  "I'm grateful I can take up space without feeling like a problem.",
  "I'm grateful I don’t shrink myself to fit places I’ve outgrown.",
  "I'm grateful I’m not scared of being seen anymore.",
  "I'm grateful I don’t assume everyone is waiting for me to fail.",
  "I'm grateful I can celebrate my progress without downplaying it.",
  "I'm grateful I don’t treat every mistake like a personality flaw.",
  "I'm grateful I'm learning the difference between humility and self-erasure.",
  "I'm grateful I know I don't need to earn my right to be here.",
  "I'm grateful I finally understand that boundaries protect me, not punish me.",
  "I'm grateful I’m becoming someone I trust.",
  "I'm grateful I no longer confuse attention with affection.",
  "I'm grateful I can be honest about my past without making it my identity.",
  "I'm grateful my worth isn’t determined by how much pain I can tolerate.",
  "I'm grateful I can love parts of myself I used to hide.",
  "I'm grateful I stopped calling survival a personality trait.",
  "I'm grateful I don’t chase approval like oxygen.",
  "I'm grateful I know I’m allowed to want things without earning permission.",
  "I'm grateful I don’t disappear when someone gets close.",
  "I'm grateful I’m not terrified of success anymore.",
  "I'm grateful I can imagine a future without bracing for impact.",
  "I'm grateful I'm learning to care about myself without conditions.",
  "I'm grateful that hope didn’t stay dead forever.",
  "I'm grateful I finally understand that who I am is not a mistake.",
  "I'm grateful I'm starting to like the person I’m becoming.",
  "I'm grateful I stopped rehearsing rejection before it happens.",
  "I'm grateful my identity is no longer defined by failure.",
  "I'm grateful I treat myself like a human being now.",
  "I'm grateful I finally know that wanting more doesn’t make me greedy.",
  "I'm grateful I’m allowed to stay.",
  "I'm grateful believing in myself isn’t cringe anymore.",
  "I'm grateful that I don’t disappear from my own life.",
  "I had a bed to sleep in and a roof over my head.",
  "I had food today, and I didn’t have to hustle or lie to get it.",
  "I have clean clothes to wear, and I didn’t have to borrow them.",
  "I have running water, which is something I used to ignore.",
  "I can take a shower whenever I want. That used to be optional.",
  "I have a phone that connects me to people instead of destroying me.",
  "I have a place to sit, sleep, and exist without being chased away.",
  "I woke up in the same place I fell asleep. Stability is underrated.",
  "I have electricity, which means I can cook, charge my phone, and not freeze.",
  "I have access to a bathroom without asking permission.",
  "I didn’t have to wonder where I would sleep tonight.",
  "I have shoes that fit and don’t hurt. My feet are grateful.",
  "I have a fridge with actual food in it. That wasn't always true.",
  "I have a blanket that keeps me warm without strings attached.",
  "I have toothpaste, deodorant, and soap — basic dignity in a bottle.",
  "I have a pillow. My neck finally stopped protesting.",
  "I have cups, plates, and utensils. I’m not eating like a raccoon anymore.",
  "I have Wi-Fi, which keeps me connected to recovery instead of chaos.",
  "I have a door I can close, which means I have safety.",
  "I have time today that wasn't swallowed by addiction.",
  "I have places I can go where nobody wants anything from me.",
  "I have space that belongs to me, even if it's small.",
  "I have heat when it's cold and shade when it's hot. Luxury disguised as normal.",
  "I didn’t have to worry about survival today. That’s not nothing.",
  "I have a pillow, a blanket, and a tomorrow. I never used to plan for that.",
];

// Humor categories (solo estas se muestran)
const FUNNY_CATEGORIES = [
  "Small wins",
  "My brain today",
  "People & other complications",
  "Things that didn’t implode",
  "Reasons I didn’t relapse",
];

// Neutral mapping oculta (por si después quieres sponsor mode / stats)
const NEUTRAL_CATEGORIES = [
  "Something I did right",
  "Something I learned",
  "Someone who showed up",
  "Something that helped",
  "Something that changed",
];

function getRandomPrompt() {
  const idx = Math.floor(Math.random() * PROMPTS.length);
  return PROMPTS[idx];
}

function getRandomSuggestion() {
  const idx = Math.floor(Math.random() * SUGGESTIONS.length);
  return SUGGESTIONS[idx];
}

export default function AddGratitude() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [error, setError] = useState("");
  const [inspo, setInspo] = useState(() => getRandomSuggestion());

  const prompt = useMemo(() => getRandomPrompt(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!text.trim()) {
      setError("Write at least one line. It doesn’t have to be deep.");
      return;
    }

    // 📅 Fecha según zona horaria de Edmonton
    const edmontonNow = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Edmonton" })
    );
    edmontonNow.setHours(0, 0, 0, 0);

    const isoDate = [
      edmontonNow.getFullYear(),
      String(edmontonNow.getMonth() + 1).padStart(2, "0"),
      String(edmontonNow.getDate()).padStart(2, "0"),
    ].join("-");

    let categoryFunny = "Other";
    let category = "Other";

    if (selectedIndex !== null) {
      categoryFunny = FUNNY_CATEGORIES[selectedIndex];
      category = NEUTRAL_CATEGORIES[selectedIndex];
    }

    const entry = {
      id: Date.now().toString(),
      text: text.trim(),
      categoryFunny,
      category,
      date: isoDate,
    };

    try {
      const raw = window.localStorage.getItem("na_gratitudes");
      const list = raw ? JSON.parse(raw) : [];
      const newList = Array.isArray(list) ? [...list, entry] : [entry];
      window.localStorage.setItem("na_gratitudes", JSON.stringify(newList));
    } catch (err) {
      console.error("Error saving gratitude:", err);
      setError("Couldn’t save this one, but it still counts.");
      return;
    }

    // Reset para que puedas seguir agregando
    setText("");
    setSelectedIndex(null);
    setInspo(getRandomSuggestion());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <Header3PM />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 py-6 space-y-5">
          {/* 3PM intro / ritual */}
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 space-y-1">
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
              3PM check-in
            </p>
            <p className="text-xs text-slate-300">
              One sentence that proves you didn&apos;t let your addiction win
              today.
            </p>
          </section>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Textarea card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="gratitudeText"
                  className="block text-xs font-medium uppercase tracking-[0.16em] text-slate-400"
                >
                  What are you grateful for?
                </label>
                <span className="text-[10px] text-slate-500">
                  It can be dumb. It still counts.
                </span>
              </div>

              <div className="relative mt-1">
                <textarea
                  id="gratitudeText"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none pr-9"
                  placeholder={prompt}
                />
                {text.trim() && (
                  <button
                    type="button"
                    onClick={() => setText("")}
                    className="absolute right-2 top-2 text-slate-500 hover:text-rose-300 hover:bg-rose-900/30 p-1 rounded transition-colors"
                    title="Clear text"
                  >
                    <Eraser size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Inspiration box */}
            <section className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Need an idea?
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tap until one feels true. Then tweak it.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setInspo(getRandomSuggestion())}
                  className="p-1.5 rounded-full border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-colors"
                  title="New suggestion"
                >
                  <RefreshCcw size={14} />
                </button>
              </div>

              <p className="text-sm text-slate-100 italic leading-snug">
                “{inspo}”
              </p>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!text.trim()) setText(inspo);
                    else setText((prev) => `${prev}\n${inspo}`);
                  }}
                  className="text-[10px] px-3 py-1 border border-slate-600 rounded-full text-slate-200 hover:border-cyan-400 hover:text-cyan-200 transition-colors"
                >
                  Use this (or edit it)
                </button>
              </div>
            </section>

            {/* Categories as vibe tags */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                  Category (optional)
                </p>
                <span className="text-[10px] text-slate-500">
                  Tag the vibe for future-you.
                </span>
              </div>

        

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FUNNY_CATEGORIES.map((label, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        setSelectedIndex((prev) =>
                          prev === idx ? null : idx
                        )
                      }
                      className={`text-xs rounded-lg border px-3 py-2 text-left transition-colors ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-400/15 text-cyan-100 shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-300/70 hover:text-cyan-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="submit"
                className={`w-full text-sm font-semibold tracking-wide border rounded-xl py-2.5 transition-colors shadow-[0_0_18px_rgba(34,211,238,0.2)] ${
                  text.trim()
                    ? "border-cyan-400 text-cyan-100 bg-cyan-500/10 hover:bg-cyan-400/20"
                    : "border-slate-700 text-slate-400 bg-slate-900 cursor-pointer hover:border-cyan-300/50 hover:text-cyan-200"
                }`}
              >
                Save gratitude
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full text-sm font-semibold tracking-wide border border-slate-600 text-slate-200 rounded-xl py-2.5 hover:bg-slate-800/80 transition-colors"
              >
                Back to home
              </button>
                <button
    type="button"
    onClick={() => navigate("/gratitudes")}
    className="w-full text-[11px] font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
  >
    View & share today&apos;s gratitude list
  </button>
            </div>
          </form>

          <p className="pt-2 text-[11px] text-center text-slate-500">
            This might feel small. Your addiction hates that it still counts.
          </p>
        </div>
      </main>
    </div>
  );
}
