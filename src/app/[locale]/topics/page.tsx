import { additionalCopy } from "@/i18n/additional";
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
    es: "Plan de estudios de idiomas: vocabulario y gramática",
    ca: "Pla d’estudis d’idiomes: vocabulari i gramàtica",
    en: "Language study plan: vocabulary and grammar",
    fr: additionalCopy.fr.ui.studyTitle,
    de: additionalCopy.de.ui.studyTitle,
    it: additionalCopy.it.ui.studyTitle,
    ja: additionalCopy.ja.ui.studyTitle,
  };
  return gameMetadata(locale, "/topics", titles[locale]);
}
