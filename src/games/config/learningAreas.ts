import type { LearningArea } from "../types/game.types";
export const learningAreas: { id: LearningArea; icon: string }[] = [
  { id: "vocabulary", icon: "📚" },
  { id: "grammar", icon: "✍️" },
  { id: "phrases", icon: "💬" },
];
export const getArea = (id: string) =>
  learningAreas.find((area) => area.id === id);
