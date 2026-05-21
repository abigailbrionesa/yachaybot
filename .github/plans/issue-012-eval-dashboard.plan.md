# Plan: Issue 012 - Eval Dashboard

## Summary

Add an Evals page that displays retrieval metrics, per-question results, expected vs retrieved sources, failed cases, and loading/empty/error-ready states.

## Tasks

- Add `/evals` page.
- Show top-3, top-5, refusal pass rate, and average latency.
- Show per-question result table/cards.
- Highlight failed cases.
- Link to dashboard from search page/nav.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Evals page exists
- [x] Metrics are visible
- [x] Per-question results are visible
- [x] Failed cases are highlighted
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