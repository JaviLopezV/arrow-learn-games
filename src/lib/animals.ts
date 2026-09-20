export const languages = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
} as const;
export type Language = keyof typeof languages;
export type Mode = "picture" | "translation" | "pronouns" | "matching";
export const animals: { id: string; words: Record<Language, string[]> }[] = [
  {
    id: "cat",
    words: {
      es: ["gato", "gata"],
      ca: ["gat", "gata"],
      en: ["cat"],
      fr: ["chat", "chatte"],
      de: ["Katze", "Kater"],
      it: ["gatto", "gatta"],
    },
  },
  {
    id: "dog",
    words: {
      es: ["perro", "perra"],
      ca: ["gos", "gossa"],
      en: ["dog"],
      fr: ["chien", "chienne"],
      de: ["Hund", "Hündin"],
      it: ["cane", "cagna"],
    },
  },
  {
    id: "rabbit",
    words: {
      es: ["conejo", "coneja"],
      ca: ["conill", "conilla"],
      en: ["rabbit", "bunny"],
      fr: ["lapin", "lapine"],
      de: ["Kaninchen"],
      it: ["coniglio", "coniglia"],
    },
  },
  {
    id: "fox",
    words: {
      es: ["zorro", "zorra"],
      ca: ["guineu"],
      en: ["fox"],
      fr: ["renard", "renarde"],
      de: ["Fuchs", "Füchsin"],
      it: ["volpe"],
    },
  },
  {
    id: "bear",
    words: {
      es: ["oso", "osa"],
      ca: ["ós", "ossa"],
      en: ["bear"],
      fr: ["ours", "ourse"],
      de: ["Bär", "Bärin"],
      it: ["orso", "orsa"],
    },
  },
  {
    id: "pig",
    words: {
      es: ["cerdo", "cerda"],
      ca: ["porc", "truja"],
      en: ["pig"],
      fr: ["cochon", "cochonne", "porc"],
      de: ["Schwein"],
      it: ["maiale", "scrofa"],
    },
  },
  {
    id: "cow",
    words: {
      es: ["vaca"],
      ca: ["vaca"],
      en: ["cow"],
      fr: ["vache"],
      de: ["Kuh"],
      it: ["mucca", "vacca"],
    },
  },
  {
    id: "panda",
    words: {
      es: ["panda"],
      ca: ["panda"],
      en: ["panda"],
      fr: ["panda"],
      de: ["Panda"],
      it: ["panda"],
    },
  },
];
export function normalizeAnswer(value: string) {
  return value.normalize("NFC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
}
export function isCorrect(answer: string, accepted: string[]) {
  return accepted.some(
    (word) => normalizeAnswer(word) === normalizeAnswer(answer),
  );
}
export function shuffleDeck<T>(items: readonly T[]): T[] {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function shuffledAnimals() {
  return shuffleDeck(animals);
}
