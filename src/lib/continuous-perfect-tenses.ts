import type { BaseLocalizedText } from "@/i18n/additional";
import type { Topic } from "@/games/types/game.types";

export type ExtendedTense = {
  id: string;
  title: BaseLocalizedText;
  level: Topic["level"];
  phrases: string[];
};

// Meaning equivalents: languages do not all share the same tense system.
export const continuousPerfectTenses: ExtendedTense[] = [
  {
    id: "present-continuous",
    title: {
      es: "Presente continuo",
      ca: "Present continu",
      en: "Present continuous",
    },
    level: "A2",
    phrases: [
      "Estoy trabajando",
      "Estic treballant",
      "I am working",
      "Je suis en train de travailler",
      "Ich arbeite gerade",
      "Sto lavorando",
      "今働いています",
    ],
  },
  {
    id: "past-continuous",
    title: {
      es: "Pasado continuo",
      ca: "Passat continu",
      en: "Past continuous",
    },
    level: "A2",
    phrases: [
      "Estaba trabajando",
      "Estava treballant",
      "I was working",
      "J’étais en train de travailler",
      "Ich war gerade am Arbeiten",
      "Stavo lavorando",
      "その時働いていました",
    ],
  },
  {
    id: "future-continuous",
    title: {
      es: "Futuro continuo",
      ca: "Futur continu",
      en: "Future continuous",
    },
    level: "B1",
    phrases: [
      "Mañana a esta hora estaré trabajando",
      "Demà a aquesta hora estaré treballant",
      "Tomorrow at this time I will be working",
      "Demain à cette heure-ci, je serai en train de travailler",
      "Morgen um diese Zeit werde ich gerade arbeiten",
      "Domani a quest’ora starò lavorando",
      "明日の今頃は働いているでしょう",
    ],
  },
  {
    id: "present-perfect",
    title: {
      es: "Pretérito perfecto compuesto",
      ca: "Perfet",
      en: "Present perfect",
    },
    level: "A2",
    phrases: [
      "Hoy he trabajado",
      "Avui he treballat",
      "I have worked today",
      "J’ai travaillé aujourd’hui",
      "Ich habe heute gearbeitet",
      "Oggi ho lavorato",
      "今日はもう働きました",
    ],
  },
  {
    id: "past-perfect",
    title: { es: "Pluscuamperfecto", ca: "Plusquamperfet", en: "Past perfect" },
    level: "B1",
    phrases: [
      "Ya había trabajado",
      "Ja havia treballat",
      "I had already worked",
      "J’avais déjà travaillé",
      "Ich hatte schon gearbeitet",
      "Avevo già lavorato",
      "すでに働いていました",
    ],
  },
  {
    id: "future-perfect",
    title: { es: "Futuro perfecto", ca: "Futur perfet", en: "Future perfect" },
    level: "B2",
    phrases: [
      "Para mañana ya habré trabajado",
      "Demà ja hauré treballat",
      "By tomorrow I will have worked",
      "D’ici demain, j’aurai déjà travaillé",
      "Bis morgen werde ich schon gearbeitet haben",
      "Entro domani avrò già lavorato",
      "明日までにはもう働き終えているでしょう",
    ],
  },
  {
    id: "present-perfect-continuous",
    title: {
      es: "Presente perfecto continuo",
      ca: "Perfet continu",
      en: "Present perfect continuous",
    },
    level: "B1",
    phrases: [
      "Llevo dos horas trabajando",
      "Fa dues hores que treballo",
      "I have been working for two hours",
      "Je travaille depuis deux heures",
      "Ich arbeite seit zwei Stunden",
      "Lavoro da due ore",
      "二時間前からずっと働いています",
    ],
  },
  {
    id: "past-perfect-continuous",
    title: {
      es: "Pasado perfecto continuo",
      ca: "Plusquamperfet continu",
      en: "Past perfect continuous",
    },
    level: "B2",
    phrases: [
      "Llevaba dos horas trabajando",
      "Feia dues hores que treballava",
      "I had been working for two hours",
      "Je travaillais depuis deux heures",
      "Ich hatte schon zwei Stunden gearbeitet",
      "Lavoravo da due ore",
      "その時まで二時間ずっと働いていました",
    ],
  },
  {
    id: "future-perfect-continuous",
    title: {
      es: "Futuro perfecto continuo",
      ca: "Futur perfet continu",
      en: "Future perfect continuous",
    },
    level: "B2",
    phrases: [
      "A las cinco llevaré dos horas trabajando",
      "A les cinc farà dues hores que treballo",
      "At five I will have been working for two hours",
      "À cinq heures, cela fera deux heures que je travaille",
      "Um fünf werde ich seit zwei Stunden arbeiten",
      "Alle cinque saranno due ore che lavoro",
      "五時には二時間ずっと働いていることになります",
    ],
  },
];
