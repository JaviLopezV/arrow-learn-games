"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { homeCopy } from "@/i18n/home";
import HomeRounded from "@mui/icons-material/HomeRounded";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import { messages, type Locale } from "@/i18n/messages";

export function MobileNavigation({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const items = [
    {
      href: `/${locale}`,
      label: {
        es: "Inicio",
        ca: "Inici",
        en: "Home",
        fr: "Accueil",
        de: "Startseite",
        it: "Home",
        ja: "ホーム",
      }[locale],
      icon: HomeRounded,
    },
    {
      href: `/${locale}/games`,
      label: homeCopy[locale].games,
      icon: SportsEsportsRounded,
    },
    {
      href: `/${locale}/topics`,
      label: homeCopy[locale].study,
      icon: AutoStoriesRounded,
    },
  ];
  return (
    <nav
      className="mobile-navigation"
      aria-label={messages[locale].nav.navigation}
    >
      {items.map(({ href, label, icon: Icon }, index) => (
        <Link
          key={href}
          href={href}
          aria-current={
            pathname === href || (index > 0 && pathname.startsWith(`${href}/`))
              ? "page"
              : undefined
          }
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
