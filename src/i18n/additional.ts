import frLearning from "./fr-learning.json";
import deLearning from "./de-learning.json";
import itLearning from "./it-learning.json";
import jaLearning from "./ja-learning.json";
import frExtras from "./fr-extras.json";
import deExtras from "./de-extras.json";
import itExtras from "./it-extras.json";
import jaExtras from "./ja-extras.json";
import type { BaseLocale, Locale } from "./messages";

export const additionalCopy = {
  fr: { ...frLearning, ...frExtras },
  de: { ...deLearning, ...deExtras },
  it: { ...itLearning, ...itExtras },
  ja: { ...jaLearning, ...jaExtras },
};
export type BaseLocalizedText = Record<BaseLocale, string>;
export function localizeText(text: BaseLocalizedText): Record<Locale, string> {
  const translated = (locale: keyof typeof additionalCopy) => {
    const titles: Record<string, string> = additionalCopy[locale].titles;
    const value = titles[text.en];
    if (!value) throw new Error(`Missing ${locale} title: ${text.en}`);
    return value;
  };
  return {
    ...text,
    fr: translated("fr"),
    de: translated("de"),
    it: translated("it"),
    ja: translated("ja"),
  };
}
