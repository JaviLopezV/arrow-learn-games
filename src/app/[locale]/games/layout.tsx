import { notFound } from "next/navigation";
import { Box, Container, Link } from "@jlopvil/mui-kit";
import { isLocale, messages } from "@/i18n/messages";
import { SiteHeader } from "../site-header";
export default async function GamesLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <SiteHeader locale={locale} />
      <main>{children}</main>
      <Box component="footer" className="site-footer">
        <Container maxWidth="lg">
          <Link href={`/${locale}`}>← {messages[locale].nav.home}</Link>
          <span>{messages[locale].footer}</span>
        </Container>
      </Box>
    </>
  );
}
