"use client";
import { Surface, Box, Button, Typography } from "@jlopvil/mui-kit";
import type { GameController } from "../engines/use-game";
export function RoundSummary({ game }: { game: GameController }) {
  const { m, round, resultTitle, start, setRound } = game;
  if (!round) return null;
  return (
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
  );
}
