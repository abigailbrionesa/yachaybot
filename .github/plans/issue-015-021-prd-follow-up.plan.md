# Plan: Issues 015-021 - PRD Follow-Up To Merge-Ready v2 MVP

## Summary

Resolve the PRD follow-up issues created from `.github/PRDs/PRD.md`: unblock Vercel, align the search/answer UI with API boundaries, keep corpus/retrieval server-side, add request validation and tests, clean README, and add demo evidence assets.

## Metadata

| Field | Value |
|-------|-------|
| GitHub Issues | #15, #16, #17, #18, #19, #20, #21 |
| Type | BUG_FIX + ENHANCEMENT + DOCUMENTATION |
| Complexity | HIGH |
| Branch | v2-rag-platform |

## Tasks

### Task 1: Upgrade Next.js Patch Line

- **Issues**: #15
- **Files**: `package.json`, `package-lock.json`
- **Action**: UPDATE
- **Implement**: Upgrade `next` and `eslint-config-next` to `15.5.18`.
- **Validate**: `npm run lint`, `npx tsc --noEmit`, `npm run build`

### Task 2: Move Search UI Behind API

- **Issues**: #16, #18
- **Files**: `src/components/v2/search-experience.tsx`, `src/lib/v2-types.ts`
- **Action**: UPDATE/CREATE
- **Implement**: Replace direct client imports of corpus/retrieval helpers with `fetch("/api/v1/search")`, typed response objects, loading/error/empty/success states.
- **Validate**: local smoke check on `/es` and `/api/v1/search`

### Task 3: Generate Answers From Reviewed Chunks

- **Issues**: #17
- **Files**: `src/lib/v2-data.ts`, `src/app/api/v1/answers/route.ts`
- **Action**: UPDATE
- **Implement**: Accept `chunkIds`, resolve them server-side, and generate/refuse only from that provided evidence set.
- **Validate**: API smoke checks for valid and missing chunks.

### Task 4: Add Request Validation And Tests

- **Issues**: #19
- **Files**: `src/lib/v2-schemas.ts`, `src/lib/v2-data.test.ts`, `package.json`
- **Action**: CREATE/UPDATE
- **Implement**: Add Zod schemas, consistent error payloads, Node test runner script, and focused tests for retrieval/evidence/answers/evals.
- **Validate**: `npm test`

### Task 5: Clean README And Add Demo Evidence

- **Issues**: #20, #21
- **Files**: `README.md`, `docs/demo-script.md`, `public/demo/*.svg`
- **Action**: UPDATE/CREATE
- **Implement**: Remove legacy decorative README block, add clean v2 story, and add linked demo evidence assets.
- **Validate**: `git diff --check`, README links point to committed files.

## Acceptance Criteria

- [x] Vercel-compatible Next.js version is committed.
- [x] Search UI calls `/api/v1/search`.
- [x] Answer endpoint accepts reviewed chunk IDs.
- [x] Client components do not import server corpus/retrieval helpers.
- [x] Request validation and `npm test` exist.
- [x] README is clean and v2-focused.
- [x] Demo evidence assets are linked.
- [ ] GitHub issues #15-#21 are updated or closed with validation evidence.

## Validation Evidence

- `npm run lint`: passed
- `npx tsc --noEmit`: passed
- `npm test`: passed
- `npm run build`: passed on Next.js 15.5.18
- Local smoke: `/es`, `/es/sources`, `/es/evals`, `/api/v1/search`, and `/api/v1/answers` passed on port 3001
- Historical Bun commands were not run because Bun is not installed in this environment
