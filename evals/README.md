# YachayBot v2 Evals

This directory owns evaluation fixtures, question sets, and local outputs for retrieval and refusal checks.

MVP metrics:

- top-3 hit rate
- top-5 hit rate
- refusal pass rate
- average latency

Eval runs should be reproducible and should include failed cases for inspection.

The current local run ID is `local-eval-run-001`. Unknown run IDs should return `404` until persisted eval runs exist.

## Eval Run Artifacts

Generate an inspectable local artifact with:

```powershell
npm run eval:run
```

Artifacts are written to `evals/runs/` with the retriever name, source run ID, corpus document count, metric summary, and per-question results. Generated JSON artifacts are ignored by git so local benchmark runs do not create repository churn. Keep representative artifacts only when they are intentionally reviewed and added as documentation evidence.
