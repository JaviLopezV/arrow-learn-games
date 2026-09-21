import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import ts from "typescript";
const root = path.resolve(import.meta.dirname, "..");
const cache = new Map();
function load(file) {
  const filename = path.resolve(root, file);
  if (cache.has(filename)) return cache.get(filename);
  if (filename.endsWith(".json"))
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  const mod = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2017,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("exports", "module", "require", compiled)(
    mod.exports,
    mod,
    (name) => {
      const target = name.startsWith("@/")
        ? path.join(root, "src", name.slice(2))
        : path.resolve(path.dirname(filename), name);
      return load(path.extname(target) ? target : `${target}.ts`);
    },
  );
  cache.set(filename, mod.exports);
  return mod.exports;
}
const { topics, getTopic } = load("src/games/config/topics.ts");
const { availableModes, gameModes } = load("src/games/config/gameModes.ts");
const { loadSessionHistory, sessionHistoryKey } = load(
  "src/games/utils/history.ts",
);
const { historyKey } = load("src/lib/game-history.ts");
const { messages } = load("src/i18n/messages.ts");
const { languages } = load("src/lib/animals.ts");
const animals = getTopic("vocabulary", "animals");
const phrases = getTopic("phrases", "everyday-conversation");
const pronouns = getTopic("grammar", "subject-pronouns");

test("content is reusable across mechanics without leaking incompatible routes", () => {
  assert.deepEqual(
    availableModes(animals).map((m) => m.id),
    ["image-to-word", "translation", "matching"],
  );
  assert.deepEqual(
    availableModes(pronouns).map((m) => m.id),
    ["translation"],
  );
  assert.equal(getTopic("grammar", "animals"), undefined);
  assert.equal(getTopic("vocabulary", "unknown"), undefined);
  assert.deepEqual(availableModes(getTopic("vocabulary", "food")), []);
  const newTopic = {
    ...animals,
    id: "new-topic",
    items: [{ id: "word", words: animals.items[0].words }],
  };
  assert.deepEqual(
    availableModes(newTopic).map((m) => m.id),
    ["translation", "matching"],
  );
  assert.ok(
    gameModes
      .filter((m) => m.status === "planned")
      .every((m) => !availableModes(animals).includes(m)),
  );
});
test("catalogue content and translations are complete with real image assets", () => {
  for (const topic of topics) {
    assert.equal(
      new Set(topic.items.map((i) => i.id)).size,
      topic.items.length,
    );
    for (const locale of Object.keys(messages)) assert.ok(topic.title[locale]);
    for (const item of topic.items) {
      for (const lang of Object.keys(languages))
        assert.ok(item.words[lang]?.every((word) => word.trim()));
      if (item.image)
        assert.ok(fs.existsSync(path.join(root, "public", item.image)));
    }
    for (const mode of availableModes(topic)) {
      for (const locale of Object.keys(messages))
        assert.ok(messages[locale].catalog.modes[mode.id].description);
    }
  }
});
test("every original history maps only to its original content and mechanics", () => {
  const result = {
    id: "original",
    startedAt: "2026-09-19T12:00:00Z",
    target: "en",
    source: "es",
    points: 80,
    answered: 8,
    total: 8,
    completed: true,
  };
  const data = new Map();
  const storage = { getItem: (key) => data.get(key) ?? null };
  const originals = [
    [animals, "image-to-word", "picture"],
    [animals, "translation", "translation"],
    [pronouns, "translation", "pronouns"],
    [phrases, "matching", "matching"],
  ];
  for (const [topic, mode, legacy] of originals) {
    data.clear();
    data.set(historyKey(legacy), JSON.stringify([result]));
    assert.deepEqual(loadSessionHistory(storage, topic, mode), [result]);
    assert.deepEqual(loadSessionHistory(storage, animals, "matching"), []);
    data.set(sessionHistoryKey(topic, mode), JSON.stringify([result]));
    assert.equal(loadSessionHistory(storage, topic, mode).length, 1);
    assert.ok(data.has(historyKey(legacy)));
  }
  assert.equal(
    new Set(
      topics.flatMap((t) =>
        availableModes(t).map((m) => sessionHistoryKey(t, m.id)),
      ),
    ).size,
    7,
  );
});
test("new rounds preserve the original sentence sampling and pronoun contexts", () => {
  const deck = phrases.createDeck();
  assert.equal(deck.length, 8);
  for (const verb of ["happy", "drink", "eat", "live"])
    assert.equal(
      deck.filter((item) => item.id.startsWith(`${verb}-`)).length,
      2,
    );
  assert.equal(pronouns.items.length, 12);
  assert.ok(
    pronouns.items.every((item) =>
      Object.keys(messages).every((locale) => item.context[locale]),
    ),
  );
});

