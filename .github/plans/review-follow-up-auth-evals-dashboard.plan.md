# Plan: Review Follow-up for Auth, Evals, and Dashboard

## Summary

Align the public MVP surface with the documented "auth paused" state and make eval run lookup honest. The fix pauses the catch-all NextAuth API route, replaces the stale dashboard with a paused-workspace message, and validates dynamic eval run IDs instead of returning success for every path.

## User Story

As a YachayBot maintainer
I want dormant auth and dynamic API routes to match their public contract
So that the MVP does not expose misleading or half-enabled behavior.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | LOW |
| Systems Affected | Auth API, dashboard page, eval run API, route tests |
| Jira Issue | N/A |

---

## Patterns to Follow

### Paused Feature API
```
// SOURCE: src/app/api/auth/login/route.ts:3-12
export async function POST() {
  return NextResponse.json(
    {
      error: {
        code: "FEATURE_UNAVAILABLE",
        message: "Credentials login is paused for the YachayBot v2 MVP.",
      },
    },
    { status: 503 },
  );
}
```

### Local Eval Run
```
// SOURCE: src/lib/v2-data.ts:418-423
return {
  id: "local-eval-run-001",
  createdAt: "2026-05-21",
  metrics: { top3HitRate, top5HitRate, refusalPassRate, averageLatencyMs },
  results,
};
```

### Test Style
```
// SOURCE: src/lib/v2-api.test.ts:121-127
test("/api/auth/login is intentionally paused for the v2 MVP", async () => {
  const response = await postLogin();
  const payload = await response.json();
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/app/api/auth/[...nextauth]/route.ts` | UPDATE | Return 503 for all auth catch-all requests during the v2 MVP |
| `src/app/api/v1/evals/runs/[runId]/route.ts` | UPDATE | Return the local eval run only for the known local run ID; return 404 otherwise |
| `src/app/[locale]/dashboard/page.tsx` | UPDATE | Replace stale session dashboard with paused-workspace page |
| `src/lib/v2-api.test.ts` | UPDATE | Add regression tests for paused NextAuth route and eval run ID handling |

---

## Tasks

### Task 1: Pause catch-all auth API

- **File**: `src/app/api/auth/[...nextauth]/route.ts`
- **Action**: UPDATE
- **Implement**: Remove active NextAuth provider/prisma callbacks and export GET/POST handlers that return a 503 feature-unavailable response.
- **Mirror**: `src/app/api/auth/login/route.ts:3-12`
- **Validate**: `npm test -- src/lib/v2-api.test.ts`

### Task 2: Validate eval run ID

- **File**: `src/app/api/v1/evals/runs/[runId]/route.ts`
- **Action**: UPDATE
- **Implement**: Read `params.runId`, compare to `runEval().id`, return 404 for unknown IDs.
- **Mirror**: `src/app/api/v1/evals/runs/route.ts:4-10`
- **Validate**: `npm test -- src/lib/v2-api.test.ts`

### Task 3: Replace stale dashboard

- **File**: `src/app/[locale]/dashboard/page.tsx`
- **Action**: UPDATE
- **Implement**: Remove `next-auth` client hooks and render a server page explaining the educator workspace is paused, with links back to search and sources.
- **Mirror**: `src/app/[locale]/sign-in/page.tsx:12-38`
- **Validate**: `npm run build`

### Task 4: Add regression tests

- **File**: `src/lib/v2-api.test.ts`
- **Action**: UPDATE
- **Implement**: Assert catch-all auth GET/POST return 503, known eval run ID returns 200, and unknown eval run ID returns 404.
- **Mirror**: `src/lib/v2-api.test.ts:121-127`
- **Validate**: `npm test`

---

## Validation

```bash
npm run lint
npx tsc --noEmit --pretty false
npm test
npm run build
git diff --check
```

---

## Acceptance Criteria

- [x] Catch-all NextAuth route no longer exposes Google/Prisma auth flow.
- [x] `/api/v1/evals/runs/local-eval-run-001` returns the local eval run.
- [x] Unknown eval run IDs return 404.
- [x] Dashboard no longer depends on active auth session state.
- [x] Lint, type check, tests, and build pass.
