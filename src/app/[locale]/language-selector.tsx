"use client";

import { useRouter } from "next/navigation";
import { LanguageSelector as SharedLanguageSelector } from "@jlopvil/mui-kit";
import type { Locale } from "@/i18n/messages";

const languageOptions: { value: Locale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "ca", label: "Català" },
  { value: "en", label: "English" },
];

export function LanguageSelector({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();

  return (
    <SharedLanguageSelector<Locale>
      label={label}
      value={locale}
      options={languageOptions}
      onChange={(nextLocale) => {
        if (nextLocale !== locale)
          router.push(
            `${window.location.pathname.replace(/^\/[^/]+/, `/${nextLocale}`)}${window.location.search}${window.location.hash}`,
          );
      }}
    />
  );
}
