import { documents, runEval } from "./v2-data";

export function buildEvalArtifact(options: { createdAt?: string; retriever?: string } = {}) {
  const retriever = options.retriever ?? "deterministic";
  const createdAt = options.createdAt ?? new Date().toISOString();
  const run = runEval();

  return {
    id: `${createdAt.slice(0, 10)}-${retriever}-${run.id}`,
    sourceRunId: run.id,
    createdAt,
    retriever,
    corpus: {
      documentCount: documents.length,
    },
    metrics: run.metrics,
    results: run.results,
  };
}
