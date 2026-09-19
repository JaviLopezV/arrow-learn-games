"use client";

import { alpha } from "@mui/material/styles";
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
      sx={(theme) => ({
        minHeight: 46,
        px: 1.25,
        borderRadius: "16px",
        color: "primary.main",
        bgcolor: alpha(theme.palette.primary.main, 0.055),
        borderColor: alpha(theme.palette.primary.main, 0.14),
        fontSize: 13,
        fontWeight: 800,
        letterSpacing: "0.06em",
        boxShadow: `0 3px 0 ${alpha(theme.palette.primary.main, 0.09)}`,
      })}
      onChange={(nextLocale) => {
        if (nextLocale !== locale)
          router.push(
            `${window.location.pathname.replace(/^\/[^/]+/, `/${nextLocale}`)}${window.location.search}${window.location.hash}`,
          );
      }}
    />
  );
}
