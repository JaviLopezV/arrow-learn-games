"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/i18n/messages";
import { languages, type Language } from "@/lib/animals";
import { learnCopy } from "./copy";

import { lessons } from "./lessons";
import { Lesson } from "./Lesson";
type Progress = Record<string, string[]>;
const storageKey = "arrow-learn-syllabus-v1";

export function LearningHub({ locale }: { locale: Locale }) {
  const m = learnCopy[locale];
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
  const topic = lessons.find((lesson) => lesson.id === selected)!;
  return (
    <section className="learn-page">
      <div className="games-container">
        <header className="learn-hero">
          <span className="section-kicker">✦ {m.kicker}</span>
          <h1>{m.title}</h1>
          <p>{m.intro}</p>
          <div className="learn-settings">
            <label>
              {m.language}
              <select
                value={target}
                onChange={(event) => {
                  const value = event.target.value as Language;
                  setTarget(value);
                  if (value === source) setSource(target);
                }}
              >
                {Object.entries(languages).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <span aria-hidden="true">↔</span>
            <label>
              {m.source}
              <select
                value={source}
                onChange={(event) => {
                  const value = event.target.value as Language;
                  setSource(value);
                  if (value === target) setTarget(source);
                }}
              >
                {Object.entries(languages).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>
        <h2>{m.route}</h2>
        <div className="learn-path" aria-label={m.route}>
          {lessons.map((lesson, index) => {
            const count = lesson.items.filter((item) =>
              (progress[`${lesson.id}:${source}:${target}`] || []).includes(
                item.id,
              ),
            ).length;
            return (
              <button
                key={lesson.id}
                className={`learn-topic ${selected === lesson.id ? "is-selected" : ""}`}
                aria-pressed={selected === lesson.id}
                onClick={() => setSelected(lesson.id)}
              >
                <span className="learn-topic-icon" aria-hidden="true">
                  {lesson.icon}
                </span>
                <small>0{index + 1} · A1</small>
                <strong>{lesson.title[locale]}</strong>
                <span>
                  {lesson.items.length} {m.cards} · {count} {m.mastered}
                </span>
                <progress
                  aria-label={`${lesson.title[locale]}: ${m.mastered}`}
                  value={count}
                  max={lesson.items.length}
                />
              </button>
            );
          })}
        </div>
        <p className="learn-save" role="status">
          {storageError ? m.storage : m.saved}
        </p>
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
    </section>
  );
}
