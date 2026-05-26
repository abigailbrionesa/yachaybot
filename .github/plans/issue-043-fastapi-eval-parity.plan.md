# Issue #43 Plan: Add FastAPI Eval Parity Endpoint

## Decisions

- Keep the public Next.js eval dashboard unchanged.
- Move deterministic eval questions into shared JSON.
- FastAPI owns sidecar eval-run parity over the same search logic used by `/v1/search`.
- Preserve metric families already shown by the Next.js MVP.
- Keep hosted eval storage and pgvector out of scope.

## Implementation

1. Move eval questions into `data/evals.json`.
2. Update TypeScript eval helpers to read the shared eval JSON.
3. Add FastAPI eval models and deterministic run execution.
4. Add `GET /v1/evals/runs` and `GET /v1/evals/runs/{run_id}`.
5. Add FastAPI tests for known run, unknown run, metrics, and representative cases.
6. Update docs.

## Validation

- `npm run validate`
- FastAPI test suite
- Public smoke test

