import type { Language } from "./animals";

// Semantic roles keep ambiguous forms (you, sie, nous…) distinguishable.
export const pronouns = [
  {
    id: "firstSingular" as const,
    words: {
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
