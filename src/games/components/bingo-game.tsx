"use client";

import { Box, Button, Typography } from "@jlopvil/mui-kit";
import {
  ButtonBase,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { BingoDrawBoard } from "./bingo-draw-board";
import { messages, type Locale } from "@/i18n/messages";
import { languages, type Language } from "@/lib/animals";
import { useBingo, type BingoRound } from "../engines/use-bingo";
import { numberWord } from "@/lib/numbers";

export function BingoGame({ locale }: { locale: Locale }) {
  const m = messages[locale].bingo;
  const {
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
  } = useBingo(locale);
  return (
    <Box
      component="section"
      className="game-session bingo-session"
      aria-labelledby="bingo-title"
    >
      <Box className="games-container">
        <Box component="header" className="section-heading">
          <Box component="span" className="section-kicker">
            1 — 99 · {messages[locale].games.kicker}
          </Box>
          <Typography component="h1" variant="h4" id="bingo-title">
            Bingo
          </Typography>
          <Typography component="p">{m.rules}</Typography>
        </Box>
        <Box className="bingo-tempo">
          <FormControl sx={{ minWidth: 220 }}>
            <InputLabel id="bingo-interval-label">{m.interval}</InputLabel>
            <Select
              labelId="bingo-interval-label"
              id="bingo-interval"
              label={m.interval}
              value={intervalSeconds}
              onChange={(event) =>
                setIntervalSeconds(Number(event.target.value))
              }
            >
              {[3, 5, 8, 10, 15, 20, 30].map((seconds) => (
                <MenuItem key={seconds} value={seconds}>
                  {seconds} {m.seconds}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {!round ? (
          <Paper
            variant="outlined"
            sx={{ borderRadius: "24px", p: { xs: 2.5, sm: 4 } }}
            className="bingo-panel bingo-setup"
          >
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="bingo-language-label">{m.language}</InputLabel>
              <Select
                labelId="bingo-language-label"
                id="bingo-language"
                label={m.language}
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
              >
                {Object.entries(languages).map(([id, name]) => (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" onClick={start}>
              {m.start} →
            </Button>
          </Paper>
        ) : (
          <>
            <Paper
              variant="outlined"
              sx={{ borderRadius: "24px", p: { xs: 2.5, sm: 4 } }}
              className="bingo-panel bingo-call"
            >
              <Box component="span">
                {languages[language]} · {round.marked.length}/15 {m.progress}
              </Box>
              <Typography
                component="div"
                sx={{ fontSize: { xs: 28, sm: 52 }, fontWeight: 800, my: 2 }}
                className="bingo-word"
                lang={language}
                aria-live="polite"
              >
                {won ? "🎉 Bingo!" : numberWord(current!, language)}
              </Typography>
              <Typography component="p">
                {won
                  ? m.win
                  : exhausted
                    ? m.finished
                    : paused
                      ? m.paused
                      : m.hint}
              </Typography>
              <Typography component="p">
                {m.called}: {called.length}/99
              </Typography>
              {!won && (
                <Box className="bingo-actions">
                  <Button variant="outlined" onClick={() => speak(current!)}>
                    ♫ {m.listen}
                  </Button>
                  {!exhausted && (
                    <Button
                      variant="contained"
                      onClick={() => setPaused((value) => !value)}
                    >
                      {paused ? m.resume : m.pause}
                    </Button>
                  )}
                </Box>
              )}
              {audioUnavailable && (
                <Typography component="p" role="status">
                  {m.audio}
                </Typography>
              )}
            </Paper>
            <Box className="bingo-card-heading">
              <Typography component="h2" variant="h5">
                {m.card}
              </Typography>
              <Box component="span">
                {lines > 0 ? `${m.line} ${lines}/3` : "BINGO · 1–99"}
              </Box>
            </Box>
            <BingoCard round={round} won={won} label={m.card} mark={mark} />
            <Typography
              component="p"
              className={`bingo-feedback${wrong ? " bingo-error" : ""}`}
              role="status"
            >
              {wrong
                ? m.wrong
                : won
                  ? m.win
                  : lines > 0
                    ? `${m.line} ${lines}/3`
                    : "\u00a0"}
            </Typography>
            <Box className="bingo-actions">
              <Button variant="outlined" onClick={start}>
                {m.again} ↻
              </Button>
            </Box>
            <BingoDrawBoard
              locale={locale}
              called={called}
              current={current}
              speak={speak}
            />
          </>
        )}
      </Box>
    </Box>
  );
}

function BingoCard({
  round,
  won,
  label,
  mark,
}: {
  round: BingoRound;
  won: boolean;
  label: string;
  mark: (n: number) => void;
}) {
  return (
    <Box className="bingo-card" role="group" aria-label={label}>
      {round.card.map((row, rowIndex) => (
        <Box
          className={`bingo-row${row.every((n) => n === null || round.marked.includes(n)) ? " bingo-line" : ""}`}
          key={rowIndex}
        >
          {row.map((n, col) =>
            n === null ? (
              <Box key={col} className="bingo-empty" aria-hidden="true" />
            ) : (
              <ButtonBase
                key={col}
                className={`bingo-number${round.marked.includes(n) ? " bingo-marked" : ""}`}
                aria-label={String(n)}
                aria-pressed={round.marked.includes(n)}
                disabled={round.marked.includes(n) || won}
                onClick={() => mark(n)}
              >
                {n}
                {round.marked.includes(n) && (
                  <Box
                    component="span"
                    className="bingo-cross"
                    aria-hidden="true"
                  >
                    ×
                  </Box>
                )}
              </ButtonBase>
            ),
          )}
        </Box>
      ))}
    </Box>
  );
}
