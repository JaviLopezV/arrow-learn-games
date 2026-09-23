import type { Metadata } from "next";
import { messages, type Locale } from "@/i18n/messages";

export function gameMetadata(
  locale: Locale,
  path: string,
  name: string,
  summary?: string,
): Metadata {
  const title = `${name} | Arrow Learn Games`;
  const description =
    summary ?? `${name}. ${messages[locale].catalog.description}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        es: `/es${path}`,
        ca: `/ca${path}`,
        en: `/en${path}`,
        "x-default": `/es${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}${path}`,
      siteName: "Arrow Learn Games",
      type: "website",
      locale: { es: "es_ES", ca: "ca_ES", en: "en_US" }[locale],
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: messages[locale].metadata.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: "/og.png", alt: messages[locale].metadata.imageAlt }],
    },
  };
}
