import { gameMetadata } from "@/games/utils/metadata";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/messages";
import { getTopic } from "@/games/config/topics";
import { availableModes } from "@/games/config/gameModes";
import { GameCatalog } from "@/games/components/GameCatalog";
type Props = {
  params: Promise<{ locale: string; area: string; topic: string }>;
};
export async function generateMetadata({ params }: Props) {
  const { locale, area, topic } = await params;
  const selected = getTopic(area, topic);
  return isLocale(locale) && selected
    ? gameMetadata(locale, `/games/${area}/${topic}`, selected.title[locale])
    : {};
}
export default async function TopicPage({ params }: Props) {
  const { locale, area, topic } = await params;
  const selected = getTopic(area, topic);
  if (!isLocale(locale) || !selected || !availableModes(selected).length)
    notFound();
  return <GameCatalog locale={locale} area={selected.area} topic={selected} />;
}
