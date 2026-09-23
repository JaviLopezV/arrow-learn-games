import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/messages";
import { SiteHeader } from "../site-header";
export default async function GamesLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <SiteHeader locale={locale} />
      <main>{children}</main>
    </>
  );
}
