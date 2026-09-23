import { gameMetadata } from "@/games/utils/metadata";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/messages";
import { SiteHeader } from "../site-header";
import { LearningHub } from "@/learn/LearningHub";
export default async function Syllabus({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <SiteHeader locale={locale} />
      <main>
        <LearningHub locale={locale} />
      </main>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const titles = {
    es: "Temario de idiomas A1 y tarjetas de vocabulario",
    ca: "Temari d’idiomes A1 i targetes de vocabulari",
    en: "A1 language lessons and vocabulary flashcards",
  };
  return gameMetadata(locale, "/topics", titles[locale]);
}
