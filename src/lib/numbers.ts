import type { Language } from "./animals";

const small: Record<Language, string[]> = {
  es: "cero uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciséis diecisiete dieciocho diecinueve veinte veintiuno veintidós veintitrés veinticuatro veinticinco veintiséis veintisiete veintiocho veintinueve".split(
    " ",
  ),
  ca: "zero un dos tres quatre cinc sis set vuit nou deu onze dotze tretze catorze quinze setze disset divuit dinou".split(
    " ",
  ),
  en: "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split(
    " ",
  ),
  fr: "zéro un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize dix-sept dix-huit dix-neuf".split(
    " ",
  ),
  de: "null eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn fünfzehn sechzehn siebzehn achtzehn neunzehn".split(
    " ",
  ),
  it: "zero uno due tre quattro cinque sei sette otto nove dieci undici dodici tredici quattordici quindici sedici diciassette diciotto diciannove".split(
    " ",
  ),
};
const tens: Record<Language, string[]> = {
  es: [
    "",
    "",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ],
  ca: [
    "",
    "",
    "vint",
    "trenta",
    "quaranta",
    "cinquanta",
    "seixanta",
    "setanta",
    "vuitanta",
    "noranta",
  ],
  en: [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ],
  fr: ["", "", "vingt", "trente", "quarante", "cinquante", "soixante"],
  de: [
    "",
    "",
    "zwanzig",
    "dreißig",
    "vierzig",
    "fünfzig",
    "sechzig",
    "siebzig",
    "achtzig",
    "neunzig",
  ],
  it: [
    "",
    "",
    "venti",
    "trenta",
    "quaranta",
    "cinquanta",
    "sessanta",
    "settanta",
    "ottanta",
    "novanta",
  ],
};
export function numberWord(n: number, language: Language): string {
  if (!Number.isInteger(n) || n < 1 || n > 99)
    throw new RangeError("Expected 1–99");
  if (small[language][n]) return small[language][n];
  const unit = n % 10;
  const ten = tens[language][Math.floor(n / 10)];
  if (language === "fr") {
    if (n >= 80)
      return n === 80
        ? "quatre-vingts"
        : `quatre-vingt-${numberWord(n - 80, language)}`;
    if (n >= 70)
      return n === 71
        ? "soixante et onze"
        : `soixante-${numberWord(n - 60, language)}`;
    return (
      ten + (unit === 0 ? "" : unit === 1 ? " et un" : `-${small.fr[unit]}`)
    );
  }
  if (!unit) return ten;
  if (language === "de")
    return `${unit === 1 ? "ein" : small.de[unit]}und${ten}`;
  if (language === "it")
    return `${unit === 1 || unit === 8 ? ten.slice(0, -1) : ten}${unit === 3 ? "tré" : small.it[unit]}`;
  return `${ten}${language === "es" ? " y " : language === "ca" && n < 30 ? "-i-" : "-"}${small[language][unit]}`;
}
export const numbers = Array.from({ length: 99 }, (_, i) => ({
  id: String(i + 1),
  words: Object.fromEntries(
    (Object.keys(small) as Language[]).map((language) => [
      language,
      [numberWord(i + 1, language)],
    ]),
  ) as Record<Language, string[]>,
}));
