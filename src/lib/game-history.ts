import { languages, type Language, type Mode } from "./animals";

export const gameModes: Mode[] = ["picture", "translation", "pronouns"];
export type GameResult = {
  id: string;
  startedAt: string;
  target: Language;
  source: Language;
  points: number;
  answered: number;
  total: number;
  completed: boolean;
};
export type GameHistory = Record<Mode, GameResult[]>;
export const emptyHistory = (): GameHistory => ({
  picture: [],
  translation: [],
  pronouns: [],
});
export const historyKey = (mode: Mode) =>
  `arrow-learn-games:history:v2:${mode}`;

export function readHistory(raw: string | null): GameResult[] {
  try {
    const data: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(data)) return [];
    return mergeHistory(
      [],
      data.filter((item): item is GameResult => {
        if (!item || typeof item !== "object") return false;
        const r = item as GameResult;
        return (
          typeof r.id === "string" &&
          r.id.length > 0 &&
          typeof r.startedAt === "string" &&
          Number.isFinite(Date.parse(r.startedAt)) &&
          Object.hasOwn(languages, r.target) &&
          Object.hasOwn(languages, r.source) &&
          Number.isSafeInteger(r.total) &&
          r.total > 0 &&
          Number.isSafeInteger(r.answered) &&
          r.answered >= 0 &&
          r.answered <= r.total &&
          Number.isSafeInteger(r.points) &&
          r.points >= 0 &&
          r.points % 10 === 0 &&
          r.points <= r.answered * 10 &&
          typeof r.completed === "boolean" &&
          r.completed === (r.answered === r.total)
        );
      }),
    );
  } catch {
    return [];
  }
}

export function mergeHistory(
  previous: GameResult[],
  updates: GameResult[],
): GameResult[] {
  const results = new Map(previous.map((result) => [result.id, result]));
  for (const result of updates) {
    const existing = results.get(result.id);
    if (!existing || result.answered >= existing.answered)
      results.set(result.id, result);
  }
  return [...results.values()].sort(
    (a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt),
  );
}
