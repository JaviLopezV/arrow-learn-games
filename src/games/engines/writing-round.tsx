"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Surface,
  Box,
  Button,
  Typography,
  TextField,
  Alert,
} from "@jlopvil/mui-kit";
import { LinearProgress } from "@mui/material";
import { languages } from "@/lib/animals";
import { messages } from "@/i18n/messages";
import { topics } from "../config/topics";
import { exercise } from "../utils/exercises";
import type { GameController } from "./use-game";

export function WritingRound({ game }: { game: GameController }) {
  const {
    m,
    round,
    setRound,
    item,
    locale,
    answer,
    setAnswer,
    input,
    feedbackButton,
    submit,
    next,
  } = game;
  const copy = messages[locale].play;
  const [audioError, setAudioError] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const respond = useRef(game.respond);
  respond.current = game.respond;
  const timed = round?.mode === "speed-round";
  const waiting = round?.result === null;
  useEffect(() => {
    if (!timed || !waiting) return;
    const deadline = Date.now() + 20000;
    setSeconds(20);
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSeconds(left);
      if (!left) {
        clearInterval(timer);
        respond.current("", true);
      }
    }, 200);
    return () => clearInterval(timer);
  }, [timed, waiting, round?.index]);
  useEffect(() => {
    setAudioError(false);
    return () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [round?.index]);
  if (!round || !item) return null;
  const question = exercise(
    round.mode,
    item,
    game.topic.items,
    round.target,
    `${round.id}/${round.index}`,
    round.index,
  );
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
    <Surface
      padding="none"
      sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}
      className="play-panel"
    >
      <Box className="round-header">
        <span>{game.gameTitle(question.kind)}</span>
        <span>
          {m.question} {round.index + 1} {m.of} {round.deck.length}
        </span>
      </Box>
      <LinearProgress
        variant="determinate"
        sx={{ mt: 2, height: 7, borderRadius: 2 }}
        value={
          (100 * (round.index + Number(round.result !== null))) /
          round.deck.length
        }
        aria-label={m.question}
      />
      {timed && (
        <Typography sx={{ mt: 2, fontWeight: 800 }} role="timer">
          ⏱ {seconds} s · {copy.timer}
        </Typography>
      )}
      <Typography component="h3" variant="h5">
        {messages[locale].catalog.modes[question.kind].description}
      </Typography>
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
      {question.clue && (
        <Box sx={{ my: 3, textAlign: "center" }}>
          <Typography
            lang={round.target}
            sx={{ fontSize: 28, overflowWrap: "anywhere", letterSpacing: 2 }}
          >
            {question.clue}
          </Typography>
          <Typography>
            {question.kind === "sentence-context"
              ? copy.missingWord
              : copy.wholeWord}
          </Typography>
        </Box>
      )}
      {question.options.length ? (
        <Box
          role="group"
          aria-label={m.answer}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            my: 3,
          }}
        >
          {question.options.map((option) => (
            <Button
              key={option}
              variant="outlined"
              lang={round.target}
              disabled={round.result !== null}
              onClick={() => game.respond(option)}
              sx={{
                minHeight: 56,
                textTransform: "none",
                overflowWrap: "anywhere",
              }}
            >
              {option}
            </Button>
          ))}
        </Box>
      ) : (
        <Box component="form" onSubmit={submit} className="answer-form">
          <Box className="answer-row">
            <TextField
              inputRef={input}
              id="animal-answer"
              fullWidth
              label={`${m.writeIn} ${languages[round.target]}`}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={m.answer}
              autoComplete="off"
              slotProps={{
                htmlInput: {
                  lang: round.target,
                  autoCorrect: "off",
                  autoCapitalize: "none",
                  spellCheck: false,
                  maxLength: 200,
                  "aria-describedby":
                    round.result !== null ? "answer-feedback" : undefined,
                },
                input: { readOnly: round.result !== null },
              }}
            />
            <Button
              variant="contained"
              type="submit"
              disabled={!answer.trim() || round.result !== null}
            >
              {m.check}
            </Button>
          </Box>
        </Box>
      )}
      {round.result !== null && (
        <Alert
          severity={round.result ? "success" : "warning"}
          id="answer-feedback"
          className={`answer-feedback ${round.result ? "correct" : "incorrect"}`}
          role="status"
        >
          <Typography component="p">
            {round.result ? (
              m.success
            ) : (
              <>
                {m.failure}{" "}
                <strong lang={round.target}>{question.accepted[0]}</strong>
              </>
            )}
          </Typography>
          <Button ref={feedbackButton} variant="contained" onClick={next}>
            {round.index === round.deck.length - 1 ? m.results : m.next} →
          </Button>
        </Alert>
      )}
      <Button
        variant="text"
        sx={{ display: "block", mx: "auto", mt: 2 }}
        onClick={() => setRound(null)}
      >
        {m.change}
      </Button>
    </Surface>
  );
}
