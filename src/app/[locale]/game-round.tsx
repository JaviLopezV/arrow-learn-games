"use client";

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
import type { PronounId } from "@/lib/pronouns";
import type { GameController } from "./use-animal-game";
export function GameRound({ game }: { game: GameController }) {
  const {
    m,
    round,
    setRound,
    animal,
    answer,
    setAnswer,
    input,
    feedbackButton,
    resultTitle,
    start,
    submit,
    next,
    gameTitle,
  } = game;
  if (!round) return null;
  return round.done ? (
    <Surface
      padding="none"
      sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}
      className="play-panel round-summary"
    >
      <Box component="span" className="summary-star" aria-hidden="true">
        ✦
      </Box>
      <Typography component="h3" variant="h5" ref={resultTitle} tabIndex={-1}>
        {m.complete}
      </Typography>
      <Box component="strong" className="round-points">
        {round.points} <Box component="small">pts</Box>
      </Box>
      <Typography component="p">
        {m.roundPoints} · {round.points / 10} / {round.deck.length}{" "}
        {m.correct.toLowerCase()}
      </Typography>
      <Button variant="contained" onClick={start}>
        {m.again}
      </Button>
      <Button
        variant="text"
        sx={{ display: "block", mx: "auto", mt: 2 }}
        onClick={() => setRound(null)}
      >
        {m.change}
      </Button>
    </Surface>
  ) : (
    <Surface
      padding="none"
      sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3 }}
      className="play-panel"
    >
      <Box className="round-header">
        <Box component="span">{gameTitle(round.mode)}</Box>
        <Box component="span">
          {m.question} {round.index + 1} {m.of} {round.deck.length}
        </Box>
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
      <Typography component="h3" variant="h5">
        {round.mode === "picture"
          ? m.picturePrompt
          : round.mode === "pronouns"
            ? m.pronounsPrompt
            : m.translationPrompt}
      </Typography>
      {round.mode === "picture" ? (
        <Box className="animal-image">
          <Image
            src={`/animals/${animal!.id}.svg`}
            alt={m.imageAlt}
            width={250}
            height={250}
            priority
          />
        </Box>
      ) : (
        <Box className="animal-word">
          <Box component="span">{languages[round.source]}</Box>
          {round.mode === "pronouns" && (
            <Box component="span" className="pronoun-context">
              {m.pronounContexts[animal!.id as PronounId]}
            </Box>
          )}
          <Box component="strong" lang={round.source}>
            {animal!.words[round.source][0]}
          </Box>
        </Box>
      )}
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
                maxLength: 80,
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
                <Box component="strong" lang={round.target}>
                  {animal!.words[round.target][0]}
                </Box>
              </>
            )}
          </Typography>
          <Button ref={feedbackButton} variant="contained" onClick={next}>
            {round.index === round.deck.length - 1
              ? m.results
              : round.mode === "pronouns"
                ? m.nextPronoun
                : m.next}{" "}
            →
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
