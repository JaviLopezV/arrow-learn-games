"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages, type Locale } from "@/i18n/messages";
import { homeCopy } from "@/i18n/home";
export function SiteNavigation({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const m = messages[locale];
  return (
    <nav aria-label={m.nav.navigation} className="navigation">
      <Link href={`/${locale}`} aria-current={pathname === `/${locale}` ? "page" : undefined}>{m.nav.home}</Link>
      <Link
        href={`/${locale}/games`}
        aria-current={
          pathname.startsWith(`/${locale}/games`) ? "page" : undefined
        }
      >
        {homeCopy[locale].games}
      </Link>
      <Link
        href={`/${locale}/topics`}
        aria-current={pathname === `/${locale}/topics` ? "page" : undefined}
      >
        {homeCopy[locale].study}
      </Link>
    </nav>
  );
}
