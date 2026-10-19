import es from "./es.json";
import ca from "./ca.json";
import en from "./en.json";

import fr from "./fr.json";
import de from "./de.json";
import it from "./it.json";
import ja from "./ja.json";

export type BaseLocale = "es" | "ca" | "en";
export const locales = ["es", "ca", "en", "fr", "de", "it", "ja"] as const;
export const ogLocales = {
  es: "es_ES",
  ca: "ca_ES",
  en: "en_US",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  ja: "ja_JP",
};
export type Locale = (typeof locales)[number];
export type Messages = typeof es;

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export const messages: Record<Locale, Messages> = {
  es,
  ca,
  en,
  fr,
  de,
  it,
  ja,
};
