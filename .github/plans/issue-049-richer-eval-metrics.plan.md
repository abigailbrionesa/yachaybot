# Issue 49 Plan: Richer Retrieval And Refusal Metrics

## Goal

Upgrade Eval v2 metrics so retrieval, refusal, citation, and latency behavior can be inspected beyond top-3/top-5 hit rates.

## Scope

- Add top-1 hit rate, MRR, precision@3, recall@5, refusal false positive/negative rates, citation coverage, p50 latency, and p95 latency.
- Use `acceptableDocumentIds` when present, falling back to `expectedDocumentId`.
- Keep existing top-3/top-5/refusal/citation/average-latency fields for compatibility.
- Update TypeScript, FastAPI, tests, and dashboard display.

## Validation

- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
