"use client";

import { useRef, useState } from "react";
import { Alert, Box, Button, Surface, Typography } from "@jlopvil/mui-kit";
import { LinearProgress } from "@mui/material";
import { languages } from "@/lib/animals";
import type { GameController } from "./use-game";

export function MatchingRound({ game }: { game: GameController }) {
  const { m, round, match, setRound } = game;
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"success" | "warning" | null>(null);
  const sourceButtons = useRef<Map<string, HTMLButtonElement>>(new Map());
  const targetButtons = useRef<Map<string, HTMLButtonElement>>(new Map());
  if (!round) return null;

  function chooseTarget(id: string) {
    if (!selected || !round) return;
    const correct = selected === id;
    match(selected, id);
    setFeedback(correct ? "success" : "warning");
    if (correct) {
      setSelected(null);
      const next = round.deck.find(
        (item) => item.id !== selected && !round.matched.includes(item.id),
      );
      if (next) sourceButtons.current.get(next.id)?.focus();
    }
  }

  return (
    <Surface
      padding="none"
      className="play-panel"
      sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}
    >
      <Typography component="h3" variant="h5">
        {m.matchingTitle}
      </Typography>
      <Typography component="p">{m.matchingPrompt}</Typography>
      <Typography component="p" sx={{ mt: 1 }}>
        {m.matchedPairs}: {round.matched.length} / {round.deck.length}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(100 * round.matched.length) / round.deck.length}
        aria-label={m.matchedPairs}
        sx={{ my: 2, height: 7, borderRadius: 2 }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: { xs: 1, sm: 3 },
        }}
      >
        {(["source", "target"] as const).map((side) => (
          <Box
            key={side}
            role="group"
            aria-label={languages[round[side]]}
            sx={{ minWidth: 0 }}
          >
            <Typography component="h4" sx={{ mb: 1, fontWeight: 700 }}>
              {languages[round[side]]}
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              {(side === "source" ? round.deck : round.choices).map((item) => {
                const matched = round.matched.includes(item.id);
                const active = side === "source" && selected === item.id;
                return (
                  <Button
                    key={item.id}
                    lang={round[side]}
                    fullWidth
                    ref={(element: HTMLButtonElement | null) => {
                      const refs =
                        side === "source" ? sourceButtons : targetButtons;
                      if (element) refs.current.set(item.id, element);
                      else refs.current.delete(item.id);
                    }}
                    variant={active ? "contained" : "outlined"}
                    disabled={matched || (side === "target" && !selected)}
                    aria-pressed={side === "source" ? active : undefined}
                    onClick={() => {
                      if (side === "target") chooseTarget(item.id);
                      else {
                        setSelected(item.id);
                        setFeedback(null);
                        const first = round.choices.find(
                          (choice) => !round.matched.includes(choice.id),
                        );
                        if (first)
                          requestAnimationFrame(() =>
                            targetButtons.current.get(first.id)?.focus(),
                          );
                      }
                    }}
                    sx={{
                      minHeight: { xs: 48, sm: 72 },
                      px: { xs: 1, sm: 2 },
                      textTransform: "none",
                      overflowWrap: "anywhere",
                      fontSize: { xs: 13, sm: 16 },
                      lineHeight: 1.4,
                      "&.Mui-disabled": matched
                        ? {
                            color: "#286c56",
                            borderColor: "#a0d9bc",
                            bgcolor: "#e4f7ee",
                          }
                        : {},
                    }}
                  >
                    {matched ? "✓ " : ""}
                    {item.words[round[side]][0]}
                  </Button>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
      <Box aria-live="polite" aria-atomic="true" sx={{ mt: 2 }}>
        {feedback && (
          <Alert severity={feedback}>
            {feedback === "success" ? m.matchingSuccess : m.matchingError}
          </Alert>
        )}
      </Box>
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
