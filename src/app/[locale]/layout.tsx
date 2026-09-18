import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MyUiInitColorSchemeScript } from "@jlopvil/mui-kit/theme";
import { isLocale, locales, messages } from "@/i18n/messages";
import "@jlopvil/mui-kit/styles.css";
import "../globals.css";
import { Providers } from "../providers";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: messages[locale].metadata.title,
    description: messages[locale].metadata.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", ca: "/ca", en: "/en" },
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
