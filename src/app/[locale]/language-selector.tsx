"use client";

import { useRouter } from "next/navigation";
import { SelectField } from "@jlopvil/mui-kit";
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
    <SelectField<Locale>
      native
      label={label}
      size="small"
      value={locale}
      options={languageOptions}
      onChange={(nextLocale) => {
        if (nextLocale !== locale)
          router.push(`/${nextLocale}${window.location.hash}`);
      }}
      className="language-dropdown"
    />
  );
}
