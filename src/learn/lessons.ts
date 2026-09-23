import { topics } from "@/games/config/topics";

export const lessons = topics.filter(
  (topic) => topic.items.length && topic.availableGameModes.length,
);
