import type { Locale } from "./messages";

export const compactCopy: Record<Locale, { overview: string; instructions: string; tip: string; games: string; study: string; choose: string }> = {
  es: { overview: "Sobre este plan", instructions: "Cómo jugar", tip: "Consejo de estudio", games: "Elige un tema o una práctica rápida.", study: "Aprende, practica y sigue tu progreso.", choose: "Elige cómo practicar." },
  ca: { overview: "Sobre aquest pla", instructions: "Com jugar", tip: "Consell d’estudi", games: "Tria un tema o una pràctica ràpida.", study: "Aprèn, practica i segueix el teu progrés.", choose: "Tria com practicar." },
  en: { overview: "About this plan", instructions: "How to play", tip: "Study tip", games: "Choose a topic or a quick practice.", study: "Learn, practise and track your progress.", choose: "Choose how to practise." },
  fr: { overview: "À propos du plan", instructions: "Comment jouer", tip: "Conseil d’étude", games: "Choisissez un thème ou une pratique rapide.", study: "Apprenez, pratiquez et suivez vos progrès.", choose: "Choisissez comment pratiquer." },
  de: { overview: "Über diesen Lernplan", instructions: "Spielanleitung", tip: "Lerntipp", games: "Wähle ein Thema oder eine kurze Übung.", study: "Lerne, übe und verfolge deinen Fortschritt.", choose: "Wähle deine Übung." },
  it: { overview: "Informazioni sul piano", instructions: "Come giocare", tip: "Consiglio di studio", games: "Scegli un tema o una pratica veloce.", study: "Impara, esercitati e segui i tuoi progressi.", choose: "Scegli come esercitarti." },
  ja: { overview: "このプランについて", instructions: "遊び方", tip: "学習のヒント", games: "テーマやかんたん練習を選びましょう。", study: "学んで、練習して、進み具合を確認。", choose: "練習方法を選びましょう。" },
};
