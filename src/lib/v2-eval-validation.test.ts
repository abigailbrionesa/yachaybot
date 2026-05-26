import assert from "node:assert/strict";
import test from "node:test";
import { buildEvalArtifact } from "./v2-eval-artifact";
import { documents, evalQuestions, runEval } from "./v2-data";
import type { EvalQuestion } from "./v2-types";

const requiredCategories: Array<EvalQuestion["category"]> = [
  "retrieval",
  "paraphrase",
  "typo-noisy",
  "mixed-language",
  "source-confusion",
  "hard-negative",
  "unsupported",
  "ambiguous",
  "multilingual-boundary",
  "off-topic",
  "citation",
];

const metricKeys = [
  "top1HitRate",
  "top3HitRate",
  "top5HitRate",
  "meanReciprocalRank",
  "precisionAt3",
  "recallAt5",
  "refusalPassRate",
  "refusalFalsePositiveRate",
  "refusalFalseNegativeRate",
  "citationPassRate",
  "citationCoverage",
  "averageLatencyMs",
  "p50LatencyMs",
  "p95LatencyMs",
];

test("Eval v2 fixture has stable benchmark structure", () => {
  const ids = new Set(evalQuestions.map((question) => question.id));
  const categories = new Set(evalQuestions.map((question) => question.category));
  const documentIds = new Set(documents.map((document) => document.id));

  assert.equal(evalQuestions.length, 50);
  assert.equal(ids.size, evalQuestions.length);

  for (const category of requiredCategories) {
    assert.ok(categories.has(category), `missing eval category: ${category}`);
  }

  for (const question of evalQuestions) {
    assert.match(question.id, /^eval-\d{3}$/);
    assert.ok(question.question.length > 10);
    assert.ok(typeof question.shouldRefuse === "boolean");
    assert.ok(question.rationale && question.rationale.length > 10);

    if (question.expectedDocumentId) {
      assert.ok(documentIds.has(question.expectedDocumentId), `unknown expectedDocumentId: ${question.expectedDocumentId}`);
    }

    for (const documentId of question.acceptableDocumentIds ?? []) {
      assert.ok(documentIds.has(documentId), `unknown acceptableDocumentId: ${documentId}`);
    }
  }
});

test("Eval v2 metrics expose richer retrieval and refusal shape", () => {
  const run = runEval();

  for (const key of metricKeys) {
    assert.ok(key in run.metrics, `missing metric: ${key}`);
    assert.equal(typeof run.metrics[key as keyof typeof run.metrics], "number");
    assert.ok(Number.isFinite(run.metrics[key as keyof typeof run.metrics]));
  }

  assert.equal(run.results.length, evalQuestions.length);
  assert.ok(run.results.every((result) => Array.isArray(result.acceptableDocumentIds)));
  assert.ok(run.results.every((result) => typeof result.top1Hit === "boolean"));
  assert.ok(run.results.every((result) => typeof result.reciprocalRank === "number"));
  assert.ok(run.results.every((result) => typeof result.precisionAt3 === "number"));
  assert.ok(run.results.every((result) => typeof result.recallAt5 === "number"));
});

test("Eval artifact builder returns inspectable run output shape", () => {
  const artifact = buildEvalArtifact({
    createdAt: "2026-05-26T00:00:00.000Z",
    retriever: "deterministic",
  });

  assert.equal(artifact.id, "2026-05-26-deterministic-local-eval-run-001");
  assert.equal(artifact.sourceRunId, "local-eval-run-001");
  assert.equal(artifact.retriever, "deterministic");
  assert.equal(artifact.corpus.documentCount, documents.length);
  assert.equal(artifact.results.length, evalQuestions.length);

  for (const key of metricKeys) {
    assert.ok(key in artifact.metrics, `artifact missing metric: ${key}`);
  }
});
