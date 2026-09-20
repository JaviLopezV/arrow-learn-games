"use client";

import { Box, Typography } from "@jlopvil/mui-kit";
import type { Locale } from "@/i18n/messages";
import { getTopic } from "../config/topics";
import { useGame } from "../engines/use-game";
import type { ImplementedMode, LearningArea } from "../types/game.types";
import { GameSetup } from "./game-setup";
import { GameRound } from "./game-round";
import { GameHistory } from "./game-history";
export function GameRunner({
  locale,
  topic: topicId,
  area,
  mode,
}: {
  locale: Locale;
  topic: string;
  area: LearningArea;
  mode: ImplementedMode;
}) {
  const topic = getTopic(area, topicId)!;
  const game = useGame({ locale, topic, mode });
  const {
    m,
    activeMode,
    gameTitle,
    ready,
    round,
    results,
    best,
    completedResults,
    storageError,
    legacyScore,
  } = game;
  return (
    <Box
      component="section"
      id="juegos"
      className="game-session"
      aria-labelledby="games-title"
    >
      <Box className="games-container">
        <Box className="section-heading">
          <Box component="span" className="section-kicker">
            {m.kicker}
          </Box>
          <Typography component="h1" variant="h4" id="games-title">
            {topic.title[locale]}
          </Typography>
          <Typography component="p">{gameTitle(activeMode)}</Typography>
        </Box>
        <Typography component="h3" variant="h5" className="score-game-title">
          {gameTitle(activeMode)}
        </Typography>
        <Box className="score-grid" aria-label={gameTitle(activeMode)}>
          <Box>
            <Box component="span">{round ? m.roundPoints : m.lastScore}</Box>
            <Box component="strong">
              {ready ? (round?.points ?? results[0]?.points ?? "—") : "—"}{" "}
              <Box component="small">pts</Box>
            </Box>
          </Box>
          <Box>
            <Box component="span">{m.bestScore}</Box>
            <Box component="strong">
              {ready ? (best ?? "—") : "—"} <Box component="small">pts</Box>
            </Box>
          </Box>
          <Box>
            <Box component="span">{m.completedGames}</Box>
            <Box component="strong">
              {ready ? completedResults.length : "—"}
            </Box>
          </Box>
        </Box>
        <Typography component="p" className="save-note" role="status">
          {!ready ? m.loading : storageError ? m.storageError : m.saved}
        </Typography>
        {legacyScore && (
          <Typography component="p" className="save-note">
            {m.legacyScore}
          </Typography>
        )}
        {round ? <GameRound game={game} /> : <GameSetup game={game} />}
        {ready && <GameHistory game={game} locale={locale} />}
      </Box>
    </Box>
  );
}
