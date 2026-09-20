import { Box, Link, Button, Container } from "@jlopvil/mui-kit";
import { messages, type Locale } from "@/i18n/messages";
import { LanguageSelector } from "./language-selector";

export function SiteHeader({ locale }: { locale: Locale }) {
  const m = messages[locale];
  return (
    <Box component="header" className="site-header">
      <Container maxWidth="lg" className="header-inner">
        <Box
          component="a"
          href={`/${locale}#inicio`}
          className="brand"
          aria-label={`Arrow Learn Games, ${m.nav.home.toLowerCase()}`}
        >
          <Box component="span" className="brand-mark" aria-hidden="true">
            ↗
          </Box>
          <Box component="span">
            arrow
            <Box component="span" className="brand-accent">
              learn
            </Box>
            <Box component="small">games</Box>
          </Box>
        </Box>
        <Box
          component="nav"
          aria-label={m.nav.navigation}
          className="navigation"
        >
          <Link href={`/${locale}#como-funciona`}>{m.nav.how}</Link>
          <Link href={`/${locale}/games`}>{m.nav.news}</Link>
        </Box>
        <Box className="header-actions">
          <LanguageSelector locale={locale} label={m.nav.language} />
          <Button
            component="a"
            href={`/${locale}/games`}
            tone="primary"
            variant="contained"
            className="header-cta"
          >
            {m.nav.discover}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
