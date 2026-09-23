import Link from "next/link";
import { messages, type Locale } from "@/i18n/messages";
const labels = {
  es: [
    "Aviso legal",
    "Privacidad",
    "Cookies y almacenamiento",
    "Condiciones de uso",
  ],
  ca: [
    "Avís legal (castellà)",
    "Privacitat (castellà)",
    "Galetes i emmagatzematge (castellà)",
    "Condicions d’ús (castellà)",
  ],
  en: [
    "Legal notice (Spanish)",
    "Privacy (Spanish)",
    "Cookies and storage (Spanish)",
    "Terms of use (Spanish)",
  ],
};
export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-identity">
          <Link className="footer-brand" href={`/${locale}`} aria-label={`Arrow Learn Games · ${messages[locale].nav.home}`}>
            <span aria-hidden="true">↗</span> arrow<span className="brand-accent">learn</span> games
          </Link>
          <p>{messages[locale].footer}</p>
        </div>
      <nav
        className="footer-legal-links"
        aria-label={
          {
            es: "Información legal",
            ca: "Informació legal",
            en: "Legal information",
          }[locale]
        }
      >
        {["notice", "privacy", "cookies", "terms"].map((slug, i) => (
          <Link key={slug} href={`/${locale}/legal/${slug}`}>
            {labels[locale][i]}
          </Link>
        ))}
      </nav>
      </div>
    </footer>
  );
}
