import { analyzeEvalFailures } from "../src/lib/v2-eval-analysis";

const analysis = analyzeEvalFailures();

console.log(`Eval failure analysis for ${analysis.runId}`);
console.log("");
console.log("Metrics:");
console.table(analysis.metrics);
console.log("");
console.log("Failure counts:");
console.table(analysis.countsByType);
console.log("");

for (const failure of analysis.failures) {
  console.log(
    [
      `${failure.questionId} [${failure.category}] ${failure.failureType}`,
      `  question: ${failure.question}`,
      `  acceptable: ${failure.acceptableDocumentIds.join(", ") || "none"}`,
      `  retrieved: ${failure.retrievedDocumentIds.join(", ") || "none"}`,
      `  refused: ${failure.answerRefused}`,
      `  citations: ${failure.citationMarkers.join(", ") || "none"}`,
      `  precision@3: ${failure.precisionAt3.toFixed(2)}`,
    ].join("\n"),
  );
  console.log("");
}
