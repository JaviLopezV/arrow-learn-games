import type { Language } from "@/lib/animals";
import type { ContentItem, StandardMode } from "./game.types";

export type Round = {
  id: string;
  startedAt: string;
  deck: ContentItem[];
  matched: string[];
  mistakes: string[];
  choices: ContentItem[];
  index: number;
  points: number;
  result: boolean | null;
  done: boolean;
  mode: StandardMode;
  target: Language;
  source: Language;
};
