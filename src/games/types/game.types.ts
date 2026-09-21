import type { Language, Mode } from "@/lib/animals";
import type { Locale } from "@/i18n/messages";
export type LearningArea = "vocabulary" | "grammar" | "phrases";
export type Level = "A1" | "A2" | "B1" | "B2";
export type GameMode =
  | "bingo"
  | "image-to-word"
  | "translation"
  | "matching"
  | "multiple-choice"
  | "complete-word"
  | "unscramble"
  | "listen-and-write"
  | "listen-and-choose"
  | "memory"
  | "speed-round"
  | "odd-one-out"
  | "sentence-context"
  | "mixed-review";
export type StandardMode = "image-to-word" | "translation" | "matching";
export type ImplementedMode = StandardMode | "bingo";
export type LocalizedText = Record<Locale, string>;
export type ContentItem = {
  id: string;
  words: Record<Language, string[]>;
  image?: string;
  context?: LocalizedText;
};
export type Topic = {
  id: string;
  area: LearningArea;
  title: LocalizedText;
  icon: string;
  level: Level;
  items: ContentItem[];
  availableGameModes: ImplementedMode[];
  roundSize?: number;
  createDeck?: () => ContentItem[];
  reference?: "subject-pronouns";
  legacyHistory?: Partial<Record<ImplementedMode, Mode>>;
};
export type GameSelection = {
  topic: string;
  gameMode: GameMode;
  level: Level;
  language: Language;
  source: Language;
};
export type GameModeDefinition = {
  id: GameMode;
  icon: string;
  skills: (
    | "vocabulary"
    | "writing"
    | "recognition"
    | "listening"
    | "grammar"
  )[];
  interactionType:
    | "visual"
    | "writing"
    | "listening"
    | "matching"
    | "memory"
    | "mixed";
} & ({ status: "available"; id: ImplementedMode } | { status: "planned" });
