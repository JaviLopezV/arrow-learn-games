"use client";

import { useState } from "react";
import Image from "next/image";
import type { Topic } from "@/games/types/game.types";
import type { Locale } from "@/i18n/messages";
import type { Language } from "@/lib/animals";
import { learnCopy } from "./copy";

export function LessonFlashcards({
  topic,
  locale,
  source,
  target,
}: {
  topic: Topic;
  locale: Locale;
  source: Language;
  target: Language;
}) {
  const m = learnCopy[locale];
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const item = topic.items[index];
  return (
    <section className="learn-panel">
      <h3>{m.discover}</h3>
      <p>{m.hint}</p>
      <button
        className={`learn-flashcard ${revealed ? "is-revealed" : ""}`}
        onClick={() => setRevealed(!revealed)}
        aria-expanded={revealed}
        aria-label={revealed ? m.hide : m.reveal}
      >
        {item.emoji && (
          <span className="learn-emoji" aria-hidden="true">
            {item.emoji}
          </span>
        )}
        {item.image && (
          <Image
            src={item.image}
            alt={item.words[source][0]}
            width="100"
            height="100"
          />
        )}
        <small>
          {index + 1} / {topic.items.length}
        </small>
        <strong lang={source}>
          {topic.id === "numbers" ? item.id : item.words[source][0]}
        </strong>
        {item.context && <span>{item.context[locale]}</span>}
        {revealed ? (
          <strong lang={target}>{item.words[target].join(" / ")}</strong>
        ) : (
          <span className="learn-reveal">✦ {m.reveal}</span>
        )}
      </button>
      <div className="learn-controls">
        <button
          className="learn-button"
          disabled={index === 0}
          onClick={() => {
            setIndex(index - 1);
            setRevealed(false);
          }}
        >
          {m.previous}
        </button>
        <button
          className="learn-button"
          disabled={index === topic.items.length - 1}
          onClick={() => {
            setIndex(index + 1);
            setRevealed(false);
          }}
        >
          {m.next}
        </button>
      </div>
    </section>
  );
}
