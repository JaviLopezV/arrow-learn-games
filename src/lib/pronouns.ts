import { japaneseWords } from "./japanese";
import type { Language } from "./animals";

// Semantic roles keep ambiguous forms (you, sie, nous…) distinguishable.
export const pronouns = [
  {
    id: "firstSingular" as const,
    words: {
      ja: japaneseWords("firstSingular"),
      es: ["yo"],
      ca: ["jo"],
      en: ["I"],
      fr: ["je", "j’", "j'"],
      de: ["ich"],
      it: ["io"],
    },
  },
  {
    id: "secondSingular" as const,
    words: {
      ja: japaneseWords("secondSingular"),
      es: ["tú", "vos"],
      ca: ["tu"],
      en: ["you"],
      fr: ["tu"],
      de: ["du"],
      it: ["tu"],
    },
  },
  {
    id: "thirdMasculine" as const,
    words: {
      ja: japaneseWords("thirdMasculine"),
      es: ["él"],
      ca: ["ell"],
      en: ["he"],
      fr: ["il"],
      de: ["er"],
      it: ["lui", "egli"],
    },
  },
  {
    id: "thirdFeminine" as const,
    words: {
      ja: japaneseWords("thirdFeminine"),
      es: ["ella"],
      ca: ["ella"],
      en: ["she"],
      fr: ["elle"],
      de: ["sie"],
      it: ["lei", "ella"],
    },
  },
  {
    id: "firstPluralMasculine" as const,
    words: {
      ja: japaneseWords("firstPluralMasculine"),
      es: ["nosotros"],
      ca: ["nosaltres"],
      en: ["we"],
      fr: ["nous"],
      de: ["wir"],
      it: ["noi"],
    },
  },
  {
    id: "firstPluralFeminine" as const,
    words: {
      ja: japaneseWords("firstPluralFeminine"),
      es: ["nosotras"],
      ca: ["nosaltres"],
      en: ["we"],
      fr: ["nous"],
      de: ["wir"],
      it: ["noi"],
    },
  },
  {
    id: "secondPluralMasculine" as const,
    words: {
      ja: japaneseWords("secondPluralMasculine"),
      es: ["vosotros", "ustedes"],
      ca: ["vosaltres"],
      en: ["you"],
      fr: ["vous"],
      de: ["ihr"],
      it: ["voi"],
    },
  },
  {
    id: "secondPluralFeminine" as const,
    words: {
      ja: japaneseWords("secondPluralFeminine"),
      es: ["vosotras", "ustedes"],
      ca: ["vosaltres"],
      en: ["you"],
      fr: ["vous"],
      de: ["ihr"],
      it: ["voi"],
    },
  },
  {
    id: "thirdPluralMasculine" as const,
    words: {
      ja: japaneseWords("thirdPluralMasculine"),
      es: ["ellos"],
      ca: ["ells"],
      en: ["they"],
      fr: ["ils"],
      de: ["sie"],
      it: ["loro", "essi"],
    },
  },
  {
    id: "thirdPluralFeminine" as const,
    words: {
      ja: japaneseWords("thirdPluralFeminine"),
      es: ["ellas"],
      ca: ["elles"],
      en: ["they"],
      fr: ["elles"],
      de: ["sie"],
      it: ["loro", "esse"],
    },
  },
  {
    id: "formalSingular" as const,
    words: {
      ja: japaneseWords("formalSingular"),
      es: ["usted"],
      ca: ["vostè"],
      en: ["you"],
      fr: ["vous"],
      de: ["Sie"],
      it: ["Lei"],
    },
  },
  {
    id: "formalPlural" as const,
    words: {
      ja: japaneseWords("formalPlural"),
      es: ["ustedes"],
      ca: ["vostès"],
      en: ["you"],
      fr: ["vous"],
      de: ["Sie"],
      it: ["voi", "Loro"],
    },
  },
] satisfies { id: string; words: Record<Language, string[]> }[];
export type PronounId = (typeof pronouns)[number]["id"];
