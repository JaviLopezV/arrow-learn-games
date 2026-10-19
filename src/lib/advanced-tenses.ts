import type { Topic } from "@/games/types/game.types";
import { continuousPerfectTenses } from "./continuous-perfect-tenses";
import { moodTenses } from "./mood-tenses";

export const extendedTenses = [...continuousPerfectTenses, ...moodTenses];

const places = [
  ["en casa", "a casa", "at home", "à la maison", "zu Hause", "a casa", "家で"],
  [
    "en la oficina",
    "a l’oficina",
    "at the office",
    "au bureau",
    "im Büro",
    "in ufficio",
    "オフィスで",
  ],
  [
    "en la escuela",
    "a l’escola",
    "at school",
    "à l’école",
    "in der Schule",
    "a scuola",
    "学校で",
  ],
  [
    "en la biblioteca",
    "a la biblioteca",
    "at the library",
    "à la bibliothèque",
    "in der Bibliothek",
    "in biblioteca",
    "図書館で",
  ],
  [
    "en el jardín",
    "al jardí",
    "in the garden",
    "dans le jardin",
    "im Garten",
    "in giardino",
    "庭で",
  ],
  [
    "en el hospital",
    "a l’hospital",
    "at the hospital",
    "à l’hôpital",
    "im Krankenhaus",
    "in ospedale",
    "病院で",
  ],
  [
    "en el hotel",
    "a l’hotel",
    "at the hotel",
    "à l’hôtel",
    "im Hotel",
    "in albergo",
    "ホテルで",
  ],
  [
    "en la tienda",
    "a la botiga",
    "at the shop",
    "au magasin",
    "im Laden",
    "in negozio",
    "店で",
  ],
];

const languages = ["es", "ca", "en", "fr", "de", "it", "ja"] as const;
export const extendedTenseTopics: Topic[] = extendedTenses.map((tense) => ({
  id: `${tense.id}-tense`,
  area: "grammar",
  title: tense.title,
  icon: tense.id === "imperative" ? "📣" : "🕰️",
  level: tense.level,
  roundSize: 8,
  availableGameModes: ["translation", "matching"],
  items: places.map((place, index) => ({
    id: `${tense.id}-${index + 1}`,
    words: Object.fromEntries(
      languages.map((language, i) => {
        let base = tense.phrases[i];
        if (tense.id === "imperative" && index % 2) {
          base = [
            "No trabajes",
            "No treballis",
            "Do not work",
            "Ne travaille pas",
            "Arbeite nicht",
            "Non lavorare",
            "働かないでください",
          ][i];
        }
        let text = `${base} ${place[i]}`;
        if (language === "ja") text = place[i] + base;
        if (language === "de") {
          text = base.startsWith("Ich ")
            ? base.replace(/^(Ich \S+)/, `$1 ${place[i]}`)
            : `${base} ${place[i]}`;
          for (const subject of [", würde ich", ", hätte ich", "werde ich"]) {
            if (base.includes(subject))
              text = base.replace(subject, `${subject} ${place[i]}`);
          }
          for (const ending of ["gearbeitet hast", "arbeitest"]) {
            if (base.endsWith(`, dass du ${ending}`)) {
              text = base.slice(0, -ending.length) + place[i] + " " + ending;
            }
          }
        }
        const variants = [text];
        if (language === "en" && text.includes("Do not"))
          variants.push(text.replace("Do not", "Don't"));
        return [language, variants];
      }),
    ) as Topic["items"][number]["words"],
  })),
}));
