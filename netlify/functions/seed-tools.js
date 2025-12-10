// netlify/functions/seed-tools.js
import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

const tools = [
  // 🔹 pega aquí tus objetos tal cual (sin comentarios //)
  // ej:
{
    "id": "show-up-early",
    "title": "Show up five minutes early. Don’t think. Just go.",
    "how": [
      "Decide the place.",
      "Leave when the thought says 'you can still stay'.",
      "Arrive early and let reality beat your imagination."
    ],
    "why": "Action gives proof your brain can't argue with.",
    "punchlines": [
     
      "Early is confidence disguised as punctuality."
    ]
  },
  {
    "id": "wait-24",
    "title": "If it feels urgent, wait 24 hours. Chaos hates clocks.",
    "how": [
      "Notice the panic pretending to be a decision.",
      "Give the impulse a bedtime.",
      "Revisit tomorrow and see what survived."
    ],
    "why": "Most emergencies are just your trauma disguised.",
    "punchlines": [
    
      "If it's real, it will still matter tomorrow. If it's not, it won't survive breakfast."
    ]
  },
  {
    "id": "next-controllable",
    "title": "Do the next controllable thing, not the perfect thing.",
    "how": [
      "Pick one small action you can complete today.",
      "Ignore the fantasy version your ego wants applause for.",
      "Finish the real one, not the cinematic one."
    ],
    "why": "Perfection is procrastination with better PR.",
    "punchlines": [
    
    "Progress is ugly, but it moves."
    ]
  },
  {
    "id": "move-body",
    "title": "Move your body. Motion mocks despair.",
    "how": [
      "Pick a direction and move 30 seconds.",
      "Walk, stretch, shake, your brain doesn’t care what.",
      "Stop when your thoughts lose volume."
    ],
    "why": "Stillness amplifies panic; movement breaks the loop.",
    "punchlines": [
      "Your body can save you faster than your thoughts will."
      // ,"The brain follows the body — not the other way around."
    ]
  },
  {
    "id": "boring-task",
    "title": "Do one boring task. Boredom is sobriety without training wheels.",
    "how": [
      "Pick a task no one would brag about.",
      "Do it badly, then finish anyway.",
      "Notice how reality didn’t collapse."
    ],
    "why": "Boring is stability in disguise.",
    "punchlines": [
      "Boredom is peace before you learn the language."
      // ,"Boring is what life feels like when it isn’t killing you."
    ]
  },
  {
    "id": "shoes-door",
    "title": "Put your shoes by the door. Make escape harder.",
    "how": [
      "Leave them ready like you expect a real life.",
      "Treat tomorrow like someone worth showing up for lives there.",
      "Let the visual cue bully your excuses."
    ],
    "why": "Preparation is behavior that predicts belief.",
    "punchlines": [
  
      "Shoes first, motivation later."
    ]
  },
  {
    "id": "delete-number",
    "title": "Delete one number you only call when you’re lonely.",
    "how": [
      "Identify the contact that smells like relapse.",
      "Press delete before your nostalgia votes.",
      "Grieve the access, not the person."
    ],
    "why": "Loneliness is dangerous, but familiarity is lethal.",
    "punchlines": [

      // ,
   "Delete the relapse before it answers."
    ]
  },
  {
    "id": "throw-away-old-life",
    "title": "Throw away something that smells like your old life.",
    "how": [
      "Pick one item tied to a version of you that isn’t invited back.",
      "Put it in the trash, not a shrine.",
      "Notice how your room breathes without it."
    ],
    "why": "The past loses power when you lose storage.",
    "punchlines": [
      "Letting go is cheaper than resurrection."
      // ,"Trash day is spiritual warfare."
    ]
  },
  {
    "id": "slow-one-thing",
    "title": "Do one thing slowly. Your nervous system is not a race.",
    "how": [
      "Pick a task and resist sprint mode.",
      "Match your pace to your breath.",
      "Finish before speed asks for applause."
    ],
    "why": "Slowness is what safety feels like before you trust it.",
    "punchlines": [
      "Slow isn't lazy. it's regulated."
      // ,"Speed is panic pretending to be productivity."
    ]
  },
  {
    "id": "rest-early",
    "title": "Rest before you're exhausted. Prevention is cheaper than collapse.",
    "how": [
      "Stop when your body whispers, not when it screams.",
      "Walk away before resentment clocks in.",
      "Let rest be a decision."
    ],
    "why": "Your nervous system can’t invoice you for maintenance, but it will for repairs.",
    "punchlines": [
      "Stopping early is self-respect, not weakness."
    ]
  },
    {
    "id": "not-today",
    "title": "Say 'not today' to one thing that once owned you.",
    "how": [
      "Identify the habit, person, or idea that feels magnetic and toxic.",
      "Say 'not today' out loud, your brain needs witnesses.",
      "Walk away without justification."
    ],
    "why": "Boundaries take you out of versions of yourself that were dying.",
    "punchlines": [
      "'Not today' is a full sentence in recovery."
    ]
  },
  {
    "id": "donot-answer-traps",
    "title": "Don’t answer messages that feel like traps.",
    "how": [
      "Notice the tension spike when their name appears.",
      "Put the phone down instead of your dignity.",
      "Let silence do the emotional labor."
    ],
    "why": "Not responding is a boundary, not a crime.",
    "punchlines": [
      "Your nervous system is smarter than your nostalgia."
      // ,"Some texts aren't conversations — they're invitations to self-harm."
    ]
  },
  {
    "id": "pause-defense",
    "title": "Pause before you defend yourself. Your worth isn’t on trial.",
    "how": [
      "Feel the urge to explain your existence.",
      "Breathe instead of auditioning innocence.",
      "Respond when calm, or don’t respond at all."
    ],
    "why": "Defensiveness is a trauma reflex pretending to be communication.",
    "punchlines": [
      "You don’t owe anyone your autobiography."
      // ,"Your value doesn’t run on public opinion."
    ]
  },
  {
    "id": "no-essay",
    "title": "Say no without adding an essay.",
    "how": [
      "Replace explanations with clarity.",
      "Remove the apology; keep the boundary.",
      "Let silence be the punctuation."
    ],
    "why": "Essays are fear in paragraphs.",
    "punchlines": [
      "No is a complete sentence, not a TED Talk."
      // ,"Your boundary doesn’t need supporting documentation."
    ]
  },
  {
    "id": "walk-away-thought",
    "title": "Walk away from the thought that wants you dead.",
    "how": [
      "Notice when the thought turns predatory.",
      "Name it: 'that’s a death-thought, not a truth'.",
      "Redirect your body, move, breathe, leave."
    ],
    "why": "Thoughts don’t become laws unless you obey them.",
    "punchlines": [
      "Not every thought deserves custody of your life."
      // ,"Your brain writes horror movies; you don’t have to buy tickets."
    ]
  },
  {
    "id": "exit-room",
    "title": "Exit the room instead of the relationship.",
    "how": [
      "Step out before emotions turn into weapons.",
      "Let the room breathe and your nervous system reset.",
      "Return when your tongue isn’t a blade."
    ],
    "why": "Leaving is regulation, not abandonment.",
    "punchlines": [
      "A closed door can save a connection."
      // ,"Exiting isn’t losing — it’s protecting what’s left."
    ]
  },
  {
    "id": "protect-morning",
    "title": "Protect your morning like it’s medication.",
    "how": [
      "Delay external input for 10 minutes.",
      "Do one thing that belongs to you, not the world.",
      "Let the morning decide the day, not the notifications."
    ],
    "why": "Mornings are emotional operating systems.",
    "punchlines": [

      "Your day doesn’t start when the world wants, it starts when you do."
    ]
  },
  {
    "id": "no-explanations",
    "title": "Don’t explain your boundaries. They are declarations, not debates.",
    "how": [
      "State what you allow.",
      "State what you don’t.",
      "Leave no space for negotiation."
    ],
    "why": "Boundaries don’t require agreement, only consistency.",
    "punchlines": [
      "Your life is not a suggestion box."
      // ,"A boundary with a footnote is a request, not a line."
    ]
  },
  {
    "id": "donot-bleed",
    "title": "Don’t bleed for people who hand you bandages.",
    "how": [
      "Notice who benefits when you collapse.",
      "Save your energy for people who show up, not observe.",
      "Let reciprocity choose your circle."
    ],
    "why": "Care without return is extraction, not love.",
    "punchlines": [
      "Stop mistaking wounds for relationships."
    ]
  },
  {
    "id": "take-space",
    "title": "Take up physical space. Shrinking isn’t humility.",
    "how": [
      "Uncurl your shoulders and uncensor your posture.",
      "Stand like your existence is not a rumor.",
      "Let your body occupy the room it already owns."
    ],
    "why": "Your body teaches your brain what you believe about yourself.",
    "punchlines": [
      "Your posture is your first boundary."
      // ,"Existing at full size is not arrogance — it's accuracy."
    ]
  },
   {
    "id": "visible-date",
    "title": "Write your clean date somewhere visible. Make it harder to forget.",
    "how": [
      "Pick one surface you see daily: mirror, fridge, phone wallpaper.",
      "Write the date without decoration, facts don’t need glitter.",
      "Let it stare at you until your brain learns the story is still happening."
    ],
    "why": "Identity is repetition, not revelation.",
    "punchlines": [
      "Remembering is recovery’s quiet superpower."
      // ,"Dates are tattoos for the soul — yours is still fresh."
    ]
  },
  {
    "id": "mirror-neutral",
    "title": "Look in the mirror once and don’t diagnose yourself.",
    "how": [
      "Stand in front of the mirror like it's not a crime scene.",
      "Notice your face without inventing a label.",
      "Leave before the critic wakes up."
    ],
    "why": "Identity isn’t a medical report, it’s a presence.",
    "punchlines": [
      "You are not a problem that needs solving."
      // ,"Mirrors reflect bodies, not verdicts."
    ]
  },
  {
    "id": "clean-clothes",
    "title": "Wear clean clothes even if nothing feels clean inside.",
    "how": [
      "Pick something washed, not something tragic.",
      "Put it on without waiting to ‘feel like it’.",
      "Let your body experience dignity before your brain approves it."
    ],
    "why": "Behavior upgrades identity faster than belief does.",
    "punchlines": [
      "Clean clothes are self-respect in cotton form."
      // ,"Dress for the life you’re rehearsing, not the one you escaped."
    ]
  },
  {
    "id": "sit-to-stay",
    "title": "Sit like someone who plans to stay.",
    "how": [
      "Put both feet on the ground.",
      "Uncurl your spine like you belong here.",
      "Let your posture tell the truth before your voice can."
    ],
    "why": "The nervous system listens to posture better than promises.",
    "punchlines": [
      "Staying is a posture before it's a choice."
    ]
  },
  {
    "id": "name-not-symptoms",
    "title": "Call yourself by your name, not your symptoms.",
    "how": [
      "Notice when you use labels instead of identity.",
      "Replace diagnosis with your actual name.",
      "Let language return ownership of your life."
    ],
    "why": "Names root identity; labels bury it.",
    "punchlines": [
      "You’re a person, not a side effect."
      // ,"Symptom language is a cage that sounds like self-awareness."
    ]
  },
  {
    "id": "one-new-decision",
    "title": "Let your present self make one decision your past self wouldn’t.",
    "how": [
      "Pick a choice that doesn’t match your old patterns.",
      "Do it without waiting for permission from ghosts.",
      "Let the future inherit the consequence, not the trauma."
    ],
    "why": "Identity forms when action interrupts habit.",
    "punchlines": [
      "You’re not doomed, you’re editable."
      // ,"One new decision is a jailbreak in slow motion."
    ]
  },
  {
    "id": "future-self-choice",
    "title": "Let your future self pick the next move.",
    "how": [
      "Ask: ‘What would a stable version of me do?’",
      "Pick the smallest answer you can execute today.",
      "Act like that person for 30 seconds."
    ],
    "why": "Borrowing identity is sometimes how we build it.",
    "punchlines": [
      "Future-you is already smarter than panic-you."
      // ,"The future is built by impersonation until it becomes real."
    ]
  },
  {
    "id": "becoming-sentence",
    "title": "Say one sentence that belongs to the person you're becoming.",
    "how": [
      "Choose a simple truth you wish were real.",
      "Say it out loud even if it feels fraudulent.",
      "Let the echo be practice, not evidence."
    ],
    "why": "Identity grows through language long before belief.",
    "punchlines": [
      "Sometimes the voice comes before the self."
      // ,"Say it until your nervous system stops laughing."
    ]
  },
  {
    "id": "bridge-day",
    "title": "Treat your day like a bridge, not a verdict.",
    "how": [
      "Stop grading yourself every hour.",
      "Let today be a link, not a scoreboard.",
      "Focus on direction, not evaluation."
    ],
    "why": "Progress is cumulative, judgment isn’t.",
    "punchlines": [
    "Today isn’t the trial. It’s the hallway."
    ]
  },
  {
    "id": "neutral-win",
    "title": "Let neutrality be a win. You don’t need joy to avoid destruction.",
    "how": [
      "Stop expecting fireworks from stability.",
      "Breathe through the boredom instead of upgrading to chaos.",
      "Call a quiet day ‘successful’ without sarcasm."
    ],
    "why": "Neutral is the doorway out of hell, joy is optional, not required.",
    "punchlines": [
      "Neutral isn’t nothing, it’s not dying."
      // ,"Boring days are rehab for your nervous system."
    ]
  },
  
  {
    "id": "craving-out-loud",
    "title": "Tell someone your craving out loud. Secrecy is gasoline.",
    "how": [
      "Say the craving, don’t curate it.",
      "Tell one safe person. Preferably a human, not your notes app.",
      "Let the words exist outside your skull."
    ],
    "why": "Cravings shrink when they meet oxygen.",
    "punchlines": [
      "What you say out loud stops owning you."
      // ,"Addiction hates witnesses."
    ]
  },
  {
    "id": "eat-sugar",
    "title": "Eat sugar instead of the thing that ruins your life.",
    "how": [
      "Pick something sweet, not something lethal.",
      "Give your brain dopamine without collateral damage.",
      "Revisit the craving after your glucose stops screaming."
    ],
    "why": "Your reward system wants relief, not a funeral.",
    "punchlines": [
      "Sugar is cheaper than consequences."
      // ,"Sometimes the craving is just your brain low-balling chemistry."
    ]
  },
  {
    "id": "change-rooms",
    "title": "Change rooms. Geography interrupts obsession.",
    "how": [
      "Stand up before your brain drafts a sequel.",
      "Leave the room like it’s radioactive.",
      "Let a different space break the ritual."
    ],
    "why": "The body moves faster than obsession.",
    "punchlines": [
      "Relapse has a favorite chair, don’t sit in it."
      // ,"Your environment is a script. Exit the scene."
    ]
  },
  {
    "id": "feet-on-ground",
    "title": "Put both feet on the ground. Your body knows reality.",
    "how": [
      "Place your feet flat like you're rebooting.",
      "Notice the floor carrying you.",
      "Let gravity remind you you’re here, not in the craving."
    ],
    "why": "Embodiment is the antidote to fantasy.",
    "punchlines": [
      "Reality begins at the soles of your feet."
      // ,"Your brain lies. Gravity doesn’t."
    ]
  },
  {
    "id": "count-backwards",
    "title": "Count backwards from 10 like you’re defusing a bomb.",
    "how": [
      "Start at 10.",
      "Count slowly enough that panic gets bored.",
      "Notice how your brain loses the plot."
    ],
    "why": "Cravings can’t multitask. Force a system reboot.",
    "punchlines": [
      "Math is kryptonite for obsession."
      // ,"If you can count, you can survive the minute."
    ]
  },
  {
    "id": "sit-through",
    "title": "Sit through the craving without negotiating with it.",
    "how": [
      "Name it: 'a craving is happening'.",
      "Sit still — cravings hate stillness.",
      "Let the urge expire without your signature."
    ],
    "why": "Every craving ends. The question is whether you stay alive for the ending.",
    "punchlines": [
      "You don’t have to fight the craving — just outlive it."
      // ,"Negotiation is relapse in slow motion."
    ]
  },
  {
    "id": "dont-fantasize",
    "title": "Don’t fantasize about what you survived.",
    "how": [
      "Catch the nostalgia before it turns cinematic.",
      "Label the memory: ‘that was death, not romance’.",
      "Return to the present without applause."
    ],
    "why": "Addiction edits memories like a propaganda team.",
    "punchlines": [
      "Your past wasn’t a vibe — it was a trap."
      // ,"Nostalgia is the gateway drug you forgot to list."
    ]
  },
  {
    "id": "physical-distance",
    "title": "Put distance between you and the trigger — physically, not emotionally.",
    "how": [
      "Move away from the object, person, or place.",
      "Don’t justify it to anyone.",
      "Let space do the talking."
    ],
    "why": "Triggers lose power when they lose proximity.",
    "punchlines": [
      "If it can’t reach you, it can’t ruin you."
      // ,"Distance is self-respect measured in meters."
    ]
  },
  {
    "id": "cravings-weather",
    "title": "Let cravings be weather. You don’t have to become the storm.",
    "how": [
      "Notice the urge like a forecast, not a prophecy.",
      "Say: ‘this will pass’, even if you don't believe it.",
      "Do nothing heroic — survive the hour."
    ],
    "why": "Urges are temporary. Consequences aren’t.",
    "punchlines": [
      "Cravings are weather — you’re infrastructure."
      // ,"You are the shelter, not the thunder."
    ]
  },
  {
    "id": "touch-reality",
    "title": "Touch something real. Addiction lives in imagination.",
    "how": [
      "Place your hand on something solid.",
      "Let texture interrupt fantasy.",
      "Return to what's here, not what hurts."
    ],
    "why": "Reality is tactile. Addiction is a hologram.",
    "punchlines": [
      "The world in your hand beats the one in your head."
      // ,"Touch breaks the spell."
    ]
  },
   {
    "id": "name-feeling",
    "title": "Name one feeling without translating it into violence.",
    "how": [
      "Pick the first emotion your body recognizes.",
      "Say the word out loud without adding a story.",
      "Let the feeling exist without punishment."
    ],
    "why": "Naming regulates the nervous system.",
    "punchlines": [
      "Feelings aren’t weapons unless you sharpen them."
      // ,"You can survive an emotion you don’t assault."
    ]
  },
  {
    "id": "cry-no-apology",
    "title": "Cry without apologizing for it.",
    "how": [
      "Let the tear fall without a justification monologue.",
      "Notice the relief, not the embarrassment.",
      "Treat crying like sweating, a function, not evidence."
    ],
    "why": "Tears are pressure valves, not confessions.",
    "punchlines": [
      "Crying is emotional hygiene."
      // ,"Tears aren't weakness — they're exit wounds for pain."
    ]
  },
  {
    "id": "stop-lie",
    "title": "Stop mid-sentence if you realize you’re lying.",
    "how": [
      "Notice the shift from truth to performance.",
      "Pause instead of decorating the lie.",
      "Let silence carry the honesty you can’t say yet."
    ],
    "why": "Stopping is integrity in real time.",
    "punchlines": [
      "Lies rot identity faster than relapse."
      // ,"Your mouth doesn’t have to betray your soul."
    ]
  },
  {
    "id": "let-silence-be",
    "title": "Don’t interpret silence. Let it be silence.",
    "how": [
      "Notice the urge to invent rejection.",
      "Say 'I don’t know what this means' instead of guessing doom.",
      "Let silence exist without being a verdict."
    ],
    "why": "Silence is space, not evidence.",
    "punchlines": [
      "Not every pause is abandonment."
      // ,"Silence isn’t a message — it’s a hallway."
    ]
  },
  {
    "id": "bruise-not-prophecy",
    "title": "Let disappointment be a bruise, not a prophecy.",
    "how": [
      "Acknowledge the sting without forecasting doom.",
      "Keep the pain in today, not forever.",
      "Let healing happen without narrating disaster."
    ],
    "why": "Feeling hurt is honest. Expecting doom is rehearsal.",
    "punchlines": [
      "Not every bruise becomes a scar."
      // ,"Pain doesn’t predict your future — patterns do."
    ]
  },
  {
    "id": "feel-unedited",
    "title": "Feel something without editing it.",
    "how": [
      "Notice the first raw version of the emotion.",
      "Resist adding meaning, diagnosis, or apology.",
      "Let the feeling finish its lifecycle."
    ],
    "why": "Emotions don’t kill, the narratives we attach to them do.",
    "punchlines": [
      "Raw feelings are temporary; edited ones become prisons."
      // ,"Uncensored emotions are survivable."
    ]
  },
  {
    "id": "donot-trust-loneliness",
    "title": "Don’t trust loneliness when it narrates your future.",
    "how": [
      "Catch the story before it becomes scripture.",
      "Label it: 'loneliness is talking'.",
      "Make no decisions until connection visits again."
    ],
    "why": "Loneliness is a terrible narrator — it confuses isolation with destiny.",
    "punchlines": [
      "Loneliness writes fiction like it’s the news."
      // ,"Your future deserves a better narrator."
    ]
  },
  {
    "id": "before-storyline",
    "title": "Notice the moment before sadness becomes a storyline.",
    "how": [
      "Feel the sensation in your body.",
      "Catch the first sentence trying to form meaning.",
      "Choose presence over prophecy."
    ],
    "why": "Sadness is a visitor; stories are leases.",
    "punchlines": [
      "Feeling isn’t fatal — storytelling is."
      // ,"The emotion ends. The narrative repeats."
    ]
  },
  {
    "id": "grief-chair",
    "title": "Give grief a chair instead of a weapon.",
    "how": [
      "Acknowledge the grief without assigning blame.",
      "Let it sit next to you instead of inside you.",
      "Don’t turn loss into ammunition."
    ],
    "why": "Grief becomes violent when it has nowhere to sit.",
    "punchlines": [
      "Grief respected becomes grief finished."
      // ,"A seated grief can’t stab you."
    ]
  },
  {
    "id": "escort-emotions",
    "title": "Don’t fix your emotions — escort them.",
    "how": [
      "Notice the emotion without arresting it.",
      "Walk alongside it without adopting its identity.",
      "Let it exit when it’s done."
    ],
    "why": "Emotions are travelers, not residents.",
    "punchlines": [
      "You’re a host, not a hostage."
      // ,"Escorted emotions don’t become dictators."
    ]
  }, {
    "id": "dont-stalk",
    "title": "Don’t stalk anyone online. Nostalgia is relapse dressed as romance.",
    "how": [
      "Close the app before your brain starts time-traveling.",
      "Name the urge instead of feeding it.",
      "Let the past stay blocked — emotionally or digitally."
    ],
    "why": "Stalking is grief trying to resurrect itself.",
    "punchlines": [
      "The past isn’t a love story — it’s a crime scene."
      // ,"Memory is a bad historian with good lighting."
    ]
  },
  {
    "id": "unplug-30",
    "title": "Unplug for 30 minutes. Sanity hates witnesses.",
    "how": [
      "Turn the phone off, not just silent.",
      "Let boredom detox your nervous system.",
      "Return only when you're choosing, not craving."
    ],
    "why": "Silence is rehab for attention.",
    "punchlines": [
      "Your brain is not a notification center."
      // ,"Peace doesn’t ring. It arrives."
    ]
  },
  {
    "id": "dont-chase-closure",
    "title": "Don’t chase closure. It’s just revenge wearing a tie.",
    "how": [
      "Notice the desire for justification.",
      "Call it what it is — ego shopping for apology.",
      "Walk away before you invoice your dignity."
    ],
    "why": "Closure is self-harm marketed as clarity.",
    "punchlines": [
      "Closure is a fantasy that bills interest."
      // ,"You don’t need closure — you need distance."
    ]
  },
  {
    "id": "throw-relapse-object",
    "title": "Throw out one object that smells like relapse.",
    "how": [
      "Find the item tied to a version of you that didn’t want to live.",
      "Put it in the trash, not storage.",
      "Let space breathe where addiction used to sit."
    ],
    "why": "Relapse has souvenirs. Don’t display them.",
    "punchlines": [
      "Minimalism is relapse prevention with better branding."
      // ,"Objects are anchors — cut the rope."
    ]
  },
  {
    "id": "dont-revisit-drowning",
    "title": "Don’t revisit decisions you made while drowning.",
    "how": [
      "Identify choices built from panic or despair.",
      "Treat them as expired data, not destiny.",
      "Make new decisions from oxygen, not adrenaline."
    ],
    "why": "Trauma-made decisions are survival artifacts, not instructions.",
    "punchlines": [
      "Don’t rebuild your life using underwater blueprints."
      // ,"Drowning wisdom isn’t wisdom — it’s gasping."
    ]
  },
  {
    "id": "close-one-tab",
    "title": "Close one tab in your brain. Clutter is relapse disguised as productivity.",
    "how": [
      "Pick one unfinished thought or task.",
      "Decide: finish it, schedule it, or delete it.",
      "Notice the silence that arrives after completion."
    ],
    "why": "Chaos wears a work badge to get past your defenses.",
    "punchlines": [
      "Your brain isn’t a browser — stop hoarding tabs."
      // ,"Mental clutter is relapse dressed like ambition."
    ]
  },
  {
    "id": "drop-argument",
    "title": "Let go of the argument you’re rehearsing alone.",
    "how": [
      "Notice the imaginary debate.",
      "Ask who you're performing for.",
      "Let the argument die without witnesses."
    ],
    "why": "Rehearsed rage is an addiction to being right.",
    "punchlines": [
      "If the other person isn’t present, you’re not arguing — you’re bleeding."
      // ,"Silence can’t lose an argument."
    ]
  },
  {
    "id": "leave-parasites",
    "title": "Leave people who need you broken to feel whole.",
    "how": [
      "Identify who benefits when you're unwell.",
      "Detach before they invoice your suffering.",
      "Heal without asking for permission."
    ],
    "why": "Some relationships are maintenance plans for your damage.",
    "punchlines": [
      "If your healing upsets them, they weren’t love — they were infrastructure."
      // ,"People who prefer you broken are not your audience."
    ]
  },
  {
    "id": "stop-self-diagnosis",
    "title": "Stop diagnosing yourself. Curiosity beats pathology.",
    "how": [
      "Replace labels with questions.",
      "Observe instead of autopsying your emotions.",
      "Let wonder interrupt certainty."
    ],
    "why": "Self-diagnosis is self-sabotage dressed as insight.",
    "punchlines": [
      "You’re not a puzzle — you’re a process."
      // ,"Curiosity builds futures; pathology freezes them."
    ]
  },
  {
    "id": "chaos-not-personality",
    "title": "Don’t confuse chaos with personality. It’s just familiar.",
    "how": [
      "Notice when disorder feels like home.",
      "Ask who taught you that turbulence meant identity.",
      "Choose calm even if it feels like boredom."
    ],
    "why": "Your nervous system confuses the familiar with the safe.",
    "punchlines": [
      "Chaos isn’t character — it’s residue."
      // ,"Familiar doesn’t mean compatible."
    ]
  }
];

// helper para asignar category_id por posición
function getCategoryId(index) {
  const n = index + 1; // 1–60
  if (n <= 10) return 3;        // Behavior > Feelings
  if (n <= 20) return 4;        // Boundary Practice
  if (n <= 30) return 5;        // Identity In Progress
  if (n <= 40) return 6;        // Craving Interruptions
  if (n <= 50) return 7;        // Emotional Survival
  return 8;                     // 51–60 Anti-Self-Sabotage
}

export const handler = async () => {
  const client = new Client({ connectionString });

  try {
    await client.connect();

    for (let i = 0; i < tools.length; i++) {
      const t = tools[i];
      const categoryId = getCategoryId(i);

      await client.query(
        `
        INSERT INTO tools (id, title, how, why, punchlines, category_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE
        SET title = EXCLUDED.title,
            how = EXCLUDED.how,
            why = EXCLUDED.why,
            punchlines = EXCLUDED.punchlines,
            category_id = EXCLUDED.category_id;
      `,
        [t.id, t.title, t.how, t.why, t.punchlines, categoryId]
      );
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, count: tools.length }),
    };
  } catch (err) {
    console.error("Seed error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  } finally {
    await client.end();
  }
};