const { createBingoCard, completedLines } = load("src/lib/bingo.ts");
const { numberWord, numbers } = load("src/lib/numbers.ts");
test("bingo cards have 15 unique numbers, five per row, sorted in their columns", () => {
  for (let attempt = 0; attempt < 200; attempt++) {
    const card = createBingoCard();
    const values = card.flat().filter((n) => n !== null);
    assert.equal(new Set(values).size, 15);
    assert.ok(values.every((n) => n >= 1 && n <= 99));
    for (const row of card) {
      assert.equal(row.length, 9);
      assert.equal(row.filter((n) => n !== null).length, 5);
    }
    for (let col = 0; col < 9; col++) {
      const values = card.map((row) => row[col]).filter((n) => n !== null);
      assert.ok(values.length > 0);
      assert.deepEqual(
        values,
        [...values].sort((a, b) => a - b),
      );
      assert.ok(
        values.every((n) => (col === 8 ? n >= 80 : Math.floor(n / 10) === col)),
      );
    }
    assert.equal(completedLines(card, []), 0);
    assert.equal(
      completedLines(
        card,
        card[0].filter((n) => n !== null),
      ),
      1,
    );
    assert.equal(completedLines(card, values), 3);
  }
});
test("number vocabulary covers 1–99 and irregular forms across six languages", () => {
  assert.equal(numbers.length, 99);
  for (const language of Object.keys(languages)) {
    const words = numbers.map((item) => item.words[language][0]);
    assert.equal(new Set(words).size, 99);
    assert.ok(words.every((word) => word && !word.includes("undefined")));
  }
  for (const [n, lang, expected] of [
    [22, "es", "veintidós"],
    [31, "es", "treinta y uno"],
    [21, "ca", "vint-i-un"],
    [99, "en", "ninety-nine"],
    [71, "fr", "soixante et onze"],
    [80, "fr", "quatre-vingts"],
    [99, "fr", "quatre-vingt-dix-neuf"],
    [21, "de", "einundzwanzig"],
    [28, "it", "ventotto"],
    [33, "it", "trentatré"],
  ])
    assert.equal(numberWord(n, lang), expected);
  assert.throws(() => numberWord(100, "es"), RangeError);
  assert.deepEqual(
    availableModes(getTopic("vocabulary", "numbers")).map((m) => m.id),
    ["bingo"],
  );
});

const { createBingoDraw, canMarkBingoNumber } = load("src/lib/bingo.ts");
test("bingo draws all 99 numbers exactly once, including those outside the card", () => {
  const expected = Array.from({ length: 99 }, (_, i) => i + 1);
  for (let i = 0; i < 50; i++) {
    const deck = createBingoDraw();
    assert.deepEqual(
      [...deck].sort((a, b) => a - b),
      expected,
    );
    assert.equal(canMarkBingoNumber(deck[0], deck, 0), true);
    assert.equal(canMarkBingoNumber(deck[1], deck, 0), false);
    assert.equal(canMarkBingoNumber(deck[0], deck, 50), true);
    assert.equal(canMarkBingoNumber(deck[98], deck, 97), false);
    assert.ok(expected.every((n) => canMarkBingoNumber(n, deck, 98)));
  }
});
