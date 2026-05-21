# Plan: Issue 009 - Scale To MVP Corpus

## Summary

Expand the local v2 corpus to at least 15 public/official sources and 5 curated notes, with filters and methodology documentation.

## Tasks

- Add 20 source records with complete metadata.
- Label curated notes clearly.
- Add language/topic/source type filters on Sources page.
- Document corpus selection.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] At least 15 public/official sources exist
- [x] At least 5 curated notes exist
- [x] Curated notes are labeled
- [x] Sources can be filtered
- [x] Methodology is documented

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