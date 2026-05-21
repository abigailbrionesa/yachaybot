# Plan: Issue 011 - First Retrieval Eval Run

## Summary

Add deterministic eval questions, a sample eval run, and metric calculations for top-k hit rate, refusal pass rate, and latency.

## Tasks

- Add at least 10 eval questions with expected sources.
- Include at least 3 refusal questions.
- Add eval runner helpers.
- Add eval run endpoints.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Eval questions exist
- [x] Refusal cases exist
- [x] Metrics are calculated
- [x] Eval run is exposed
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