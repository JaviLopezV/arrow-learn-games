import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { siteUrl } from "@/lib/seo";
import { isLocale, messages } from "@/i18n/messages";
import { landingCopy } from "@/i18n/landing";
import { languages, animals } from "@/lib/animals";
import { topics } from "@/games/config/topics";
import { SiteHeader } from "./site-header";

const featuredIds = [
  "animals",
  "food",
  "numbers",
  "everyday-conversation",
] as const;
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = landingCopy[locale];
  const cat = animals.find((animal) => animal.id === "cat")!;
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="inicio" className="landing">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Arrow Learn Games",
              url: `${siteUrl}/${locale}`,
              description: messages[locale].metadata.description,
              inLanguage: locale,
            }).replace(/</g, "\\u003c"),
          }}
        />
        <section
          className="landing-hero landing-wrap"
          aria-labelledby="landing-title"
        >
          <div className="landing-intro">
            <span className="landing-eyebrow">✦ {m.eyebrow}</span>
            <h1 id="landing-title">
              {m.title}
              <span>{m.accent}</span>
            </h1>
            <p>{m.intro}</p>
            <div className="landing-actions">
              <Link className="landing-button" href={`/${locale}/games`}>
                {m.play} <span aria-hidden="true">↗</span>
              </Link>
              <Link
                className="landing-button landing-button-secondary"
                href={`/${locale}/topics`}
              >
                {m.learn}
              </Link>
            </div>
            <small className="landing-note">{m.note}</small>
          </div>
          <div className="landing-sample">
            <div className="landing-sample-heading">
              <span>{m.sample}</span>
              <span className="landing-level">A1</span>
            </div>
            <div className="landing-sample-picture">
              <Image
                src="/animals/cat.svg"
                width={180}
                height={160}
                alt={cat.words[locale][0]}
                priority
              />
            </div>
            <h2>{m.example}</h2>
            <dl className="landing-translations">
              {Object.entries(languages).map(([id, name]) => (
                <div key={id}>
                  <dt>{name}</dt>
                  <dd lang={id}>
                    {cat.words[id as keyof typeof languages][0]}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              className="landing-sample-link"
              href={`/${locale}/games/vocabulary/animals/image-to-word`}
            >
              {m.try}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <div className="landing-languages landing-wrap">
          <p>{m.languages}</p>
          <ul>
            {Object.entries(languages).map(([id, name]) => (
              <li key={id} lang={id}>
                {name}
              </li>
            ))}
          </ul>
        </div>
        <section
          className="landing-topics"
          aria-labelledby="landing-topics-title"
        >
          <div className="landing-wrap">
            <div className="landing-section-heading">
              <div>
                <span className="section-kicker">{m.topicsKicker}</span>
                <h2 id="landing-topics-title">{m.topicsTitle}</h2>
                <p>{m.topicsIntro}</p>
              </div>
              <Link className="landing-text-link" href={`/${locale}/games`}>
                {m.all} <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="landing-topic-grid">
              {featuredIds.map((id, index) => {
                const topic = topics.find((t) => t.id === id)!;
                return (
                  <Link
                    className={`landing-topic landing-topic-${index}`}
                    key={id}
                    href={`/${locale}/games/${topic.area}/${topic.id}`}
                  >
                    <div className="landing-topic-top">
                      <span className="landing-topic-icon" aria-hidden="true">
                        {topic.icon}
                      </span>
                      <span className="landing-level">{topic.level}</span>
                    </div>
                    <h3>{topic.title[locale]}</h3>
                    <p>{m.descriptions[id]}</p>
                    <span className="landing-topic-action">
                      {m.topicAction}
                      <span aria-hidden="true">↗</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="landing-how landing-wrap"
          aria-labelledby="landing-how-title"
        >
          <span className="section-kicker">{m.howKicker}</span>
          <h2 id="landing-how-title">{m.howTitle}</h2>
          <ol className="landing-steps">
            {m.steps.map((step, index) => (
              <li key={step.title}>
                <span className="landing-step-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <Link
                  className="landing-text-link"
                  href={`/${locale}/${index === 0 ? "topics" : "games"}`}
                >
                  {step.link} <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="landing-closing landing-wrap"
          aria-labelledby="landing-closing-title"
        >
          <div>
            <h2 id="landing-closing-title">{m.closingTitle}</h2>
            <p>{m.closingText}</p>
          </div>
          <Link className="landing-button" href={`/${locale}/games`}>
            {m.closingCta}
            <span aria-hidden="true">↗</span>
          </Link>
        </section>
      </main>
    </>
  );
}
