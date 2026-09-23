"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContentItem, Topic } from "@/games/types/game.types";
import type { Locale } from "@/i18n/messages";
import { shuffleDeck, type Language } from "@/lib/animals";
import { learnCopy } from "./copy";
import { lessons } from "./lessons";
import { LessonFlashcards } from "./LessonFlashcards";

export function Lesson({
  topic,
  locale,
  source,
  target,
  known,
  mark,
  ready,
}: {
  topic: Topic;
  locale: Locale;
  source: Language;
  target: Language;
  known: string[];
  mark: (id: string) => void;
  ready: boolean;
}) {
  const m = learnCopy[locale];
  const [search, setSearch] = useState("");
  const [quiz, setQuiz] = useState<{
    item: ContentItem;
    options: string[];
  } | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const allKnown = topic.items.every((card) => known.includes(card.id));
  function startQuiz() {
    const pending = topic.items.filter(
      (card) => !known.includes(card.id) && card.id !== quiz?.item.id,
    );
    const pool = pending.length
      ? pending
      : topic.items.filter((card) => card.id !== quiz?.item.id);
    const next = shuffleDeck(pool)[0];
    const distractors = [
      ...new Set(
        topic.items
          .filter(
            (card) =>
              !card.words[target].some((word) =>
                next.words[target].includes(word),
              ),
          )
          .map((card) => card.words[target][0]),
      ),
    ];
    setQuiz({
      item: next,
      options: shuffleDeck([
        next.words[target][0],
        ...shuffleDeck(distractors).slice(0, 3),
      ]),
    });
    setAnswer(null);
  }
  const prompt = (card: ContentItem) =>
    topic.id === "numbers" ? card.id : card.words[source][0];
  const filtered = topic.items.filter((card) =>
    `${card.id} ${card.words[source].join(" ")} ${card.words[target].join(" ")} ${card.context?.[locale] || ""}`
      .toLocaleLowerCase()
      .includes(search.trim().toLocaleLowerCase()),
  );
  return (
    <article className="learn-lesson" aria-label={topic.title[locale]}>
      <div className="learn-lesson-heading">
        <h2>
          {topic.icon} {topic.title[locale]}
        </h2>
        <Link
          className="learn-button primary"
          href={`/${locale}/games/${topic.area}/${topic.id}`}
        >
          {m.play} ↗
        </Link>
      </div>
      <aside className="learn-tip">
        <span aria-hidden="true">💡</span>
        <div>
          <p>{m.tips[lessons.findIndex((lesson) => lesson.id === topic.id)]}</p>
          <small>{m.spelling}</small>
        </div>
      </aside>
      <div className="learn-workspace">
        <LessonFlashcards
          topic={topic}
          locale={locale}
          source={source}
          target={target}
        />
        <section className="learn-panel">
          <h3>{m.challenge}</h3>
          {!quiz ? (
            <div className="learn-quiz-intro">
              <span aria-hidden="true">🎯</span>
              <p>{allKnown ? m.complete : m.question}</p>
              <button
                disabled={!ready}
                className="learn-button primary"
                onClick={startQuiz}
              >
                {allKnown ? m.review : m.start}
              </button>
            </div>
          ) : (
            <>
              <p>{m.question}</p>
              <div className="learn-question">
                <strong lang={source}>{prompt(quiz.item)}</strong>
                {quiz.item.context && (
                  <small>{quiz.item.context[locale]}</small>
                )}
              </div>
              <div className="learn-options">
                {quiz.options.map((option) => (
                  <button
                    lang={target}
                    key={option}
                    disabled={answer !== null}
                    className={`learn-button ${answer !== null && option === quiz.item.words[target][0] ? "correct" : answer === option ? "incorrect" : ""}`}
                    onClick={() => {
                      setAnswer(option);
                      if (option === quiz.item.words[target][0])
                        mark(quiz.item.id);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div aria-live="polite">
                {answer !== null && (
                  <div className="learn-feedback">
                    <p>
                      {answer === quiz.item.words[target][0]
                        ? m.correct
                        : m.wrong}
                    </p>
                    <p>
                      {m.answer}:{" "}
                      <strong lang={target}>
                        {quiz.item.words[target].join(" / ")}
                      </strong>
                    </p>
                    {allKnown && <p>🏆 {m.complete}</p>}
                    <button
                      className="learn-button primary"
                      onClick={startQuiz}
                    >
                      {allKnown ? m.review : m.next}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
      <section className="learn-panel learn-library">
        <h3>{m.library}</h3>
        <label className="learn-search">
          {m.search}
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <div className="learn-reference">
          {filtered.map((card) => (
            <div key={card.id}>
              <span lang={source}>{prompt(card)}</span>
              <strong lang={target}>{card.words[target].join(" / ")}</strong>
              {card.context && <small>{card.context[locale]}</small>}
            </div>
          ))}
        </div>
        {!filtered.length && <p>{m.empty}</p>}
      </section>
    </article>
  );
}
