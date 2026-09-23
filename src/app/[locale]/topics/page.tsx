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
