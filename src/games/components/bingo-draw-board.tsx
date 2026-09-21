"use client";

import { Box, Typography } from "@jlopvil/mui-kit";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { messages, type Locale } from "@/i18n/messages";

export function BingoDrawBoard({
  locale,
  called,
  current,
  speak,
}: {
  locale: Locale;
  called: number[];
  current: number | undefined;
  speak: (n: number) => void;
}) {
  const m = messages[locale].bingo;
  return (
    <Accordion
      disableGutters
      sx={{ mt: 3.5, borderRadius: "16px", "&:before": { display: "none" } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreRoundedIcon />}
        id="bingo-board-title"
        aria-controls="bingo-board-content"
      >
        <Typography component="span" sx={{ fontWeight: 700 }}>
          {m.board} · {called.length}/99
        </Typography>
      </AccordionSummary>
      <AccordionDetails id="bingo-board-content">
        <Typography component="p" sx={{ mb: 2 }}>
          {m.boardHint}
        </Typography>
        <Box className="bingo-draw-board">
          {Array.from({ length: 99 }, (_, i) => i + 1).map((n) => {
            const drawn = called.includes(n);
            return (
              <ButtonBase
                key={n}
                className={`bingo-draw-number${drawn ? " bingo-drawn" : ""}${n === current ? " bingo-current" : ""}`}
                disabled={!drawn}
                onClick={() => speak(n)}
                aria-label={`${n}: ${drawn ? m.drawn : m.notDrawn}${drawn ? `. ${m.listen}` : ""}`}
                aria-current={n === current ? "true" : undefined}
              >
                {n}
                {drawn && (
                  <Box
                    component="span"
                    aria-hidden="true"
                    className="bingo-draw-cross"
                  >
                    ×
                  </Box>
                )}
              </ButtonBase>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
