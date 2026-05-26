# Issue 44 Plan: pgvector Retrieval Comparison Slice

## Goal

Add an explicit experimental comparison path for deterministic retrieval versus pgvector retrieval without changing the default public search behavior.

## Scope

- Keep deterministic retrieval as the baseline and default fallback.
- Add a FastAPI comparison endpoint that returns deterministic results for every request.
- Attempt pgvector retrieval only when database configuration and a query embedding are provided.
- Fail gracefully when pgvector credentials, dependencies, or query embeddings are missing.
- Add tests for no-credential fallback and response shape.
- Update documentation to label pgvector retrieval as experimental.

## Implementation Steps

1. Add retrieval comparison models and helper functions in the FastAPI app.
2. Add `POST /v1/retrieval/compare` to expose baseline and optional vector results.
3. Add FastAPI tests that validate fallback behavior without provider credentials.
4. Update API, architecture, migration, README, and environment documentation.

## Validation

- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
