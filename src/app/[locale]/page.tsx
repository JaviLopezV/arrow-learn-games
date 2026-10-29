import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import SportsEsportsRounded from "@mui/icons-material/SportsEsportsRounded";
import AutoStoriesRounded from "@mui/icons-material/AutoStoriesRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import { siteUrl } from "@/lib/seo";
import { isLocale, messages } from "@/i18n/messages";
import { homeCopy } from "@/i18n/home";
import { landingCopy } from "@/i18n/landing";
import { topics } from "@/games/config/topics";
import { SiteHeader } from "./site-header";

const featuredIds = ["animals", "food", "numbers", "everyday-conversation"];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = homeCopy[locale];
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="inicio" className="app-home">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Arrow Learn Games", url: `${siteUrl}/${locale}`, description: messages[locale].metadata.description, inLanguage: locale }).replace(/</g, "\\u003c") }} />
        <section className="app-welcome" aria-labelledby="home-title">
          <div><span className="app-eyebrow">{m.greeting}</span><h1 id="home-title">{m.title}</h1><p>{m.intro}</p></div>
          <span className="app-welcome-mark" aria-hidden="true">↗</span>
        </section>
        <section className="app-destinations" aria-label={`${m.games} · ${m.study}`}>
          <Link href={`/${locale}/games`} className="app-destination app-destination-games">
            <div className="app-destination-top"><span className="app-feature-icon"><SportsEsportsRounded /></span><span className="app-pill">{m.quick}</span></div>
            <h2>{m.games}</h2><p>{m.gamesText}</p>
            <span className="app-card-action">{m.play}<ArrowForwardRounded /></span>
          </Link>
          <Link href={`/${locale}/topics`} className="app-destination app-destination-study">
            <div className="app-destination-top"><span className="app-feature-icon"><AutoStoriesRounded /></span><span className="app-pill">{m.badge}</span></div>
            <h2>{m.study}</h2><p>{m.studyText}</p>
            <span className="app-card-action">{m.learn}<ArrowForwardRounded /></span>
          </Link>
        </section>
        <section className="app-recommendations" aria-labelledby="recommended-title">
          <div className="app-section-heading"><h2 id="recommended-title">{m.recommended}</h2><Link href={`/${locale}/games`}>{m.all}<ArrowForwardRounded /></Link></div>
          <div className="app-topic-grid">{featuredIds.map((id) => {
            const topic = topics.find((item) => item.id === id)!;
            return <Link className="app-topic" key={id} href={`/${locale}/games/${topic.area}/${topic.id}`}><span className={`app-topic-icon app-topic-icon-${id}`} aria-hidden="true">{id === "animals" ? <Image src="/animals/cat.svg" width={56} height={56} alt="" /> : topic.icon}</span><span className="app-topic-copy"><small>{topic.level}</small><h3>{topic.title[locale]}</h3></span><ArrowForwardRounded className="app-topic-arrow" /></Link>;
          })}</div>
        </section>
        <aside className="app-learning-note"><span aria-hidden="true">✦</span><div><h2>{m.tip}</h2><p>{m.tipText}</p></div></aside>
        <p className="app-home-note">{landingCopy[locale].note}</p>
      </main>
    </>
  );
}
