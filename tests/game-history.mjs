import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { test } from "node:test";
const testDirectory = path.dirname(fileURLToPath(import.meta.url));

function load(file) {
  const filename = path.resolve(testDirectory, "..", file);
  const mod = { exports: {} };
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2017,
    },
  }).outputText;
  new Function("exports", "module", "require", compiled)(
    mod.exports,
    mod,
    (name) =>
      load(
        path.relative(
          path.resolve(testDirectory, ".."),
          path.resolve(path.dirname(filename), `${name}.ts`),
        ),
      ),
  );
  return mod.exports;
}
const { emptyHistory, historyKey, mergeHistory, readHistory } = load(
  "src/lib/game-history.ts",
);
const result = {
  id: "first",
  startedAt: "2026-09-19T12:00:00Z",
  target: "en",
  source: "es",
  points: 60,
  answered: 8,
  total: 8,
  completed: true,
};

test("game histories stay independent and survive serialization", () => {
  const history = emptyHistory();
  history.picture = mergeHistory(history.picture, [result]);
  assert.equal(history.translation.length, 0);
  assert.equal(history.pronouns.length, 0);
  assert.equal(
    new Set(["picture", "translation", "pronouns"].map(historyKey)).size,
    3,
  );
  assert.deepEqual(readHistory(JSON.stringify(history.picture)), [result]);
});
test("new games start at zero and never overwrite previous games", () => {
  const fresh = {
    ...result,
    id: "second",
    startedAt: "2026-09-19T12:01:00Z",
    points: 0,
    answered: 0,
    completed: false,
  };
  const history = mergeHistory([result], [fresh]);
  assert.deepEqual(
    history.map((r) => r.points),
    [0, 60],
  );
  assert.equal(history.filter((r) => r.completed).length, 1);
});
test("saving an answer twice does not duplicate a game; stale saves do not roll it back", () => {
  const partial = { ...result, points: 10, answered: 2, completed: false };
  const history = mergeHistory([partial], [result, result, partial]);
  assert.deepEqual(history, [result]);
});
test("unfinished and zero-score completed games remain distinguishable", () => {
  const failed = { ...result, points: 0 };
  const partial = {
    ...result,
    id: "partial",
    points: 0,
    answered: 2,
    completed: false,
  };
  assert.equal(readHistory(JSON.stringify([failed, partial])).length, 2);
  assert.deepEqual(readHistory(JSON.stringify([failed])), [failed]);
});
test("corrupted storage and invalid records do not crash or poison valid results", () => {
  for (const raw of [null, "broken", "{}", "null"])
    assert.deepEqual(readHistory(raw), []);
  const invalid = [
    { ...result, points: 90 },
    { ...result, answered: -1 },
    { ...result, completed: false },
    { ...result, target: "xx" },
    { ...result, startedAt: "bad" },
    { ...result, points: 15 },
  ];
  assert.deepEqual(readHistory(JSON.stringify([...invalid, result])), [result]);
});

const { sentences, shuffledSentences } = load("src/lib/sentences.ts");
const { languages } = load("src/lib/animals.ts");
test("matching sentences have distinct, nonempty translations in every language", () => {
  assert.equal(
    new Set(sentences.map((item) => item.id)).size,
    sentences.length,
  );
  for (const language of Object.keys(languages)) {
    const translations = sentences.map((item) => item.words[language][0]);
    assert.ok(
      translations.every((text) => typeof text === "string" && text.trim()),
    );
    assert.equal(new Set(translations).size, sentences.length);
  }
});
test("matching rounds contain eight unique pairs and all four verbs", () => {
  for (let i = 0; i < 50; i++) {
    const deck = shuffledSentences();
    assert.equal(deck.length, 8);
    assert.equal(new Set(deck.map((item) => item.id)).size, 8);
    for (const verb of ["happy", "drink", "eat", "live"])
      assert.equal(
        deck.filter((item) => item.id.startsWith(`${verb}-`)).length,
        2,
      );
  }
});
test("matching scores persist separately from the existing games", () => {
  const history = emptyHistory();
  history.matching = mergeHistory(history.matching, [result]);
  assert.deepEqual(readHistory(JSON.stringify(history.matching)), [result]);
  for (const mode of ["picture", "translation", "pronouns"])
    assert.deepEqual(history[mode], []);
  assert.equal(new Set(Object.keys(history).map(historyKey)).size, 4);
});
