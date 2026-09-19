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
