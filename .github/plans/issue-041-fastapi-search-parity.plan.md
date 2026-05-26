# Issue #41 Plan: Add FastAPI Search Parity Over Shared Corpus

## Decisions

- FastAPI is added as a sidecar service boundary first.
- Public Next.js UI and API behavior remain unchanged.
- pgvector, hosted database setup, and provider-backed embeddings remain out of scope.
- The corpus moves to shared JSON under `data/`.
- Next.js and FastAPI both read the same corpus source.
- FastAPI `POST /v1/search` matches the current Next.js search response shape.

## Implementation

1. Generate shared corpus JSON from the existing TypeScript corpus.
2. Update the TypeScript retrieval module to load documents from shared JSON.
3. Add FastAPI models, corpus loading, deterministic retrieval, answer generation, and `/v1/search`.
4. Add FastAPI route tests for valid search, invalid request, weak-evidence refusal, and EIB retrieval.
5. Update architecture, API, and backend migration docs.

## Validation

- `npm run validate`
- FastAPI test suite
- Confirm public Next.js behavior remains unchanged.

