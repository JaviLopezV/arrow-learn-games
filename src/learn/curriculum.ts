import { extendedTenses } from "@/lib/advanced-tenses";
import { lessons } from "./lessons";

// These stages order the available content; they do not certify a CEFR level.
export const curriculum = [
  { id: "foundations", topics: ["numbers", "animals", "subject-pronouns"] },
  { id: "daily-life", topics: ["food", "home", "clothes", "body"] },
  {
    id: "communication",
    topics: ["present-tense", "transport", "everyday-conversation"],
  },
  {
    id: "time",
    topics: [
      "past-tense",
      "future-tense",
      ...extendedTenses.map((tense) => `${tense.id}-tense`),
    ],
  },
] as const;

export const orderedLessons = curriculum.flatMap((stage) =>
  stage.topics.map((id) => lessons.find((lesson) => lesson.id === id)!),
);
