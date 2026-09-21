"use client";
import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/messages";
import type { Language } from "@/lib/animals";
import {
  createBingoCard,
  createBingoDraw,
  canMarkBingoNumber,
  completedLines,
} from "@/lib/bingo";
import { numberWord } from "@/lib/numbers";

export type BingoRound = {
  card: (number | null)[][];
  deck: number[];
  marked: number[];
  index: number;
};
const voiceLocales: Record<Language, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
};

export function useBingo(locale: Locale) {
  const [language, setLanguage] = useState<Language>(locale);
  const [round, setRound] = useState<BingoRound | null>(null);
  const [intervalSeconds, setIntervalSeconds] = useState(5);
  const [paused, setPaused] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [],
  );
  const deck = round?.deck;
  const drawIndex = round?.index;
  const current = round?.deck[round.index];
  const called = round ? round.deck.slice(0, round.index + 1) : [];
  const exhausted = round?.index === 98;
  const won = round?.marked.length === 15;
  const lines = round ? completedLines(round.card, round.marked) : 0;

  const speak = useCallback(
    (n: number) => {
      if (
        !("speechSynthesis" in window) ||
        !("SpeechSynthesisUtterance" in window)
      ) {
        setAudioUnavailable(true);
        return;
      }
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(numberWord(n, language));
      speech.lang = voiceLocales[language];
      speech.rate = 0.8;
      speech.onerror = (event) => {
        if (event.error !== "canceled" && event.error !== "interrupted")
          setAudioUnavailable(true);
      };
      window.speechSynthesis.speak(speech);
    },
    [language],
  );

  useEffect(() => {
    if (current !== undefined && !paused && !won) speak(current);
    else window.speechSynthesis?.cancel();
  }, [current, deck, paused, won, speak]);

  useEffect(() => {
    if (!deck || paused || won || exhausted) return;
    const timer = window.setTimeout(() => {
      setRound((previous) =>
        previous && previous.index < 98
          ? { ...previous, index: previous.index + 1 }
          : previous,
      );
    }, intervalSeconds * 1000);
    return () => window.clearTimeout(timer);
  }, [deck, drawIndex, intervalSeconds, paused, won, exhausted]);
  function start() {
    window.speechSynthesis?.cancel();
    const card = createBingoCard();
    const deck = createBingoDraw();
    setRound({ card, deck, marked: [], index: 0 });
    setWrong(false);
    setAudioUnavailable(false);
    setPaused(false);
  }
  function mark(n: number) {
    if (!round || won || round.marked.includes(n)) return;
    if (!canMarkBingoNumber(n, round.deck, round.index)) {
      setWrong(true);
      return;
    }
    setWrong(false);
    setRound((previous) =>
      previous && !previous.marked.includes(n)
        ? { ...previous, marked: [...previous.marked, n] }
        : previous,
    );
  }
  return {
    language,
    setLanguage,
    round,
    intervalSeconds,
    setIntervalSeconds,
    paused,
    setPaused,
    wrong,
    audioUnavailable,
    current,
    called,
    exhausted,
    won,
    lines,
    speak,
    start,
    mark,
  };
}
