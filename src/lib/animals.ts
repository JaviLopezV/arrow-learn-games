import { japaneseWords } from "./japanese";
export const languages = {
  es: "Español",
  ca: "Català",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
} as const;
export type Language = keyof typeof languages;
export type Mode = "picture" | "translation" | "pronouns" | "matching";
export const animals: { id: string; words: Record<Language, string[]> }[] = [
  {
    id: "cat",
    words: {
      ja: japaneseWords("cat"),
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
      ja: japaneseWords("dog"),
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
      ja: japaneseWords("rabbit"),
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
      ja: japaneseWords("fox"),
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
      ja: japaneseWords("bear"),
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
      ja: japaneseWords("pig"),
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
      ja: japaneseWords("cow"),
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
      ja: japaneseWords("panda"),
      es: ["panda"],
      ca: ["panda"],
      en: ["panda"],
      fr: ["panda"],
      de: ["Panda"],
      it: ["panda"],
    },
  },
  {
    id: "lion",
    words: {
      ja: japaneseWords("lion"),
      es: ["león", "leona"],
      ca: ["lleó", "lleona"],
      en: ["lion", "lioness"],
      fr: ["lion", "lionne"],
      de: ["Löwe", "Löwin"],
      it: ["leone", "leonessa"],
    },
  },
  {
    id: "elephant",
    words: {
      ja: japaneseWords("elephant"),
      es: ["elefante", "elefanta"],
      ca: ["elefant", "elefanta"],
      en: ["elephant"],
      fr: ["éléphant", "éléphante"],
      de: ["Elefant", "Elefantin"],
      it: ["elefante", "elefantessa"],
    },
  },
  {
    id: "giraffe",
    words: {
      ja: japaneseWords("giraffe"),
      es: ["jirafa"],
      ca: ["girafa"],
      en: ["giraffe"],
      fr: ["girafe"],
      de: ["Giraffe"],
      it: ["giraffa"],
    },
  },
  {
    id: "monkey",
    words: {
      ja: japaneseWords("monkey"),
      es: ["mono", "mona"],
      ca: ["mico", "mica"],
      en: ["monkey"],
      fr: ["singe", "guenon"],
      de: ["Affe", "Äffin"],
      it: ["scimmia"],
    },
  },
  {
    id: "sheep",
    words: {
      ja: japaneseWords("sheep"),
      es: ["oveja"],
      ca: ["ovella"],
      en: ["sheep"],
      fr: ["mouton", "brebis"],
      de: ["Schaf"],
      it: ["pecora"],
    },
  },
  {
    id: "horse",
    words: {
      ja: japaneseWords("horse"),
      es: ["caballo", "yegua"],
      ca: ["cavall", "euga"],
      en: ["horse", "mare"],
      fr: ["cheval", "jument"],
      de: ["Pferd", "Stute"],
      it: ["cavallo", "cavalla"],
    },
  },
  {
    id: "duck",
    words: {
      ja: japaneseWords("duck"),
      es: ["pato", "pata"],
      ca: ["ànec", "ànega"],
      en: ["duck"],
      fr: ["canard", "cane"],
      de: ["Ente", "Erpel"],
      it: ["anatra"],
    },
  },
  {
    id: "turtle",
    words: {
      ja: japaneseWords("turtle"),
      es: ["tortuga"],
      ca: ["tortuga"],
      en: ["turtle", "tortoise"],
      fr: ["tortue"],
      de: ["Schildkröte"],
      it: ["tartaruga"],
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
