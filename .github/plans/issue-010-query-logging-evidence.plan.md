# Plan: Issue 010 - Query Logging And Evidence Strength

## Summary

Add query response metadata and evidence strength classification based on retrieval score and usable chunks.

## Tasks

- Add evidence strength helper.
- Include query text, language, latency, retrieved chunk IDs, and citation relationships in responses.
- Show evidence strength in the search UI.
- Document classification rule.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Query metadata is returned
- [x] Citation relationships are returned
- [x] Evidence strength is calculated
- [x] Evidence strength is visible
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