import type { ContentItem } from "@/games/types/game.types";
import { food } from "./vocabulary/food";
import { home } from "./vocabulary/home";
import { clothes } from "./vocabulary/clothes";
import { transport } from "./vocabulary/transport";
import { body } from "./vocabulary/body";

// Columns: ID, visual cue, Spanish, Catalan, UK English, French, German, Italian.
// A slash separates accepted synonyms for the same concept.
const rows = { food, home, clothes, transport, body };

export type VocabularyTopic = keyof typeof rows;
export function vocabularyItems(topic: VocabularyTopic): ContentItem[] {
  return rows[topic].map(([id, emoji, es, ca, en, fr, de, it]) => ({
    id,
    emoji,
    words: {
      es: es.split("/"),
      ca: ca.split("/"),
      en: en.split("/"),
      fr: fr.split("/"),
      de: de.split("/"),
      it: it.split("/"),
    },
  }));
}
