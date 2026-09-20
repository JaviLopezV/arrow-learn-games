"use client";

import { useEffect, useRef, useState } from "react";
import { messages, type Locale } from "@/i18n/messages";
import {
  isCorrect,
  shuffledAnimals,
  shuffleDeck,
  type Language,
  type Mode,
} from "@/lib/animals";

import { pronouns } from "@/lib/pronouns";

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

export function useAnimalGame({ locale }: { locale: Locale }) {
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
  return {
    m,
    mode,
    setMode,
    target,
    setTarget,
    source,
    setSource,
    ready,
    storageError,
    legacyScore,
    round,
    setRound,
    answer,
    setAnswer,
    input,
    feedbackButton,
    resultTitle,
    start,
    submit,
    next,
    activeMode,
    results,
    completedResults,
    best,
    animal,
    gameTitle,
  };
}

export type GameController = ReturnType<typeof useAnimalGame>;
