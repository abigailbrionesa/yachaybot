import assert from "node:assert/strict";
import test from "node:test";
import { buildAnswer, classifyEvidence, getSearchResultsForChunkIds, runEval, searchCorpus } from "./v2-data";

test("searchCorpus returns ranked source cards for an EIB query", () => {
  const search = searchCorpus("Que recursos explican educacion intercultural bilingue?", 5);

  assert.equal(search.language, "es");
  assert.ok(search.results.length > 0);
  assert.equal(search.results[0].documentId, "doc-minedu-eib-001");
  assert.ok(search.results[0].score > 0);
});

test("searchCorpus handles no-result queries", () => {
  const search = searchCorpus("zzzzzzzz unrelated", 5);

  assert.deepEqual(search.results, []);
  assert.equal(classifyEvidence(search.results), "weak");
});

test("buildAnswer refuses weak evidence", () => {
  const answer = buildAnswer("Explain an unindexed topic", []);

  assert.equal(answer.refused, true);
  assert.equal(answer.citations.length, 0);
  assert.equal(answer.evidenceStrength, "weak");
});

test("buildAnswer cites reviewed chunks", () => {
  const reviewed = getSearchResultsForChunkIds(["chunk-doc-minedu-eib-001"]);
  const answer = buildAnswer("Que recursos explican educacion intercultural bilingue?", reviewed);

  assert.equal(answer.refused, false);
  assert.equal(answer.citations[0].chunkId, "chunk-doc-minedu-eib-001");
});

test("runEval calculates retrieval and refusal metrics", () => {
  const run = runEval();

  assert.ok(run.results.length >= 15);
  assert.ok(run.metrics.top5HitRate >= 0);
  assert.ok(run.metrics.refusalPassRate >= 0);
  assert.ok(run.metrics.citationPassRate >= 0);
  assert.ok(Number.isFinite(run.metrics.averageLatencyMs));
});

test("searchCorpus prioritizes title and topic matches over generic content", () => {
  const search = searchCorpus("patrimonio andino qhapaq nan", 3);

  assert.equal(search.results[0].documentId, "doc-qhapaq-nan-012");
  assert.ok(search.results[0].score > search.results[1].score);
});

test("runEval includes harder unsupported and multilingual boundary cases", () => {
  const run = runEval();
  const categories = new Set(run.results.map((result) => result.category));

  assert.ok(categories.has("unsupported"));
  assert.ok(categories.has("ambiguous"));
  assert.ok(categories.has("multilingual-boundary"));
  assert.ok(categories.has("off-topic"));
  assert.ok(run.results.some((result) => result.citationMarkers.length > 0));
});
