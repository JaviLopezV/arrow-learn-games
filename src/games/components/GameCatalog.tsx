import Link from "next/link";
import { messages, type Locale } from "@/i18n/messages";
import { learningAreas } from "../config/learningAreas";
import { topics } from "../config/topics";
import { availableModes } from "../config/gameModes";
import { practiceShortcuts } from "../config/practice";
import type { LearningArea, Topic } from "../types/game.types";
import { CatalogCard } from "./CatalogCard";

export function GameBreadcrumbs({
  locale,
  area,
  topic,
}: {
  locale: Locale;
  area?: LearningArea;
  topic?: Topic;
}) {
  const m = messages[locale].catalog;
  return (
    <nav className="game-breadcrumbs" aria-label={m.breadcrumb}>
      <Link href={`/${locale}/games`}>{messages[locale].nav.news}</Link>
      {area && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={`/${locale}/games/${area}`}>{m.areas[area].title}</Link>
        </>
      )}
      {topic && (
        <>
          <span aria-hidden="true">/</span>
          <Link href={`/${locale}/games/${topic.area}/${topic.id}`}>
            {topic.title[locale]}
          </Link>
        </>
      )}
    </nav>
  );
}

export function GameCatalog({
  locale,
  area,
  topic,
}: {
  locale: Locale;
  area?: LearningArea;
  topic?: Topic;
}) {
  const m = messages[locale].catalog;
  const selectedArea = area ?? "vocabulary";
  return (
    <section className="games-catalog">
      <div className="games-container">
        {area && <GameBreadcrumbs locale={locale} area={area} />}
        <header className="section-heading">
          <span className="section-kicker">
            {messages[locale].games.kicker}
          </span>
          <h1>
            {topic ? topic.title[locale] : area ? m.areas[area].title : m.title}
          </h1>
          <p>
            {topic
              ? m.chooseMode
              : area
                ? m.areas[area].description
                : m.description}
          </p>
        </header>
        {topic ? (
          <div className="catalog-grid modes-grid">
            {availableModes(topic).map((mode) => (
              <CatalogCard
                key={mode.id}
                icon={mode.icon}
                title={m.modes[mode.id].title}
                description={m.modes[mode.id].description}
                badge={topic.level}
                href={`/${locale}/games/${topic.area}/${topic.id}/${mode.id}`}
              />
            ))}
          </div>
        ) : (
          <>
            <nav className="catalog-grid areas-grid" aria-label={m.browse}>
              {learningAreas.map((item) => (
                <CatalogCard
                  key={item.id}
                  icon={item.icon}
                  title={m.areas[item.id].title}
                  description={m.areas[item.id].description}
                  href={`/${locale}/games/${item.id}`}
                  selected={selectedArea === item.id}
                />
              ))}
            </nav>
            {!area && (
              <section
                className="catalog-section"
                aria-labelledby="shortcuts-title"
              >
                <h2 id="shortcuts-title">{m.shortcuts}</h2>
                <div className="catalog-grid shortcuts-grid">
                  {practiceShortcuts.map((item) => (
                    <CatalogCard
                      key={item.id}
                      icon={item.icon}
                      title={m.shortcutsData[item.id].title}
                      description={m.shortcutsData[item.id].description}
                      href={item.status === "available" ? "#topics" : undefined}
                      badge={item.status === "planned" ? m.soon : undefined}
                    />
                  ))}
                </div>
              </section>
            )}
            <section
              className="catalog-section"
              id="topics"
              aria-labelledby="topics-title"
            >
              <div className="catalog-section-heading">
                <h2 id="topics-title">{m.areas[selectedArea].title}</h2>
                <span>{m.topics}</span>
              </div>
              <div className="catalog-grid topics-grid">
                {topics
                  .filter((item) => item.area === selectedArea)
                  .map((item) => {
                    const modes = availableModes(item);
                    return (
                      <CatalogCard
                        key={item.id}
                        title={item.title[locale]}
                        icon={item.icon}
                        description={
                          modes.length
                            ? `${item.level} · ${modes.length} ${m.modesLabel}`
                            : undefined
                        }
                        badge={modes.length ? undefined : m.soon}
                        href={
                          modes.length
                            ? `/${locale}/games/${item.area}/${item.id}`
                            : undefined
                        }
                      />
                    );
                  })}
              </div>
            </section>
          </>
        )}
      </div>
    </section>
  );
}
