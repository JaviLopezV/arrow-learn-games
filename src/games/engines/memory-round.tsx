"use client";
import { useState } from "react";
import { Alert, Box, Button, Surface, Typography } from "@jlopvil/mui-kit";
import { languages } from "@/lib/animals";
import { messages } from "@/i18n/messages";
import { seededShuffle } from "../utils/practice";
import type { GameController } from "./use-game";
export function MemoryRound({ game }: { game: GameController }) {
  const { round, m } = game;
  const [open, setOpen] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);
  if (!round) return null;
  const cards = seededShuffle(
    round.deck.flatMap((item) =>
      (["source", "target"] as const).map((side) => ({
        item,
        side,
        key: `${side}/${item.id}`,
      })),
    ),
    round.id,
  );
  function flip(key: string) {
    if (!round || open.includes(key) || failed) return;
    const card = cards.find((entry) => entry.key === key)!;
    if (round.matched.includes(card.item.id)) return;
    if (!open.length) {
      setOpen([key]);
      return;
    }
    const first = cards.find((entry) => entry.key === open[0])!;
    setOpen([...open, key]);
    if (first.item.id === card.item.id && first.side !== card.side) {
      game.match(first.item.id, card.item.id);
      setOpen([]);
    } else {
      game.match(first.item.id, card.item.id);
      setFailed(true);
    }
  }
  return (
    <Surface padding="none" className="play-panel" sx={{ p: { xs: 2, sm: 4 } }}>
      <Typography component="h3" variant="h5">
        {game.gameTitle("memory")}
      </Typography>
      <p>{messages[game.locale].play.memoryNote}</p>
      <p>
        {m.matchedPairs}: {round.matched.length} / {round.deck.length}
      </p>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1,
        }}
      >
        {cards.map(({ item, side, key }, index) => {
          const matched = round.matched.includes(item.id);
          const visible = matched || open.includes(key);
          return (
            <Button
              key={key}
              variant={visible ? "contained" : "outlined"}
              disabled={matched || (failed && !open.includes(key))}
              aria-pressed={visible}
              aria-label={
                visible
                  ? `${languages[round[side]]}: ${item.words[round[side]][0]}`
                  : `${messages[game.locale].play.card} ${index + 1} · ${languages[round[side]]}`
              }
              onClick={() => flip(key)}
              sx={{
                minHeight: 100,
                textTransform: "none",
                overflowWrap: "anywhere",
              }}
            >
              <span>
                <small>{languages[round[side]]}</small>
                <br />
                <span lang={round[side]}>
                  {visible ? item.words[round[side]][0] : "?"}
                </span>
                {matched && " ✓"}
              </span>
            </Button>
          );
        })}
      </Box>
      {failed && (
        <Alert severity="warning" sx={{ mt: 2 }} role="status">
          {m.matchingError}
          <Button
            onClick={() => {
              setOpen([]);
              setFailed(false);
            }}
          >
            {m.next}
          </Button>
        </Alert>
      )}
      <Button sx={{ mt: 2 }} onClick={() => game.setRound(null)}>
        {m.change}
      </Button>
    </Surface>
  );
}
