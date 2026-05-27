import assert from "node:assert/strict";
import test from "node:test";
import { analyzeEvalFailures } from "./v2-eval-analysis";

test("analyzeEvalFailures returns typed failure buckets", () => {
  const analysis = analyzeEvalFailures();

  assert.equal(analysis.runId, "local-eval-run-001");
  assert.ok(analysis.failures.length > 0);
  assert.ok(analysis.countsByType["top1-miss"] > 0);
  assert.ok(analysis.countsByType["citation-failure"] > 0);
  assert.ok("refusal-false-positive" in analysis.countsByType);
  assert.ok("refusal-false-negative" in analysis.countsByType);
});

test("failure analysis entries include reviewable evidence", () => {
  const analysis = analyzeEvalFailures();
  const first = analysis.failures[0];

  assert.match(first.questionId, /^eval-\d{3}$/);
  assert.ok(first.question.length > 0);
  assert.ok(Array.isArray(first.acceptableDocumentIds));
  assert.ok(Array.isArray(first.retrievedDocumentIds));
  assert.equal(typeof first.answerRefused, "boolean");
  assert.equal(typeof first.precisionAt3, "number");
});
