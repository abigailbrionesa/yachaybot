# Plan: Issue 008 - Honest Multilingual Behavior

## Summary

Add language-aware request/response behavior for Spanish and English, and label Quechua/Aymara as experimental and source-bound.

## Tasks

- Add language detection/selection helpers.
- Return detected language in search and answer responses.
- Answer Spanish/English queries in the user language.
- Show Quechua/Aymara limitations in UI.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Search/answer responses include language
- [x] Spanish/English behavior is supported
- [x] Quechua/Aymara limitations are visible
- [x] Unsupported/weak evidence is qualified
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