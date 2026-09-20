"use client";

import { Box, Typography } from "@jlopvil/mui-kit";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { languages } from "@/lib/animals";
import type { Locale } from "@/i18n/messages";
import type { GameController } from "./use-animal-game";
export function GameHistory({
  game,
  locale,
}: {
  game: GameController;
  locale: Locale;
}) {
  const { m, activeMode, gameTitle, results, round } = game;
  return (
    <Box
      component="section"
      className="game-history"
      aria-labelledby="history-title"
    >
      <Typography component="h3" variant="h5" id="history-title">
        {m.historyTitle} · {gameTitle(activeMode)}
      </Typography>
      <Typography component="p" className="save-note">
        {m.historyNote}
      </Typography>
      {results.length === 0 ? (
        <Typography component="p">{m.noGames}</Typography>
      ) : (
        <TableContainer sx={{ maxHeight: 420 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th" scope="col">
                  {m.playedAt}
                </TableCell>
                <TableCell component="th" scope="col">
                  {m.historyLanguage}
                </TableCell>
                <TableCell component="th" scope="col">
                  {m.resultScore}
                </TableCell>
                <TableCell component="th" scope="col">
                  {m.correct}
                </TableCell>
                <TableCell component="th" scope="col">
                  {m.gameStatus}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell>
                    <Box component="time" dateTime={result.startedAt}>
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(new Date(result.startedAt))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {activeMode !== "picture" && (
                      <>{languages[result.source]} → </>
                    )}
                    {languages[result.target]}
                  </TableCell>
                  <TableCell>
                    <Box component="strong">
                      {result.points} / {result.total * 10}
                    </Box>{" "}
                    pts
                  </TableCell>
                  <TableCell>
                    {result.points / 10} / {result.answered}
                  </TableCell>
                  <TableCell>
                    {result.completed
                      ? m.finishedGame
                      : round?.id === result.id
                        ? m.activeGame
                        : m.unfinishedGame}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
