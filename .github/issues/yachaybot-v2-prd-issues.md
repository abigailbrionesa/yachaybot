# Issue Specifications: YachayBot v2 PRD Follow-Up

Generated from `.github/PRDs/PRD.md` using `/create-issues` as the available local equivalent of `/to-issues`.

## Issue 1: Upgrade Next.js so Vercel preview deploys

**Type:** bug  
**Complexity:** Medium  
**Labels:** `bug`, `priority:p0`, `area:frontend`  
**Dependencies:** None

### Description

The draft PR currently builds locally but Vercel rejects the preview with `Vulnerable version of Next.js detected`. Upgrade `next` and matching framework packages so the preview deployment passes.

### Acceptance Criteria

- [ ] Upgrade `next` to a Vercel-accepted patched version.
- [ ] Upgrade `eslint-config-next` to the matching compatible version.
- [ ] Run `npm install` and commit lockfile changes.
- [ ] Verify `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- [ ] Confirm Vercel preview succeeds on the PR.

## Issue 2: Route the search UI through `/api/v1/search`

**Type:** enhancement  
**Complexity:** Medium  
**Labels:** `enhancement`, `priority:p0`, `area:frontend`, `area:backend`, `area:ai`  
**Dependencies:** Issue 1 recommended first

### Description

The search UI currently imports `searchCorpus` and `buildAnswer` directly into a client component. Move the user-facing search flow behind the API boundary so the product actually exercises `/api/v1/search`.

### Acceptance Criteria

- [ ] Remove direct corpus/retrieval imports from the client search component.
- [ ] Submit search queries with `fetch("/api/v1/search")`.
- [ ] Add loading, error, empty, and success states.
- [ ] Preserve source cards, evidence strength, citations, and latency display.
- [ ] Verify search works from `/es` in a local browser or smoke check.

## Issue 3: Make `/api/v1/answers` generate from reviewed chunks

**Type:** enhancement  
**Complexity:** Medium  
**Labels:** `enhancement`, `priority:p0`, `area:backend`, `area:ai`  
**Dependencies:** Issue 2

### Description

The answer endpoint currently reruns retrieval from the query. Update the endpoint to accept retrieved chunk IDs or chunk payloads so answer generation uses the same evidence the user reviewed.

### Acceptance Criteria

- [ ] Accept `chunkIds` or chunk payloads in the answer request body.
- [ ] Resolve chunk IDs to known chunks on the server.
- [ ] Generate answers only from the provided/reviewed evidence set.
- [ ] Return citation relationships for the exact chunks used.
- [ ] Refuse when provided chunks are missing or below evidence threshold.

## Issue 4: Keep corpus and retrieval server-side

**Type:** technical  
**Complexity:** Medium  
**Labels:** `enhancement`, `priority:p1`, `area:data`, `area:backend`, `area:frontend`  
**Dependencies:** Issue 2

### Description

The local corpus and retrieval helpers are currently imported by client routes. Move corpus access and retrieval execution to server-only code paths so the browser receives API responses rather than the full implementation/data module.

### Acceptance Criteria

- [ ] Split shared public types from server-only corpus/retrieval functions.
- [ ] Ensure client components do not import `documents`, `chunks`, `searchCorpus`, `buildAnswer`, or `runEval` directly.
- [ ] Sources and eval pages fetch from API routes or use server components safely.
- [ ] Confirm client bundle no longer includes the full corpus module.
- [ ] Update docs to describe local server-side fixture boundary.

## Issue 5: Add request validation and automated tests

**Type:** technical  
**Complexity:** Large  
**Labels:** `enhancement`, `priority:p1`, `area:backend`, `area:evals`  
**Dependencies:** Issues 2 and 3

### Description

The MVP currently has no `npm test` script and no request validation layer. Add validation and focused tests for retrieval, evidence strength, answer refusal, and eval metrics.

### Acceptance Criteria

- [ ] Add Zod schemas for search and answer request bodies.
- [ ] Add consistent API error objects.
- [ ] Add a test runner and `npm test` script.
- [ ] Test retrieval ranking and no-result behavior.
- [ ] Test evidence strength, answer citations/refusal, and eval metric calculations.

## Issue 6: Replace legacy README/demo section with clean v2 documentation

**Type:** documentation  
**Complexity:** Small  
**Labels:** `documentation`, `priority:p1`, `area:docs`  
**Dependencies:** None

### Description

The README now has good v2 documentation at the top, but still carries the old decorative demo-era HTML/samp section below. Replace it with a concise v2-focused project narrative.

### Acceptance Criteria

- [ ] Remove mojibake/decorative legacy README content.
- [ ] Keep hackathon origin story without unsupported claims.
- [ ] Keep setup, validation, API overview, docs links, and limitations visible.
- [ ] Add screenshots/GIF placeholders or instructions if real assets are not ready.
- [ ] Verify README supports the portfolio/demo story cleanly.

## Issue 7: Add public demo evidence assets

**Type:** documentation  
**Complexity:** Medium  
**Labels:** `documentation`, `priority:p1`, `area:docs`, `area:frontend`  
**Dependencies:** Issue 1

### Description

Issue #13 requires screenshots or GIFs showing search, source cards, citations, and eval dashboard. Add local or generated demo evidence once the preview deploys or local UI is finalized.

### Acceptance Criteria

- [ ] Capture search-first homepage screenshot.
- [ ] Capture source cards/citations screenshot.
- [ ] Capture Sources page filtering screenshot.
- [ ] Capture Evals dashboard screenshot.
- [ ] Link assets from README or docs/demo-script.md.
