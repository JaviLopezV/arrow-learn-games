"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { messages, type Locale } from "@/i18n/messages";
import {
  isCorrect,
  languages,
  shuffledAnimals,
  shuffleDeck,
  type Language,
  type Mode,
} from "@/lib/animals";

import { pronouns, type PronounId } from "@/lib/pronouns";

import {
  emptyHistory,
  gameModes,
  historyKey,
  mergeHistory,
  readHistory,
  type GameHistory,
  type GameResult,
} from "@/lib/game-history";
type Round = {
  id: string;
  startedAt: string;
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
  const [history, setHistory] = useState<GameHistory>(emptyHistory);
  const historyRef = useRef<GameHistory>(emptyHistory());
  const [legacyScore, setLegacyScore] = useState(false);
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
      const loaded = emptyHistory();
      for (const game of gameModes)
        loaded[game] = readHistory(localStorage.getItem(historyKey(game)));
      historyRef.current = loaded;
      setHistory(loaded);
      setLegacyScore(
        localStorage.getItem("arrow-learn-games:score:v1") !== null,
      );
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

  function saveResult(current: Round, answered: number) {
    const result: GameResult = {
      id: current.id,
      startedAt: current.startedAt,
      target: current.target,
      source: current.source,
      points: current.points,
      answered,
      total: current.deck.length,
      completed: answered === current.deck.length,
    };
    let previous = historyRef.current[current.mode];
    try {
      previous = mergeHistory(
        readHistory(localStorage.getItem(historyKey(current.mode))),
        previous,
      );
    } catch {
      setStorageError(true);
    }
    const updated = mergeHistory(previous, [result]);
    historyRef.current = { ...historyRef.current, [current.mode]: updated };
    setHistory(historyRef.current);
    try {
      localStorage.setItem(historyKey(current.mode), JSON.stringify(updated));
    } catch {
      setStorageError(true);
    }
  }

  function start() {
    locked.current = false;
    setAnswer("");
    const fresh: Round = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      deck: mode === "pronouns" ? shuffleDeck(pronouns) : shuffledAnimals(),
      index: 0,
      points: 0,
      result: null,
      done: false,
      mode,
      target,
      source,
    };
    setRound(fresh);
    saveResult(fresh, 0);
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
    const updated = {
      ...round,
      result: correct,
      points: round.points + (correct ? 10 : 0),
    };
    setRound(updated);
    saveResult(updated, round.index + 1);
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

  const activeMode = round?.mode ?? mode;
  const results = history[activeMode];
  const completedResults = results.filter((result) => result.completed);
  const best = completedResults.length
    ? Math.max(...completedResults.map((result) => result.points))
    : null;
  const animal = round?.deck[round.index];
  const gameTitle = (value: Mode) =>
    value === "picture"
      ? m.pictureTitle
      : value === "pronouns"
        ? m.pronounsTitle
        : m.translationTitle;
  return (
    <section id="juegos" className="animal-games" aria-labelledby="games-title">
      <div className="games-container">
        <div className="section-heading">
          <span className="section-kicker">{m.kicker}</span>
          <h2 id="games-title">{m.title}</h2>
          <p>{m.description}</p>
        </div>
        <h3 className="score-game-title">{gameTitle(activeMode)}</h3>
        <div className="score-grid" aria-label={gameTitle(activeMode)}>
          <div>
            <span>{round ? m.roundPoints : m.lastScore}</span>
            <strong>
              {ready ? (round?.points ?? results[0]?.points ?? "—") : "—"}{" "}
              <small>pts</small>
            </strong>
          </div>
          <div>
            <span>{m.bestScore}</span>
            <strong>
              {ready ? (best ?? "—") : "—"} <small>pts</small>
            </strong>
          </div>
          <div>
            <span>{m.completedGames}</span>
            <strong>{ready ? completedResults.length : "—"}</strong>
          </div>
        </div>
        <p className="save-note" role="status">
          {!ready ? m.loading : storageError ? m.storageError : m.saved}
        </p>
        {legacyScore && <p className="save-note">{m.legacyScore}</p>}
        {!round ? (
          <div className="game-setup">
            <fieldset className="mode-picker">
              <legend>{m.choose}</legend>
              {(["picture", "translation", "pronouns"] as const).map(
                (value) => (
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
                      {value === "picture"
                        ? "🐾"
                        : value === "pronouns"
                          ? "Yo ↔ I"
                          : "Aa ↔"}
                    </span>
                    <strong>{gameTitle(value)}</strong>
                    <span>
                      {value === "picture"
                        ? m.pictureDescription
                        : value === "pronouns"
                          ? m.pronounsDescription
                          : m.translationDescription}
                    </span>
                  </label>
                ),
              )}
            </fieldset>
            <div className="game-settings">
              {mode !== "picture" && (
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
            {mode === "pronouns" && (
              <details className="pronoun-reference">
                <summary>{m.pronounsList}</summary>
                <p>{m.pronounsNote}</p>
                <div className="pronoun-table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{m.pronounsContext}</th>
                        <th scope="col">{languages[source]}</th>
                        <th scope="col">{languages[target]}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pronouns.map((pronoun) => (
                        <tr key={pronoun.id}>
                          <th scope="row">{m.pronounContexts[pronoun.id]}</th>
                          <td lang={source}>{pronoun.words[source][0]}</td>
                          <td lang={target}>{pronoun.words[target][0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
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
              <span>{gameTitle(round.mode)}</span>
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
              {round.mode === "picture"
                ? m.picturePrompt
                : round.mode === "pronouns"
                  ? m.pronounsPrompt
                  : m.translationPrompt}
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
                {round.mode === "pronouns" && (
                  <span className="pronoun-context">
                    {m.pronounContexts[animal!.id as PronounId]}
                  </span>
                )}
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
                  {round.index === round.deck.length - 1
                    ? m.results
                    : round.mode === "pronouns"
                      ? m.nextPronoun
                      : m.next}{" "}
                  →
                </button>
              </div>
            )}
            <button className="text-button" onClick={() => setRound(null)}>
              {m.change}
            </button>
          </div>
        )}
        {ready && (
          <section className="game-history" aria-labelledby="history-title">
            <h3 id="history-title">
              {m.historyTitle} · {gameTitle(activeMode)}
            </h3>
            <p className="save-note">{m.historyNote}</p>
            {results.length === 0 ? (
              <p>{m.noGames}</p>
            ) : (
              <div className="history-scroll">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{m.playedAt}</th>
                      <th scope="col">{m.historyLanguage}</th>
                      <th scope="col">{m.resultScore}</th>
                      <th scope="col">{m.correct}</th>
                      <th scope="col">{m.gameStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td>
                          <time dateTime={result.startedAt}>
                            {new Intl.DateTimeFormat(locale, {
                              dateStyle: "short",
                              timeStyle: "short",
                            }).format(new Date(result.startedAt))}
                          </time>
                        </td>
                        <td>
                          {activeMode !== "picture" && (
                            <>{languages[result.source]} → </>
                          )}
                          {languages[result.target]}
                        </td>
                        <td>
                          <strong>
                            {result.points} / {result.total * 10}
                          </strong>{" "}
                          pts
                        </td>
                        <td>
                          {result.points / 10} / {result.answered}
                        </td>
                        <td>
                          {result.completed
                            ? m.finishedGame
                            : round?.id === result.id
                              ? m.activeGame
                              : m.unfinishedGame}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}
