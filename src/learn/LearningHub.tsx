"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { topics } from "@/games/config/topics";
import type { ContentItem, Topic } from "@/games/types/game.types";
import type { Locale } from "@/i18n/messages";
import { languages, shuffleDeck, type Language } from "@/lib/animals";
import { learnCopy } from "./copy";

const lessons = topics.filter(
  (topic) => topic.items.length && topic.availableGameModes.length,
);
type Progress = Record<string, string[]>;
const storageKey = "arrow-learn-syllabus-v1";

export function LearningHub({ locale }: { locale: Locale }) {
  const m = learnCopy[locale];
  const [target, setTarget] = useState<Language>(locale === "en" ? "es" : "en");
  const [source, setSource] = useState<Language>(locale);
  const [selected, setSelected] = useState(lessons[0].id);
  const [progress, setProgress] = useState<Progress>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(storageKey) || "{}",
      );
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        setProgress(
          Object.fromEntries(
            Object.entries(saved).filter(
              ([, value]) =>
                Array.isArray(value) &&
                value.every((id) => typeof id === "string"),
            ),
          ),
        );
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  function mark(id: string) {
    const key = `${selected}:${source}:${target}`;
    const next = {
      ...progress,
      [key]: [...new Set([...(progress[key] || []), id])],
    };
    setProgress(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(true);
    }
  }
  const topic = lessons.find((lesson) => lesson.id === selected)!;
  return (
    <section className="learn-page">
      <div className="games-container">
        <header className="learn-hero">
          <span className="section-kicker">✦ {m.kicker}</span>
          <h1>{m.title}</h1>
          <p>{m.intro}</p>
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
        <h2>{m.route}</h2>
        <div className="learn-path" aria-label={m.route}>
          {lessons.map((lesson, index) => {
            const count = lesson.items.filter((item) =>
              (progress[`${lesson.id}:${source}:${target}`] || []).includes(
                item.id,
              ),
            ).length;
            return (
              <button
                key={lesson.id}
                className={`learn-topic ${selected === lesson.id ? "is-selected" : ""}`}
                aria-pressed={selected === lesson.id}
                onClick={() => setSelected(lesson.id)}
              >
                <span className="learn-topic-icon" aria-hidden="true">
                  {lesson.icon}
                </span>
                <small>0{index + 1} · A1</small>
                <strong>{lesson.title[locale]}</strong>
                <span>
                  {lesson.items.length} {m.cards} · {count} {m.mastered}
                </span>
                <progress
                  aria-label={`${lesson.title[locale]}: ${m.mastered}`}
                  value={count}
                  max={lesson.items.length}
                />
              </button>
            );
          })}
        </div>
        <p className="learn-save" role="status">
          {storageError ? m.storage : m.saved}
        </p>
        <Lesson
          key={`${selected}:${source}:${target}`}
          topic={topic}
          locale={locale}
          source={source}
          target={target}
          known={progress[`${selected}:${source}:${target}`] || []}
          mark={mark}
          ready={ready}
        />
      </div>
    </section>
  );
}

function Lesson({
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
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [search, setSearch] = useState("");
  const [quiz, setQuiz] = useState<{
    item: ContentItem;
    options: string[];
  } | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const item = topic.items[index];
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
        <section className="learn-panel">
          <h3>{m.discover}</h3>
          <p>{m.hint}</p>
          <button
            className={`learn-flashcard ${revealed ? "is-revealed" : ""}`}
            onClick={() => setRevealed(!revealed)}
            aria-expanded={revealed}
            aria-label={revealed ? m.hide : m.reveal}
          >
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
            <strong lang={source}>{prompt(item)}</strong>
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
