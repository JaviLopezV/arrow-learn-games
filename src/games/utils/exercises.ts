import { isCorrect, type Language } from "@/lib/animals";
import { topics } from "../config/topics";
import { seededShuffle } from "./practice";
import type { ContentItem, StandardMode } from "../types/game.types";

export function exercise(
  mode: StandardMode,
  item: ContentItem,
  pool: ContentItem[],
  target: Language,
  seed: string,
  index: number,
) {
  const kind =
    mode === "mixed-review"
      ? (
          [
            "translation",
            "multiple-choice",
            ...(item.image || item.emoji ? ["image-to-word"] : []),
          ] as StandardMode[]
        )[index % (item.image || item.emoji ? 3 : 2)]
      : mode;
  const word = item.words[target][0];
  let accepted = item.words[target];
  let clue = "";
  let group: string | undefined;
  let options: string[] = [];
  if (kind === "complete-word")
    clue = Array.from(word)
      .map((c, i) => (/\p{L}/u.test(c) && i % 2 === 0 ? "_" : c))
      .join("");
  if (kind === "unscramble") {
    const letters = Array.from(word);
    let scrambled = seededShuffle(letters, seed).join("");
    if (scrambled === word) scrambled = letters.slice(1).join("") + letters[0];
    clue = Array.from(scrambled).join(" · ");
  }
  if (kind === "sentence-context") {
    const words = word.split(" ");
    const hidden = words.findIndex((part, i) => i > 0 && part.length > 2);
    const position = hidden < 0 ? words.length - 1 : hidden;
    accepted = [words[position].replace(/[.!?,;:]/g, "")];
    words[position] = "_____";
    clue = words.join(" ");
  }
  if (kind === "multiple-choice" || kind === "listen-and-choose") {
    const distractors = [
      ...new Set(
        pool.flatMap((candidate) => candidate.words[target].slice(0, 1)),
      ),
    ].filter((value) => !isCorrect(value, accepted));
    options = seededShuffle(
      [word, ...seededShuffle(distractors, seed).slice(0, 3)],
      seed + "/options",
    );
  }
  if (kind === "odd-one-out") {
    const own =
      topics.find((topic) =>
        topic.items.some((candidate) => candidate === item),
      ) ?? topics.find((topic) => topic.id === item.origin?.topic);
    const other = seededShuffle(
      topics.filter(
        (topic) => topic.area === "vocabulary" && topic.id !== own?.id,
      ),
      seed,
    )[0];
    group = other.id;
    const companions = seededShuffle(other.items, seed)
      .map((candidate) => candidate.words[target][0])
      .filter((value) => !isCorrect(value, accepted))
      .slice(0, 3);
    options = seededShuffle([word, ...companions], seed + "/options");
  }
  return { kind, accepted, clue, options, group };
}
