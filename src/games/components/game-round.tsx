"use client";
import type { ComponentType } from "react";
import type { StandardMode as ImplementedMode } from "../types/game.types";
import type { GameController } from "../engines/use-game";
import { WritingRound } from "../engines/writing-round";
import { MatchingRound } from "../engines/matching-round";
import { MemoryRound } from "../engines/memory-round";
import { RoundSummary } from "./round-summary";
// One registration per engine; routes and topics never dispatch on content IDs.
const engines: Record<
  ImplementedMode,
  ComponentType<{ game: GameController }>
> = {
  "image-to-word": WritingRound,
  translation: WritingRound,
  matching: MatchingRound,
  memory: MemoryRound,
  "multiple-choice": WritingRound,
  "complete-word": WritingRound,
  unscramble: WritingRound,
  "listen-and-write": WritingRound,
  "listen-and-choose": WritingRound,
  "speed-round": WritingRound,
  "odd-one-out": WritingRound,
  "sentence-context": WritingRound,
  "mixed-review": WritingRound,
};
export function GameRound({ game }: { game: GameController }) {
  if (!game.round) return null;
  if (game.round.done) return <RoundSummary game={game} />;
  const Engine = engines[game.round.mode];
  return <Engine key={game.round.id} game={game} />;
}
