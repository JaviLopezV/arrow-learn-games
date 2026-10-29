"use client";

import { compactCopy } from "@/i18n/compact";
import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/messages";
import { languages, type Language } from "@/lib/animals";
import { learnCopy } from "./copy";

import { curriculum, orderedLessons as lessons } from "./curriculum";
import { curriculumCopy } from "./curriculum-copy";
import { Lesson } from "./Lesson";
import { LearningHeader } from "./LearningHeader";
type Progress = Record<string, string[]>;
const storageKey = "arrow-learn-syllabus-v1";

export function LearningHub({ locale }: { locale: Locale }) {
  const m = learnCopy[locale];
  const plan = curriculumCopy[locale];
  const [target, setTarget] = useState<Language>(locale === "en" ? "es" : "en");
  const [source, setSource] = useState<Language>(locale);
  const [selected, setSelected] = useState(lessons[0].id);
  const [progress, setProgress] = useState<Progress>({});
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(
        localStorage.getItem(storageKey) || "{}",
      );
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        setProgress(
          Object.fromEntries(
            Object.entries(saved).filter(
              ([, value]) =>
                Array.isArray(value) &&
                value.every((id) => typeof id === "string"),
            ),
          ),
        );
      }
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  function mark(id: string) {
    const key = `${selected}:${source}:${target}`;
    const next = {
      ...progress,
      [key]: [...new Set([...(progress[key] || []), id])],
    };
    setProgress(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(true);
    }
  }
  const masteredCount = (id: string) => {
    const lesson = lessons.find((entry) => entry.id === id)!;
    return lesson.items.filter((item) =>
      (progress[`${id}:${source}:${target}`] || []).includes(item.id),
    ).length;
  };
  const completed = lessons.filter(
    (lesson) => masteredCount(lesson.id) === lesson.items.length,
  ).length;
  const recommended = lessons.find(
    (lesson) => masteredCount(lesson.id) < lesson.items.length,
  );
  const topic = lessons.find((lesson) => lesson.id === selected)!;
  return (
    <section className="learn-page">
      <div className="games-container">
        <LearningHeader
          locale={locale}
          source={source}
          target={target}
          setSource={setSource}
          setTarget={setTarget}
        />
        <section className="study-overview" aria-labelledby="study-title">
          <div>
            <span className="section-kicker">{languages[target]}</span>
            <h2 id="study-title">{plan.title}</h2>
            <details className="app-disclosure"><summary>{compactCopy[locale].overview}</summary><p>{plan.intro}</p><small>{plan.scope}</small></details>
          </div>
          <div className="study-summary" aria-live="polite">
            <strong>
              {ready ? completed : "—"} / {lessons.length} {plan.completed}
            </strong>
            <progress
              aria-label={plan.completed}
              value={ready ? completed : 0}
              max={lessons.length}
            />
            {ready && !recommended && <p>{plan.finish}</p>}
            <button
              className="learn-button primary"
              disabled={!ready}
              onClick={() => {
                setSelected((recommended || lessons[0]).id);
                document
                  .getElementById("study-lesson")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {recommended ? plan.continue : plan.review} →
            </button>
            {ready && recommended && (
              <small>
                {plan.recommended}: {recommended.title[locale]}
              </small>
            )}
          </div>
        </section>
        {curriculum.map((stage, stageIndex) => {
          const stageLessons = lessons.filter((lesson) =>
            (stage.topics as readonly string[]).includes(lesson.id),
          );
          const stageDone = stageLessons.filter(
            (lesson) => masteredCount(lesson.id) === lesson.items.length,
          ).length;
          return (
            <section
              className="study-stage"
              key={stage.id}
              aria-labelledby={`stage-${stage.id}`}
            >
              <div className="study-stage-heading">
                <div>
                  <span className="section-kicker">
                    {plan.stage} {stageIndex + 1}
                  </span>
                  <h2 id={`stage-${stage.id}`}>{plan.stages[stageIndex][0]}</h2>
                  <p>{plan.stages[stageIndex][1]}</p>
                </div>
                <span>
                  {ready ? stageDone : "—"} / {stageLessons.length}{" "}
                  {plan.completed}
                </span>
              </div>
              <div className="learn-path">
                {stageLessons.map((lesson) => {
                  const count = ready ? masteredCount(lesson.id) : 0;
                  return (
                    <button
                      key={lesson.id}
                      className={`learn-topic ${selected === lesson.id ? "is-selected" : ""}`}
                      aria-pressed={selected === lesson.id}
                      onClick={() => {
                        setSelected(lesson.id);
                        document.getElementById("study-lesson")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                      }}
                    >
                      <span className="learn-topic-icon" aria-hidden="true">
                        {lesson.icon}
                      </span>
                      <small>
                        {String(lessons.indexOf(lesson) + 1).padStart(2, "0")} ·{" "}
                        {lesson.level}
                      </small>
                      <strong>{lesson.title[locale]}</strong>
                      <span>
                        {lesson.items.length} {m.cards} · {count} {m.mastered}
                      </span>
                      <progress
                        aria-label={`${lesson.title[locale]}: ${m.mastered}`}
                        value={count}
                        max={lesson.items.length}
                      />
                      <small>
                        {count === lesson.items.length
                          ? `✓ ${plan.done}`
                          : count
                            ? plan.current
                            : plan.pending}
                      </small>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        <p className="learn-save" role="status">
          {storageError ? m.storage : m.saved}
        </p>
        <div id="study-lesson">
          <Lesson
            key={`${selected}:${source}:${target}`}
            topic={topic}
            locale={locale}
            source={source}
            target={target}
            known={progress[`${selected}:${source}:${target}`] || []}
            mark={mark}
            ready={ready}
          />
        </div>
      </div>
    </section>
  );
}
