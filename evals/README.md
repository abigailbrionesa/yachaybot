# YachayBot v2 Evals

This directory owns evaluation fixtures, question sets, and local outputs for retrieval and refusal checks.

## Eval Layers

YachayBot separates evaluation into three layers:

- Regression evals: fast checks that protect current deterministic MVP behavior.
- Retrieval-quality benchmark evals: harder fixture cases for inspecting retrieval, refusal, citation, and latency behavior.
- Future retriever comparison evals: the same benchmark used to compare deterministic, vector, and hybrid retrievers after embeddings are implemented.

Eval v2 currently uses the deterministic retriever as the baseline. It does not require provider credentials.

The current before/after metric report is documented in `docs/eval-v2-metric-deltas.md`.

## Fixture Categories

`data/evals.json` includes:

- factual retrieval
- paraphrase retrieval
- typo/noisy retrieval
- mixed-language retrieval
- ambiguous prompts
- hard negatives
- source-confusion cases
- unsupported requests
- multilingual-boundary requests
- citation-support cases

Each question can include `expectedDocumentId`, `acceptableDocumentIds`, `shouldRefuse`, and `rationale`.

## Metrics

- top-1 hit rate
- top-3 hit rate
- top-5 hit rate
- mean reciprocal rank
- precision@3
- recall@5
- refusal pass rate
- refusal false positive rate
- refusal false negative rate
- citation pass rate
- citation coverage
- average latency
- latency p50
- latency p95

Eval runs should be reproducible and should include failed cases for inspection.

The current local run ID is `local-eval-run-001`. Unknown run IDs should return `404` until persisted eval runs exist.

## Eval Run Artifacts

Generate an inspectable local artifact with:

```powershell
npm run eval:run
```

Artifacts are written to `evals/runs/` with the retriever name, source run ID, corpus document count, metric summary, and per-question results. Generated JSON artifacts are ignored by git so local benchmark runs do not create repository churn. Keep representative artifacts only when they are intentionally reviewed and added as documentation evidence.

## Limitations

The benchmark validates local behavior over a small, curated corpus. It should not be described as production retrieval accuracy, cultural authority, or community validation. Current latency is local deterministic latency, not hosted production latency.

Future embedding work should use this benchmark to compare deterministic, vector, and hybrid retrievers before changing default public behavior.
