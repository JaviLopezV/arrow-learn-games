import { BingoGame } from "@/games/components/bingo-game";
import { gameMetadata } from "@/games/utils/metadata";
import { notFound } from "next/navigation";
import { isLocale, messages } from "@/i18n/messages";
import { getTopic } from "@/games/config/topics";
import { availableModes } from "@/games/config/gameModes";
import { GameRunner } from "@/games/components/GameRunner";
import { GameBreadcrumbs } from "@/games/components/GameCatalog";
type Props = {
  params: Promise<{
    locale: string;
    area: string;
    topic: string;
    mode: string;
  }>;
};
export async function generateMetadata({ params }: Props) {
  const { locale, area, topic, mode } = await params;
  const selected = getTopic(area, topic);
  const gameMode =
    selected && availableModes(selected).find((item) => item.id === mode);
  return isLocale(locale) && selected && gameMode
    ? gameMetadata(
        locale,
        `/games/${area}/${topic}/${mode}`,
        `${selected.title[locale]} · ${messages[locale].catalog.modes[gameMode.id].title}`,
      )
    : {};
}
export default async function ModePage({ params }: Props) {
  const { locale, area, topic, mode } = await params;
  const selected = getTopic(area, topic);
  const gameMode =
    selected && availableModes(selected).find((item) => item.id === mode);
  if (
    !isLocale(locale) ||
    !selected ||
    !gameMode ||
    gameMode.status !== "available"
  )
    notFound();
  return (
    <>
      <div className="games-container runner-breadcrumbs">
        <GameBreadcrumbs
          locale={locale}
          area={selected.area}
          topic={selected}
        />
      </div>
      {gameMode.id === "bingo" ? (
        <BingoGame locale={locale} />
      ) : (
        <GameRunner
          key={`${locale}/${area}/${topic}/${mode}`}
          locale={locale}
          topic={selected.id}
          area={selected.area}
          mode={gameMode.id}
        />
      )}
    </>
  );
}
