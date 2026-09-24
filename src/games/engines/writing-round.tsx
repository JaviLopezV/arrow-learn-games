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
    gameTitle,
  } = game;
  if (!round) return null;
  return (
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
        {round.mode === "image-to-word" ? m.picturePrompt : m.translationPrompt}
      </Typography>
      {round.mode === "image-to-word" ? (
        <Box className="animal-image">
          {item?.emoji ? (
            <span
              className="vocabulary-emoji"
              role="img"
              aria-label={game.topic.id === "numbers" ? item.id : m.imageAlt}
            >
              {item.emoji}
            </span>
          ) : (
            <Image
              src={item!.image!}
              alt={m.imageAlt}
              width={250}
              height={250}
              priority
            />
          )}
        </Box>
      ) : (
        <Box className="animal-word">
          <Box component="span">{languages[round.source]}</Box>
          {Boolean(item?.context) && (
            <Box component="span" className="pronoun-context">
              {item?.context?.[locale]}
            </Box>
          )}
          <Box component="strong" lang={round.source}>
            {item!.words[round.source][0]}
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
                  {item!.words[round.target][0]}
                </Box>
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
