import { additionalCopy } from "@/i18n/additional";
import Link from "next/link";
import { messages, type Locale } from "@/i18n/messages";
const labels = {
  fr: [
    additionalCopy.fr.ui.notice,
    additionalCopy.fr.ui.privacy,
    additionalCopy.fr.ui.cookies,
    additionalCopy.fr.ui.terms,
  ],
  de: [
    additionalCopy.de.ui.notice,
    additionalCopy.de.ui.privacy,
    additionalCopy.de.ui.cookies,
    additionalCopy.de.ui.terms,
  ],
  it: [
    additionalCopy.it.ui.notice,
    additionalCopy.it.ui.privacy,
    additionalCopy.it.ui.cookies,
    additionalCopy.it.ui.terms,
  ],
  ja: [
    additionalCopy.ja.ui.notice,
    additionalCopy.ja.ui.privacy,
    additionalCopy.ja.ui.cookies,
    additionalCopy.ja.ui.terms,
  ],

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
          <Link
            className="footer-brand"
            href={`/${locale}`}
            aria-label={`Arrow Learn Games · ${messages[locale].nav.home}`}
          >
            <span aria-hidden="true">↗</span> arrow
            <span className="brand-accent">learn</span> games
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
              fr: additionalCopy.fr.ui.legal,
              de: additionalCopy.de.ui.legal,
              it: additionalCopy.it.ui.legal,
              ja: additionalCopy.ja.ui.legal,
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
