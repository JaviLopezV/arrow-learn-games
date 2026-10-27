"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/messages";
import { messages } from "@/i18n/messages";
import { languages, type Language } from "@/lib/animals";

const copy: Record<
  Locale,
  { title: string; auto: string; stop: string; ready: string }
> = {
  es: {
    title: "Tu compañero de práctica",
    auto: "Lectura automática",
    stop: "Detener audio",
    ready: "Escucha y practica conmigo",
  },
  ca: {
    title: "El teu company de pràctica",
    auto: "Lectura automàtica",
    stop: "Atura l’àudio",
    ready: "Escolta i practica amb mi",
  },
  en: {
    title: "Your practice buddy",
    auto: "Read automatically",
    stop: "Stop audio",
    ready: "Listen and practise with me",
  },
  fr: {
    title: "Ton compagnon de pratique",
    auto: "Lecture automatique",
    stop: "Arrêter l’audio",
    ready: "Écoute et pratique avec moi",
  },
  de: {
    title: "Dein Lernbegleiter",
    auto: "Automatisch vorlesen",
    stop: "Audio stoppen",
    ready: "Hör zu und übe mit mir",
  },
  it: {
    title: "Il tuo compagno di pratica",
    auto: "Lettura automatica",
    stop: "Ferma audio",
    ready: "Ascolta e pratica con me",
  },
  ja: {
    title: "練習のパートナー",
    auto: "自動読み上げ",
    stop: "音声を停止",
    ready: "聞いて一緒に練習しましょう",
  },
};
const speechLanguages: Record<Language, string> = {
  es: "es-ES",
  ca: "ca-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  ja: "ja-JP",
};

export function SpeakingAvatar({
  text,
  language,
  locale,
  cue,
  conceal = false,
  onUnavailable,
}: {
  text: string;
  language: Language;
  locale: Locale;
  cue: string;
  conceal?: boolean;
  onUnavailable?: () => void;
}) {
  const [automatic, setAutomatic] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(false);
  const active = useRef<SpeechSynthesisUtterance | null>(null);
  const m = copy[locale];
  const stop = useCallback(() => {
    active.current = null;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);
  const speak = useCallback(() => {
    stop();
    if (!text) return;
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      setError(true);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLanguages[language];
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find(
        (v) => v.lang.toLowerCase() === utterance.lang.toLowerCase(),
      ) ?? voices.find((v) => v.lang.toLowerCase().startsWith(language));
    if (voices.length && !voice) {
      setError(true);
      return;
    }
    if (voice) utterance.voice = voice;
    utterance.rate = 0.85;
    active.current = utterance;
    utterance.onstart = () => {
      if (active.current === utterance) setSpeaking(true);
    };
    utterance.onend = () => {
      if (active.current === utterance) {
        active.current = null;
        setSpeaking(false);
      }
    };
    utterance.onerror = (event) => {
      if (active.current !== utterance) return;
      setSpeaking(false);
      active.current = null;
      if (event.error !== "canceled" && event.error !== "interrupted")
        setError(true);
    };
    setError(false);
    window.speechSynthesis.speak(utterance);
  }, [text, language, stop]);
  useEffect(() => {
    try {
      setAutomatic(localStorage.getItem("arrow-avatar-auto") === "true");
    } catch {
      /* Optional preference. */
    }
  }, []);
  useEffect(() => {
    setError(false);
    if (automatic) speak();
    return stop;
  }, [cue, automatic, speak, stop]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, [stop]);
  return (
    <aside
      className={`speaking-buddy ${speaking ? "is-speaking" : ""}`}
      aria-label={m.title}
    >
      <div className="buddy-robot" aria-hidden="true">
        <span className="buddy-antenna" />
        <div className="buddy-face">
          <i />
          <i />
          <span className="buddy-mouth" />
        </div>
      </div>
      <div className="buddy-content">
        <div className="buddy-heading">
          <strong>Arlo</strong>
          <span>{languages[language]}</span>
        </div>
        <p>
          {text && !conceal ? <span lang={language}>{text}</span> : m.ready}
        </p>
        <div className="buddy-controls">
          <button
            type="button"
            onClick={speaking ? stop : speak}
            disabled={!text}
          >
            {speaking ? `■ ${m.stop}` : `▶ ${messages[locale].bingo.listen}`}
          </button>
          <label>
            <input
              type="checkbox"
              checked={automatic}
              onChange={(event) => {
                const enabled = event.target.checked;
                setAutomatic(enabled);
                try {
                  localStorage.setItem("arrow-avatar-auto", String(enabled));
                } catch {
                  /* Optional preference. */
                }
              }}
            />
            {m.auto}
          </label>
        </div>
        {error && (
          <div className="buddy-error" role="status">
            {messages[locale].play.audioUnavailable}
            {onUnavailable && (
              <button type="button" onClick={onUnavailable}>
                {messages[locale].play.skip}
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
