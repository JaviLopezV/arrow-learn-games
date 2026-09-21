import type { GameModeDefinition, Topic } from "../types/game.types";
export const gameModes = [
  {
    id: "bingo",
    icon: "🔢",
    skills: ["listening", "recognition"],
    interactionType: "listening",
    status: "available",
  },
  {
    id: "image-to-word",
    icon: "▧",
    skills: ["vocabulary", "writing"],
    interactionType: "visual",
    status: "available",
  },
  {
    id: "translation",
    icon: "Aa ↔",
    skills: ["writing"],
    interactionType: "writing",
    status: "available",
  },
  {
    id: "matching",
    icon: "A ↔ B",
    skills: ["recognition"],
    interactionType: "matching",
    status: "available",
  },
  {
    id: "multiple-choice",
    icon: "✓",
    skills: ["recognition"],
    interactionType: "visual",
    status: "planned",
  },
  {
    id: "complete-word",
    icon: "a_c",
    skills: ["writing"],
    interactionType: "writing",
    status: "planned",
  },
  {
    id: "unscramble",
    icon: "↔",
    skills: ["writing"],
    interactionType: "writing",
    status: "planned",
  },
  {
    id: "listen-and-write",
    icon: "🎧",
    skills: ["listening", "writing"],
    interactionType: "listening",
    status: "planned",
  },
  {
    id: "listen-and-choose",
    icon: "🎧",
    skills: ["listening", "recognition"],
    interactionType: "listening",
    status: "planned",
  },
  {
    id: "memory",
    icon: "▦",
    skills: ["recognition"],
    interactionType: "memory",
    status: "planned",
  },
  {
    id: "speed-round",
    icon: "⚡",
    skills: ["writing"],
    interactionType: "writing",
    status: "planned",
  },
  {
    id: "odd-one-out",
    icon: "◎",
    skills: ["recognition"],
    interactionType: "visual",
    status: "planned",
  },
  {
    id: "sentence-context",
    icon: "…",
    skills: ["grammar"],
    interactionType: "writing",
    status: "planned",
  },
  {
    id: "mixed-review",
    icon: "✦",
    skills: ["vocabulary"],
    interactionType: "mixed",
    status: "planned",
  },
] satisfies GameModeDefinition[];
export function availableModes(topic: Topic) {
  return gameModes.filter(
    (mode) =>
      mode.status === "available" &&
      topic.availableGameModes.includes(mode.id) &&
      topic.items.length > 0 &&
      (mode.id !== "image-to-word" ||
        topic.items.every((item) => Boolean(item.image))),
  );
}
