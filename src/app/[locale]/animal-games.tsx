"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { messages, type Locale } from "@/i18n/messages";
import {
  addAnswer,
  emptyScore,
  isCorrect,
  languages,
  readScore,
  shuffledAnimals,
  type Language,
  type Mode,
  type Score,
} from "@/lib/animals";

const storageKey = "arrow-learn-games:score:v1";
type Round = {
  deck: ReturnType<typeof shuffledAnimals>;
  index: number;
  points: number;
  result: boolean | null;
  done: boolean;
  mode: Mode;
  target: Language;
  source: Language;
};

export function AnimalGames({ locale }: { locale: Locale }) {
  const m = messages[locale].games;
  const [mode, setMode] = useState<Mode>("picture");
  const [target, setTarget] = useState<Language>(locale === "en" ? "es" : "en");
  const [source, setSource] = useState<Language>(locale);
  const [score, setScore] = useState<Score>(emptyScore);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [round, setRound] = useState<Round | null>(null);
  const [answer, setAnswer] = useState("");
  const locked = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const feedbackButton = useRef<HTMLButtonElement>(null);
  const resultTitle = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    try {
      setScore(readScore(localStorage.getItem(storageKey)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (round?.done) resultTitle.current?.focus();
    else if (round?.result !== null && round) feedbackButton.current?.focus();
    else if (round) input.current?.focus();
  }, [round]);

  function start() {
    locked.current = false;
    setAnswer("");
    setRound({
      deck: shuffledAnimals(),
      index: 0,
      points: 0,
      result: null,
      done: false,
      mode,
      target,
      source,
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (
      !round ||
      round.done ||
      round.result !== null ||
      !answer.trim() ||
      locked.current
    )
      return;
    locked.current = true;
    const correct = isCorrect(
      answer,
      round.deck[round.index].words[round.target],
    );
    let previous = score;
    try {
      if (!storageError) previous = readScore(localStorage.getItem(storageKey));
    } catch {
      setStorageError(true);
    }
    const updated = addAnswer(previous, correct);
    setScore(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {
      setStorageError(true);
    }
    setRound({
      ...round,
      result: correct,
      points: round.points + (correct ? 10 : 0),
    });
  }

  function next() {
    if (!round || round.result === null) return;
    if (round.index === round.deck.length - 1)
      setRound({ ...round, done: true });
    else {
      locked.current = false;
      setAnswer("");
      setRound({ ...round, index: round.index + 1, result: null });
    }
  }

  const animal = round?.deck[round.index];
  return (
    <section id="juegos" className="animal-games" aria-labelledby="games-title">
      <div className="games-container">
        <div className="section-heading">
          <span className="section-kicker">{m.kicker}</span>
          <h2 id="games-title">{m.title}</h2>
          <p>{m.description}</p>
        </div>
        <div className="score-grid" aria-label={m.points}>
          <div>
            <span>{m.points}</span>
            <strong>
              {ready ? score.points : "—"} <small>pts</small>
            </strong>
          </div>
          <div>
            <span>{m.correct}</span>
            <strong>
              {ready ? `${score.correct} / ${score.attempts}` : "—"}
            </strong>
          </div>
          <div>
            <span>{m.best}</span>
            <strong>
              {ready ? score.bestStreak : "—"} <small>✦</small>
            </strong>
          </div>
        </div>
        <p className="save-note" role="status">
          {!ready ? m.loading : storageError ? m.storageError : m.saved}
        </p>
        {!round ? (
          <div className="game-setup">
            <fieldset className="mode-picker">
              <legend>{m.choose}</legend>
              {(["picture", "translation"] as const).map((value) => (
                <label
                  key={value}
                  className={`mode-option ${mode === value ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="game-mode"
                    checked={mode === value}
                    onChange={() => setMode(value)}
                  />
                  <span className="mode-symbol" aria-hidden="true">
                    {value === "picture" ? "🐾" : "Aa ↔"}
                  </span>
                  <strong>
                    {value === "picture" ? m.pictureTitle : m.translationTitle}
                  </strong>
                  <span>
                    {value === "picture"
                      ? m.pictureDescription
                      : m.translationDescription}
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="game-settings">
              {mode === "translation" && (
                <label>
                  {m.source}
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as Language)}
                  >
                    {Object.entries(languages)
                      .filter(([key]) => key !== target)
                      .map(([key, name]) => (
                        <option key={key} value={key}>
                          {name}
                        </option>
                      ))}
                  </select>
                </label>
              )}
              <label>
                {m.target}
                <select
                  value={target}
                  onChange={(e) => {
                    const value = e.target.value as Language;
                    setTarget(value);
                    if (value === source) setSource(target);
                  }}
                >
                  {Object.entries(languages).map(([key, name]) => (
                    <option key={key} value={key}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <button className="play-button" onClick={start} disabled={!ready}>
                {m.start} <span aria-hidden="true">↗</span>
              </button>
            </div>
            <p className="game-rules">{m.rules}</p>
          </div>
        ) : round.done ? (
          <div className="play-panel round-summary">
            <span className="summary-star" aria-hidden="true">
              ✦
            </span>
            <h3 ref={resultTitle} tabIndex={-1}>
              {m.complete}
            </h3>
            <strong className="round-points">
              {round.points} <small>pts</small>
            </strong>
            <p>
              {m.roundPoints} · {round.points / 10} / {round.deck.length}{" "}
              {m.correct.toLowerCase()}
            </p>
            <button className="play-button" onClick={start}>
              {m.again}
            </button>
            <button className="text-button" onClick={() => setRound(null)}>
              {m.change}
            </button>
          </div>
        ) : (
          <div className="play-panel">
            <div className="round-header">
              <span>
                {round.mode === "picture" ? m.pictureTitle : m.translationTitle}
              </span>
              <span>
                {m.question} {round.index + 1} {m.of} {round.deck.length}
              </span>
            </div>
            <progress
              value={round.index + Number(round.result !== null)}
              max={round.deck.length}
              aria-label={m.question}
            />
            <h3>
              {round.mode === "picture" ? m.picturePrompt : m.translationPrompt}
            </h3>
            {round.mode === "picture" ? (
              <div className="animal-image">
                <Image
                  src={`/animals/${animal!.id}.svg`}
                  alt={m.imageAlt}
                  width={250}
                  height={250}
                  priority
                />
              </div>
            ) : (
              <div className="animal-word">
                <span>{languages[round.source]}</span>
                <strong lang={round.source}>
                  {animal!.words[round.source][0]}
                </strong>
              </div>
            )}
            <form onSubmit={submit} className="answer-form">
              <label htmlFor="animal-answer">
                {m.writeIn} <strong>{languages[round.target]}</strong>
              </label>
              <div className="answer-row">
                <input
                  ref={input}
                  id="animal-answer"
                  lang={round.target}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={m.answer}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  readOnly={round.result !== null}
                  maxLength={80}
                  aria-describedby={
                    round.result !== null ? "answer-feedback" : undefined
                  }
                />
                <button
                  className="play-button"
                  type="submit"
                  disabled={!answer.trim() || round.result !== null}
                >
                  {m.check}
                </button>
              </div>
            </form>
            {round.result !== null && (
              <div
                id="answer-feedback"
                className={`answer-feedback ${round.result ? "correct" : "incorrect"}`}
                role="status"
              >
                <p>
                  {round.result ? (
                    m.success
                  ) : (
                    <>
                      {m.failure}{" "}
                      <strong lang={round.target}>
                        {animal!.words[round.target][0]}
                      </strong>
                    </>
                  )}
                </p>
                <button
                  ref={feedbackButton}
                  className="play-button"
                  onClick={next}
                >
                  {round.index === round.deck.length - 1 ? m.results : m.next} →
                </button>
              </div>
            )}
            <button className="text-button" onClick={() => setRound(null)}>
              {m.change}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
