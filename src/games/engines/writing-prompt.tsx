"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Alert, Box, Button, Typography } from "@jlopvil/mui-kit";
import { languages } from "@/lib/animals";
import { messages } from "@/i18n/messages";
import { topics } from "../config/topics";
import type { exercise } from "../utils/exercises";
import type { GameController } from "./use-game";

export function WritingPrompt({
  game,
  question,
}: {
  game: GameController;
  question: ReturnType<typeof exercise>;
}) {
  const { m, round, item, locale } = game;
  const copy = messages[locale].play;
  const [audioError, setAudioError] = useState(false);
  useEffect(() => {
    setAudioError(false);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [round?.index]);
  if (!round || !item) return null;
  const audio =
    question.kind === "listen-and-write" ||
    question.kind === "listen-and-choose";
  const visual = question.kind === "image-to-word";
  const category = topics.find((topic) => topic.id === question.group)?.title[
    locale
  ];
  function listen() {
    if (!round || !item) return;
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setAudioError(true);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.words[round.target][0]);
    utterance.lang = {
      es: "es-ES",
      ca: "ca-ES",
      en: "en-GB",
      fr: "fr-FR",
      de: "de-DE",
      it: "it-IT",
    }[round.target];
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((candidate) =>
      candidate.lang.toLowerCase().startsWith(round.target),
    );
    if (voices.length && !voice) {
      setAudioError(true);
      return;
    }
    if (voice) utterance.voice = voice;
    utterance.rate = 0.85;
    utterance.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted")
        setAudioError(true);
    };
    setAudioError(false);
    window.speechSynthesis.speak(utterance);
  }
  return (
    <>
      {audio ? (
        <Box sx={{ my: 3 }}>
          <Button variant="contained" onClick={listen}>
            🔊 {messages[locale].bingo.listen} · {languages[round.target]}
          </Button>
          {audioError && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              {copy.audioUnavailable}
              <Button
                onClick={() => game.respond("", true)}
                disabled={round.result !== null}
              >
                {copy.skip}
              </Button>
            </Alert>
          )}
        </Box>
      ) : visual ? (
        <Box className="animal-image">
          {item.emoji ? (
            <span
              className="vocabulary-emoji"
              role="img"
              aria-label={game.topic.id === "numbers" ? item.id : m.imageAlt}
            >
              {item.emoji}
            </span>
          ) : (
            <Image
              src={item.image!}
              alt={m.imageAlt}
              width={250}
              height={250}
              priority
            />
          )}
        </Box>
      ) : question.kind === "odd-one-out" ? (
        <Typography sx={{ my: 3 }}>
          {copy.outsideGroup} <strong>{category}</strong>
        </Typography>
      ) : (
        <Box className="animal-word">
          <span>{languages[round.source]}</span>
          {item.context && (
            <span className="pronoun-context">{item.context[locale]}</span>
          )}
          <strong lang={round.source}>{item.words[round.source][0]}</strong>
        </Box>
      )}
    </>
  );
}
