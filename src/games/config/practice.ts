// Practice sessions reuse the same engines and history as topic sessions.
export const practiceShortcuts = [
  { id: "quick", icon: "⚡", strategy: "mixed-review", status: "available" },
  {
    id: "mistakes",
    icon: "🧠",
    strategy: "mistake-review",
    status: "available",
  },
  { id: "daily", icon: "🔥", strategy: "daily-challenge", status: "available" },
  { id: "topic", icon: "🎯", strategy: "topic", status: "available" },
] as const;
