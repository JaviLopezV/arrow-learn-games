"use client";

import { useEffect, useRef, useState } from "react";
import { mergeHistory, type GameResult } from "@/lib/game-history";
import type { ContentItem, StandardMode, Topic } from "../types/game.types";
import type { Round } from "../types/round.types";
import { loadSessionHistory, sessionHistoryKey } from "../utils/history";
import { saveMistake } from "../utils/practice";

export function useGamePersistence(
  topic: Topic,
  mode: StandardMode,
  round: Round | null,
) {
  const [history, setHistory] = useState<GameResult[]>([]);
  const historyRef = useRef<GameResult[]>([]);
  const [legacyScore, setLegacyScore] = useState(false);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const loaded = loadSessionHistory(localStorage, topic, mode);
      historyRef.current = loaded;
      setHistory(loaded);
      setLegacyScore(
        localStorage.getItem("arrow-learn-games:score:v1") !== null,
      );
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, [topic, mode]);

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
    let previous = historyRef.current;
    try {
      previous = mergeHistory(
        loadSessionHistory(localStorage, topic, current.mode),
        previous,
      );
    } catch {
      setStorageError(true);
    }
    const updated = mergeHistory(previous, [result]);
    historyRef.current = updated;
    setHistory(historyRef.current);
    try {
      localStorage.setItem(
        sessionHistoryKey(topic, current.mode),
        JSON.stringify(updated),
      );
    } catch {
      setStorageError(true);
    }
  }

  function recordAnswer(item: ContentItem, correct: boolean) {
    if (!round) return;
    try {
      saveMistake(
        localStorage,
        topic,
        item,
        round.target,
        round.source,
        correct,
      );
    } catch {
      setStorageError(true);
    }
  }

  return {
    history,
    ready,
    legacyScore,
    storageError,
    setStorageError,
    saveResult,
    recordAnswer,
  };
}
