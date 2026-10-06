import { notFound } from "next/navigation";
import { isLocale, messages } from "@/i18n/messages";
import { PracticeRunner } from "@/games/components/PracticeRunner";
import { GameBreadcrumbs } from "@/games/components/GameCatalog";
import { gameMetadata } from "@/games/utils/metadata";
type Props = { params: Promise<{ locale: string; strategy: string }> };
const isStrategy = (value: string): value is "quick" | "mistakes" | "daily" =>
  ["quick", "mistakes", "daily"].includes(value);
export async function generateMetadata({ params }: Props) {
  const { locale, strategy } = await params;
  return isLocale(locale) && isStrategy(strategy)
    ? gameMetadata(
        locale,
        `/games/practice/${strategy}`,
        messages[locale].catalog.shortcutsData[strategy].title,
      )
    : {};
}
export default async function PracticePage({ params }: Props) {
  const { locale, strategy } = await params;
  if (!isLocale(locale) || !isStrategy(strategy)) notFound();
  return (
    <>
      <div className="games-container runner-breadcrumbs">
        <GameBreadcrumbs locale={locale} />
      </div>
      <PracticeRunner
        key={`${locale}/${strategy}`}
        locale={locale}
        strategy={strategy}
      />
    </>
  );
}
