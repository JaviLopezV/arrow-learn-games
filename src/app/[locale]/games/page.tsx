import { gameMetadata } from "@/games/utils/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, messages } from "@/i18n/messages";
import { GameCatalog } from "@/games/components/GameCatalog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return gameMetadata(locale, "/games", messages[locale].nav.news);
}

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <GameCatalog locale={locale} />;
}
