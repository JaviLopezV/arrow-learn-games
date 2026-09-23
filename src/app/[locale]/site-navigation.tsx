"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages, type Locale } from "@/i18n/messages";
import { learnCopy } from "@/learn/copy";
export function SiteNavigation({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const m = messages[locale];
  return (
    <nav aria-label={m.nav.navigation} className="navigation">
      <Link href={`/${locale}#how-it-works`}>{m.nav.how}</Link>
      <Link
        href={`/${locale}/games`}
        aria-current={
          pathname.startsWith(`/${locale}/games`) ? "page" : undefined
        }
      >
        {m.nav.news}
      </Link>
      <Link
        href={`/${locale}/topics`}
        aria-current={pathname === `/${locale}/topics` ? "page" : undefined}
      >
        {learnCopy[locale].nav}
      </Link>
    </nav>
  );
}
