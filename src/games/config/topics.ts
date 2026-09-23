import { vocabularyItems } from "@/lib/vocabulary";
import { numbers } from "@/lib/numbers";
import { animals } from "@/lib/animals";
import { pronouns } from "@/lib/pronouns";
import { sentences, shuffledSentences } from "@/lib/sentences";
import { messages } from "@/i18n/messages";
import type { Topic } from "../types/game.types";
export const topics: Topic[] = [
  {
    id: "numbers",
    area: "vocabulary",
    icon: "🔢",
    level: "A1",
    title: {
      es: "Números del 1 al 99",
      ca: "Nombres de l’1 al 99",
      en: "Numbers 1–99",
    },
    items: numbers,
    availableGameModes: ["bingo"],
  },
  {
    id: "animals",
    area: "vocabulary",
    title: { es: "Animales", ca: "Animals", en: "Animals" },
    icon: "🐾",
    level: "A1",
    items: animals.map((item) => ({
      ...item,
      image: `/animals/${item.id}.svg`,
    })),
    availableGameModes: ["image-to-word", "translation", "matching"],
    legacyHistory: { "image-to-word": "picture", translation: "translation" },
  },
  {
    id: "subject-pronouns",
    area: "grammar",
    title: {
      es: "Pronombres sujeto",
      ca: "Pronoms subjecte",
      en: "Subject pronouns",
    },
    icon: "👥",
    level: "A1",
    items: pronouns.map((item) => ({
      ...item,
      context: {
        es: messages.es.games.pronounContexts[item.id],
        ca: messages.ca.games.pronounContexts[item.id],
        en: messages.en.games.pronounContexts[item.id],
      },
    })),
    availableGameModes: ["translation"],
    reference: "subject-pronouns",
    legacyHistory: { translation: "pronouns" },
  },
  {
    id: "everyday-conversation",
    area: "phrases",
    title: {
      es: "Conversación cotidiana",
      ca: "Conversa quotidiana",
      en: "Everyday conversation",
    },
    icon: "💬",
    level: "A1",
    items: sentences,
    createDeck: shuffledSentences,
    availableGameModes: ["translation", "matching"],
    legacyHistory: { matching: "matching" },
  },
  ...(
    [
      ["food", "🍎", "Comida y bebida", "Menjar i beguda", "Food and drink"],
      ["home", "🏠", "Casa", "Casa", "Home"],
      ["clothes", "👕", "Ropa", "Roba", "Clothes"],
      ["transport", "🚲", "Transporte", "Transport", "Transport"],
      ["body", "🖐️", "Cuerpo", "Cos", "Body"],
    ] as const
  ).map(
    ([id, icon, es, ca, en]): Topic => ({
      id,
      icon,
      area: "vocabulary",
      title: { es, ca, en },
      level: "A1",
      items: vocabularyItems(id),
      roundSize: 8,
      availableGameModes: ["image-to-word", "translation", "matching"],
    }),
  ),
];
export const getTopic = (area: string, id: string) =>
  topics.find((topic) => topic.area === area && topic.id === id);
