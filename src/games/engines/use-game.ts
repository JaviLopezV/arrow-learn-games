"use client";

import { useEffect, useRef, useState } from "react";
import { messages, type Locale } from "@/i18n/messages";
import { isCorrect, shuffleDeck, type Language } from "@/lib/animals";

import type {
  ContentItem,
  StandardMode as ImplementedMode,
  Topic,
} from "../types/game.types";
import { exercise } from "../utils/exercises";
import type { Round } from "../types/round.types";
import { useGamePersistence } from "./use-game-persistence";

type UseGameOptions = {
  locale: Locale;
  topic: Topic;
  mode: ImplementedMode;
};

export function useGame({ locale, topic, mode }: UseGameOptions) {
  const m = messages[locale].games;
  const [target, setTarget] = useState<Language>(locale === "en" ? "es" : "en");
  const [source, setSource] = useState<Language>(locale);
  const [round, setRound] = useState<Round | null>(null);
  const {
    history,
    ready,
    legacyScore,
    storageError,
    setStorageError,
    saveResult,
    recordAnswer,
  } = useGamePersistence(topic, mode, round);
  const [emptyDeck, setEmptyDeck] = useState(false);
  const [answer, setAnswer] = useState("");
  const locked = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const feedbackButton = useRef<HTMLButtonElement>(null);
  const resultTitle = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (round?.done) resultTitle.current?.focus();
    else if (round?.result !== null && round) feedbackButton.current?.focus();
    else if (round) input.current?.focus();
  }, [round]);

  function start() {
    locked.current = false;
    setAnswer("");
    setEmptyDeck(false);
    let deck: ContentItem[];
    try {
      deck =
        topic.createDeck?.(target, source) ??
        shuffleDeck(topic.items).slice(
          0,
          topic.roundSize ?? topic.items.length,
        );
    } catch {
      setStorageError(true);
      return;
    }
    if (!deck.length) {
      setRound(null);
      setEmptyDeck(true);
      return;
    }
    const fresh: Round = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      deck,
      choices: shuffleDeck(deck),
      matched: [],
      mistakes: [],
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

  function respond(value: string, timedOut = false) {
    if (
      !round ||
      round.done ||
      round.result !== null ||
      locked.current ||
      (!value.trim() && !timedOut)
    )
      return;
    locked.current = true;
    const item = round.deck[round.index];
    const question = exercise(
      round.mode,
      item,
      topic.items,
      round.target,
      `${round.id}/${round.index}`,
      round.index,
    );
    const correct = !timedOut && isCorrect(value, question.accepted);
    recordAnswer(item, correct);
    const updated = {
      ...round,
      result: correct,
      points: round.points + (correct ? 10 : 0),
    };
    setRound(updated);
    saveResult(updated, round.index + 1);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    respond(answer);
  }

  function match(sourceId: string, targetId: string) {
    if (
      !round ||
      (round.mode !== "matching" && round.mode !== "memory") ||
      round.done ||
      locked.current ||
      round.matched.includes(sourceId) ||
      round.matched.includes(targetId)
    )
      return;
    if (sourceId !== targetId) {
      const failedIds =
        round.mode === "memory" ? [sourceId, targetId] : [sourceId];
      for (const id of failedIds) {
        const failed = round.deck.find((item) => item.id === id);
        if (failed) recordAnswer(failed, false);
      }
      setRound({
        ...round,
        mistakes: [...new Set([...round.mistakes, ...failedIds])],
      });
      return;
    }
    locked.current = true;
    const matchedItem = round.deck.find((item) => item.id === sourceId);
    if (matchedItem && !round.mistakes.includes(sourceId))
      recordAnswer(matchedItem, true);
    const answered = round.matched.length + 1;
    const updated = {
      ...round,
      matched: [...round.matched, sourceId],
      points: round.points + (round.mistakes.includes(sourceId) ? 0 : 10),
      index: Math.min(answered, round.deck.length - 1),
      done: answered === round.deck.length,
    };
    setRound(updated);
    saveResult(updated, answered);
    locked.current = false;
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
  const results = history;
  const completedResults = results.filter((result) => result.completed);
  const best = completedResults.length
    ? Math.max(...completedResults.map((result) => result.points))
    : null;
  const item = round?.deck[round.index];
  const gameTitle = (value: ImplementedMode) =>
    messages[locale].catalog.modes[value].title;
  return {
    m,
    emptyDeck,
    respond,
    mode,
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
    match,
    next,
    activeMode,
    results,
    completedResults,
    best,
    item,
    topic,
    locale,
    gameTitle,
  };
}

export type GameController = ReturnType<typeof useGame>;
