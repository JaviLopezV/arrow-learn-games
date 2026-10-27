"use client";

import Image from "next/image";
import { Box, Typography } from "@jlopvil/mui-kit";
import { languages } from "@/lib/animals";
import { messages } from "@/i18n/messages";
import { SpeakingAvatar } from "@/components/speaking-avatar";
import { topics } from "../config/topics";
import type { exercise } from "../utils/exercises";
import type { GameController } from "./use-game";

export function WritingPrompt({
  game,
  question,
}: {
  game: GameController;
  question: ReturnType<typeof exercise>;
}) {
  const { m, round, item, locale } = game;
  const copy = messages[locale].play;
  if (!round || !item) return null;
  const audio =
    question.kind === "listen-and-write" ||
    question.kind === "listen-and-choose";
  const visual = question.kind === "image-to-word";
  const category = topics.find((topic) => topic.id === question.group)?.title[
    locale
  ];
  return (
    <>
      <SpeakingAvatar
        locale={locale}
        language={audio || round.result !== null ? round.target : round.source}
        text={
          audio || round.result !== null
            ? item.words[round.target][round.target === "ja" ? 1 : 0]
            : visual || question.kind === "odd-one-out"
              ? ""
              : item.words[round.source][round.source === "ja" ? 1 : 0]
        }
        cue={`${round.id}/${round.index}/${round.result !== null}`}
        conceal={audio && round.result === null}
        onUnavailable={
          audio && round.result === null
            ? () => game.respond("", true)
            : undefined
        }
      />
      {audio ? null : visual ? (
        <Box className="animal-image">
          {item.emoji ? (
            <span
              className="vocabulary-emoji"
              role="img"
              aria-label={game.topic.id === "numbers" ? item.id : m.imageAlt}
            >
              {item.emoji}
            </span>
          ) : (
            <Image
              src={item.image!}
              alt={m.imageAlt}
              width={250}
              height={250}
              priority
            />
          )}
        </Box>
      ) : question.kind === "odd-one-out" ? (
        <Typography sx={{ my: 3 }}>
          {copy.outsideGroup} <strong>{category}</strong>
        </Typography>
      ) : (
        <Box className="animal-word">
          <span>{languages[round.source]}</span>
          {item.context && (
            <span className="pronoun-context">{item.context[locale]}</span>
          )}
          <strong lang={round.source}>{item.words[round.source][0]}</strong>
        </Box>
      )}
    </>
  );
}
