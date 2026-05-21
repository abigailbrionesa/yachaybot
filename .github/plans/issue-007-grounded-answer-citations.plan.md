# Plan: Issue 007 - Source-Grounded Answer With Citations

## Summary

Add an answer endpoint and UI behavior that generates concise answers only from retrieved source chunks and includes citation markers.

## Tasks

- Add `POST /api/v1/answers`.
- Generate deterministic grounded answer text from retrieved chunks.
- Add citation markers linked to source cards.
- Refuse when evidence is weak.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Answer endpoint exists
- [x] Answer uses retrieved chunks
- [x] Citation markers are visible
- [x] Weak evidence refusal exists
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