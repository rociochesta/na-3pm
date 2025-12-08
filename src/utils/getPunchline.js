const PUNCHLINES = [
  "Against all odds, you didn’t self-destruct today.",
  "Of all outcomes, you chose this one.",
  "You didn’t use. That’s a plot twist.",
  "Your brain wanted chaos. You chose something else.",
  "That’s not nothing.",
  "You woke up, and didn’t ruin your life yet. Off to a great start.",
  "Congratulations. You’re still here. Statistically improbable, emotionally impressive.",
  "You survived another day without chemically uninstalling yourself.",
  "Still clean. Still confused. Still showing up. That’s the trifecta.",
  "You didn’t disappear today. Progress tastes weird, doesn’t it?",
  "Your brain tried to negotiate chaos again. You said ‘maybe later’. Iconic.",
  "Not using today is the plot twist nobody saw coming. Including you.",
  "Your Higher Power called — they said 'keep doing whatever the hell this is.’",
  "If recovery were easy, you wouldn't be here. But here you are.",
  "The universe didn’t delete you last night. Apparently, you're not done.",
  "You’re clean today. Miracles look suspiciously like decisions.",
  "You didn’t chase oblivion today. That’s emotional cardio.",
  "Your feelings tried to kill you. You stayed. Rude of you. Legendary of you.",
  "You’re proof that disaster can be paused. One day at a time.",
  "You made it another day without outsourcing your personality to substances.",
  "Your addiction hates this app. That’s how you know it’s working.",
  "You don’t need to have hope. Just don’t have a relapse.",
  "Welcome back. Yes, again. That’s how recovery works.",
  "You’re still clean. Your brain is disappointed. We aren’t.",
  "You didn’t implode today. The group chat is proud.",
  "You didn’t relapse. And that’s a sentence nobody expected to read.",
  "Being clean feels impossible until you’ve done it accidentally for 12 days.",
  "If nobody told you today: not using is a flex.",
  "You're not clean by accident. You're clean because chaos got boring.",
  "You’re still here. And that ruins your addiction’s entire business model."

];

export function getPunchline() {
  return PUNCHLINES[Math.floor(Math.random() * PUNCHLINES.length)];
}
