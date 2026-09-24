import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { MyUiInitColorSchemeScript } from "@jlopvil/mui-kit/theme";
import { isLocale, locales, messages } from "@/i18n/messages";
import "@jlopvil/mui-kit/styles.css";
import "../globals.css";
import { Providers } from "../providers";

import { siteUrl, indexable } from "@/lib/seo";
import { MobileNavigation } from "./mobile-navigation";
import { SiteFooter } from "./site-footer";

export const viewport: Viewport = {
  themeColor: "#4552d5",
  viewportFit: "cover",
};

const ogLocales = { es: "es_ES", ca: "ca_ES", en: "en_US" };

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = messages[locale].metadata;
  return {
    metadataBase: new URL(siteUrl),
    title: m.title,
    description: m.description,
    applicationName: "Arrow Learn Games",
    robots: { index: indexable, follow: true },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Arrow Learn",
    },
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/apple-touch-icon.png",
    },
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", ca: "/ca", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      title: m.openGraphTitle,
      description: m.openGraphDescription,
      siteName: "Arrow Learn Games",
      url: `/${locale}`,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((value) => value !== locale)
        .map((value) => ogLocales[value]),
      type: "website",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          type: "image/png",
          alt: m.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.openGraphTitle,
      description: m.openGraphDescription,
      images: [{ url: "/og.png", alt: m.imageAlt }],
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <MyUiInitColorSchemeScript defaultMode="light" />
        <Providers>
          {children}
          <SiteFooter locale={locale} />
          <MobileNavigation locale={locale} />
        </Providers>
      </body>
    </html>
  );
}
