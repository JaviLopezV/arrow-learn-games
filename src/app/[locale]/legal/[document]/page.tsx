import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/messages";
import { isLegalDocument, legalDocuments, owner } from "@/lib/legal";
import { gameMetadata } from "@/games/utils/metadata";
import { SiteHeader } from "../../site-header";
type Props = { params: Promise<{ locale: string; document: string }> };
export async function generateMetadata({ params }: Props) {
  const { locale, document } = await params;
  if (!isLocale(locale) || !isLegalDocument(document)) return {};
  const doc = legalDocuments[document];
  return {
    ...gameMetadata(locale, `/legal/${document}`, doc.title, doc.description),
    alternates: { canonical: `/es/legal/${document}` },
    robots: { index: false, follow: true },
  };
}
export default async function LegalPage({ params }: Props) {
  const { locale, document } = await params;
  if (!isLocale(locale) || !isLegalDocument(document)) notFound();
  const doc = legalDocuments[document];
  return (
    <>
      <SiteHeader locale={locale} />
      <main className="legal-document" lang="es">
        <h1>{doc.title}</h1>
        <p>Última revisión: 23 de septiembre de 2026.</p>
        <address>
          <strong>{owner.name}</strong>
          <br />
          NIF: {owner.nif}
          <br />
          {owner.address}
          <br />
          <a href={`mailto:${owner.email}`}>{owner.email}</a>
        </address>
        {doc.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <p>
          Proveedores:{" "}
          <a href="https://vercel.com/legal/privacy-notice">
            Privacidad de Vercel
          </a>{" "}
          y{" "}
          <a href="https://policies.google.com/privacy?hl=es">
            Privacidad de Google
          </a>
          .
        </p>
        <p>
          Referencia:{" "}
          <a href="https://www.aepd.es">
            Agencia Española de Protección de Datos
          </a>{" "}
          y{" "}
          <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758">
            Ley 34/2002 (LSSI)
          </a>
          .
        </p>
      </main>
    </>
  );
}
