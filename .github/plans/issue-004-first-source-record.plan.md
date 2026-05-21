# Plan: Issue 004 - First Inspectable Source Record

## Summary

Add the first inspectable v2 source flow by introducing source metadata, a documents API, and a Sources page that displays title, source type, language, topic, institution, rights note, and URL.

## Tasks

- Add local source metadata and document helpers.
- Add `GET /api/v1/documents`.
- Add `/sources` page with inspectable source cards.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Source metadata exists
- [x] Documents endpoint exists
- [x] Sources page exists
- [x] Required metadata is visible
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