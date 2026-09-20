// Strategies are separate from individual engines so a future session can mix modes.
export const practiceShortcuts = [
  { id: "quick", icon: "⚡", strategy: "mixed-review", status: "planned" },
  { id: "mistakes", icon: "🧠", strategy: "mistake-review", status: "planned" },
  { id: "daily", icon: "🔥", strategy: "daily-challenge", status: "planned" },
  { id: "topic", icon: "🎯", strategy: "topic", status: "available" },
] as const;
