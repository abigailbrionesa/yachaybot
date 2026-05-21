# Plan: Issue 006 - Embeddings And Vector Search

## Summary

Create a deterministic local embedding/search vertical slice that returns ranked chunks with metadata while the production pgvector provider is still pending.

## Tasks

- Add simple deterministic token scoring as the local retrieval baseline.
- Add `POST /api/v1/search`.
- Add search UI with source cards.
- Log latency in the response.
- Add migration notes for embeddings/pgvector.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Search endpoint exists
- [x] Ranked chunks include score, snippet, document metadata, and URL
- [x] Search UI displays source cards
- [x] Latency is included
- [x] Validation is recorded

## Validation Run - 2026-05-21

| Check | Result | Details |
|-------|--------|---------|
| `bun run lint` | Failed | `bun` is not installed or not on PATH |
| `bunx tsc --noEmit` | Failed | `bunx` is not installed or not on PATH |
| `bun test` | Failed | `bun` is not installed or not on PATH |
| `npm run lint` | Passed | Next lint reported no warnings or errors |
| `npx tsc --noEmit` | Passed | TypeScript completed with exit code 0 after build artifacts stabilized |
| `npm run build` | Passed | Next.js production build completed and listed v2 pages/API routes |
| `python -m py_compile api/app/main.py` | Passed | FastAPI scaffold compiles |
| `npm test` | Failed | No `test` script exists in `package.json` |