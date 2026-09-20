import { gameMetadata } from "@/games/utils/metadata";
import { notFound } from "next/navigation";
import { isLocale, messages } from "@/i18n/messages";
import { getArea } from "@/games/config/learningAreas";
import { GameCatalog } from "@/games/components/GameCatalog";
type Props = { params: Promise<{ locale: string; area: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale, area } = await params;
  const selected = getArea(area);
  return isLocale(locale) && selected
    ? gameMetadata(
        locale,
        `/games/${area}`,
        messages[locale].catalog.areas[selected.id].title,
      )
    : {};
}
export default async function AreaPage({ params }: Props) {
  const { locale, area } = await params;
  const selected = getArea(area);
  if (!isLocale(locale) || !selected) notFound();
  return <GameCatalog locale={locale} area={selected.id} />;
}
