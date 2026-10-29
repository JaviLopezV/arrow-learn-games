import { homeCopy } from "@/i18n/home";
import { compactCopy } from "@/i18n/compact";
import type { Dispatch, SetStateAction } from "react";
import type { Locale } from "@/i18n/messages";
import { languages, type Language } from "@/lib/animals";
import { learnCopy } from "./copy";

type LearningHeaderProps = {
  locale: Locale;
  source: Language;
  target: Language;
  setSource: Dispatch<SetStateAction<Language>>;
  setTarget: Dispatch<SetStateAction<Language>>;
};

export function LearningHeader({
  locale,
  source,
  target,
  setSource,
  setTarget,
}: LearningHeaderProps) {
  const m = learnCopy[locale];
  return (
    <header className="learn-hero">
      <h1>{homeCopy[locale].study}</h1>
      <p>{compactCopy[locale].study}</p>
      <div className="learn-settings">
        <label>
          {m.language}
          <select
            value={target}
            onChange={(event) => {
              const value = event.target.value as Language;
              setTarget(value);
              if (value === source) setSource(target);
            }}
          >
            {Object.entries(languages).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <span aria-hidden="true">↔</span>
        <label>
          {m.source}
          <select
            value={source}
            onChange={(event) => {
              const value = event.target.value as Language;
              setSource(value);
              if (value === target) setTarget(source);
            }}
          >
            {Object.entries(languages).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
