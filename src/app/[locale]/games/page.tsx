import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Box, Container, Link } from "@jlopvil/mui-kit";
import { isLocale, messages } from "@/i18n/messages";
import { AnimalGames } from "../animal-games";
import { SiteHeader } from "../site-header";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = messages[locale];
  const title = `${m.nav.news} | Arrow Learn Games`;
  return {
    title,
    description: m.games.description,
    alternates: {
      canonical: `/${locale}/games`,
      languages: {
        es: "/es/games",
        ca: "/ca/games",
        en: "/en/games",
        "x-default": "/es/games",
      },
    },
    openGraph: {
      title,
      description: m.games.description,
      url: `/${locale}/games`,
      siteName: "Arrow Learn Games",
      type: "website",
      locale: { es: "es_ES", ca: "ca_ES", en: "en_US" }[locale],
      images: [
        { url: "/og.png", width: 1200, height: 630, alt: m.metadata.imageAlt },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: m.games.description,
      images: [{ url: "/og.png", alt: m.metadata.imageAlt }],
    },
  };
}

export default async function GamesPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <SiteHeader locale={locale} />
      <Box component="main">
        <AnimalGames locale={locale} />
      </Box>
      <Box component="footer" className="site-footer">
        <Container maxWidth="lg">
          <Link href={`/${locale}`}>← {messages[locale].nav.home}</Link>
          <Box component="span">{messages[locale].footer}</Box>
        </Container>
      </Box>
    </>
  );
}
