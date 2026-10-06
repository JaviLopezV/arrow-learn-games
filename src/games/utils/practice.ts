import { languages, shuffleDeck, type Language } from "@/lib/animals";
import type { ContentItem, Topic } from "../types/game.types";

export const mistakeKey = "arrow-learn-games:mistakes:v1";
export type Mistake = {
  area: string;
  topic: string;
  item: string;
  target: Language;
  source: Language;
};
const identity = (entry: Mistake) =>
  JSON.stringify([
    entry.area,
    entry.topic,
    entry.item,
    entry.target,
    entry.source,
  ]);
export function readMistakes(raw: string | null): Mistake[] {
  try {
    const data: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.filter(
      (value): value is Mistake =>
        value &&
        typeof value.area === "string" &&
        typeof value.topic === "string" &&
        typeof value.item === "string" &&
        Object.hasOwn(languages, value.target) &&
        Object.hasOwn(languages, value.source),
    );
  } catch {
    return [];
  }
}
export function updateMistakes(
  entries: Mistake[],
  entry: Mistake,
  correct: boolean,
) {
  const remaining = entries.filter(
    (value) => identity(value) !== identity(entry),
  );
  return correct ? remaining : [...remaining, entry];
}
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let state = 2166136261;
  for (const char of seed)
    state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const j = (state >>> 0) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function practiceItems(topics: Topic[]): ContentItem[] {
  return topics.flatMap((topic) =>
    topic.items.map((item) => ({
      ...item,
      id: `${topic.area}/${topic.id}/${item.id}`,
      origin: { area: topic.area, topic: topic.id, item: item.id },
    })),
  );
}
export function practiceDeck(
  topics: Topic[],
  strategy: string,
  target: Language,
  source: Language,
  mistakes: Mistake[] = [],
  day = localDay(),
) {
  const items = practiceItems(topics);
  if (strategy === "mistakes")
    return shuffleDeck(
      items.filter((item) =>
        mistakes.some(
          (m) =>
            m.area === item.origin!.area &&
            m.topic === item.origin!.topic &&
            m.item === item.origin!.item &&
            m.target === target &&
            m.source === source,
        ),
      ),
    ).slice(0, 8);
  // Sample topics first so the 99 numbers cannot dominate mixed practice.
  const order =
    strategy === "daily" ? seededShuffle(topics, day) : shuffleDeck(topics);
  return order.slice(0, 8).map((topic) => {
    const pool = items.filter((item) => item.origin!.topic === topic.id);
    return (
      strategy === "daily"
        ? seededShuffle(pool, `${day}/${topic.id}`)
        : shuffleDeck(pool)
    )[0];
  });
}

export function saveMistake(
  storage: Pick<Storage, "getItem" | "setItem">,
  topic: Topic,
  item: ContentItem,
  target: Language,
  source: Language,
  correct: boolean,
) {
  const origin = item.origin ?? {
    area: topic.area,
    topic: topic.id,
    item: item.id,
  };
  const entries = readMistakes(storage.getItem(mistakeKey));
  storage.setItem(
    mistakeKey,
    JSON.stringify(
      updateMistakes(entries, { ...origin, target, source }, correct),
    ),
  );
}
