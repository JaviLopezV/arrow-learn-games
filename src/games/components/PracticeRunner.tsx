"use client";
import { useMemo } from "react";
import { Alert, Box, Typography } from "@jlopvil/mui-kit";
import { messages, type Locale } from "@/i18n/messages";
import { topics } from "../config/topics";
import { useGame } from "../engines/use-game";
import {
  localDay,
  mistakeKey,
  practiceDeck,
  practiceItems,
  readMistakes,
} from "../utils/practice";
import type { Topic } from "../types/game.types";
import { GameRound } from "./game-round";
import { GameSetup } from "./game-setup";
import { GameHistory } from "./game-history";

export function PracticeRunner({
  locale,
  strategy,
}: {
  locale: Locale;
  strategy: "quick" | "mistakes" | "daily";
}) {
  const copy = messages[locale];
  const topic = useMemo<Topic>(
    () => ({
      id: `practice-${strategy}`,
      area: "vocabulary",
      level: "A1",
      icon: "✦",
      title: {
        es: messages.es.catalog.shortcutsData[strategy].title,
        ca: messages.ca.catalog.shortcutsData[strategy].title,
        en: messages.en.catalog.shortcutsData[strategy].title,
      },
      items: practiceItems(topics),
      availableGameModes: ["mixed-review"],
      roundSize: 8,
      createDeck: (target, source) =>
        practiceDeck(
          topics,
          strategy,
          target,
          source,
          strategy === "mistakes"
            ? readMistakes(localStorage.getItem(mistakeKey))
            : [],
          localDay(),
        ),
    }),
    [strategy],
  );
  const game = useGame({
    locale,
    topic,
    mode: strategy === "mistakes" ? "translation" : "mixed-review",
  });
  return (
    <section className="game-session">
      <Box className="games-container">
        <header className="section-heading">
          <span className="section-kicker">{copy.games.kicker}</span>
          <h1>{topic.title[locale]}</h1>
          <p>{copy.catalog.shortcutsData[strategy].description}</p>
          {strategy === "daily" && <p>{copy.play.dailyNote}</p>}
          {strategy === "mistakes" && <p>{copy.play.mistakesNote}</p>}
        </header>
        <Typography role="status">
          {!game.ready
            ? copy.games.loading
            : game.storageError
              ? copy.games.storageError
              : copy.games.saved}
        </Typography>
        {game.round ? <GameRound game={game} /> : <GameSetup game={game} />}
        {game.emptyDeck && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {copy.play.emptyMistakes}
          </Alert>
        )}
        {game.ready && <GameHistory game={game} locale={locale} />}
      </Box>
    </section>
  );
}
