# Plan: Issue 005 - Create Searchable Chunks

## Summary

Add chunk records linked to documents, expose chunk inspection in API/UI, and document the chunking approach.

## Tasks

- Add chunk data with document relationships, index, content, tags, and character counts.
- Include chunks in document detail responses.
- Show snippets/chunks on the Sources page.
- Add migration notes for `chunks`.
- Validate with `/validate` and npm fallbacks.

## Acceptance Criteria

- [x] Chunk data exists
- [x] Chunks are linked to documents
- [x] Chunks can be inspected
- [x] Chunking choices are documented
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