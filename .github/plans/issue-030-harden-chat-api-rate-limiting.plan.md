# Plan: Harden Chat API Rate Limiting

## Summary

Make the `/api/chat` limiter safer for production by bounding in-memory state, cleaning expired entries, and using a conservative request identity fallback. This keeps the MVP dependency-free while reducing spoofing and memory-growth risk.

## User Story

As the YachayBot maintainer
I want the public chat endpoint to resist simple quota bypass and memory growth
So that the evidence-first chat stays reliable under noisy traffic.

## Metadata

| Field | Value |
|-------|-------|
| Type | ENHANCEMENT |
| Complexity | MEDIUM |
| Systems Affected | `src/app/api/chat/route.ts`, `src/lib/v2-api.test.ts` |
| GitHub Issue | #30 |

---

## Patterns to Follow

### Existing Rate Limit
```
// SOURCE: src/app/api/chat/route.ts:65-78
function isRateLimited(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "local";
```

### Test Style
```
// SOURCE: src/lib/v2-api.test.ts:59-69
test("/api/chat rate limits repeated requests", async () => {
  let response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }));
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/app/api/chat/route.ts` | UPDATE | Add bounded cleanup and trusted identity fallback |
| `src/lib/v2-api.test.ts` | UPDATE | Cover reset window and identity behavior where practical |

---

## Tasks

### Task 1: Bound limiter state

- **File**: `src/app/api/chat/route.ts`
- **Action**: UPDATE
- **Implement**: Add a maximum number of rate-limit buckets and purge expired entries before creating new buckets.
- **Mirror**: `src/app/api/chat/route.ts:65-78`
- **Validate**: `npm test -- src/lib/v2-api.test.ts`

### Task 2: Improve request identity

- **File**: `src/app/api/chat/route.ts`
- **Action**: UPDATE
- **Implement**: Prefer Vercel's trusted forwarded IP header when present, then fall back to the first forwarded-for value, then local.
- **Mirror**: `src/app/api/chat/route.ts:65-78`
- **Validate**: `npm test -- src/lib/v2-api.test.ts`

### Task 3: Add limiter tests

- **File**: `src/lib/v2-api.test.ts`
- **Action**: UPDATE
- **Implement**: Add tests that prove separate identities do not share quota and document the bounded in-memory fallback behavior.
- **Mirror**: `src/lib/v2-api.test.ts:59-69`
- **Validate**: `npm test`

---

## Validation

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

---

## Acceptance Criteria

- [x] Replace or supplement the in-memory limiter with safer deployment behavior.
- [x] Use a trusted request identity source for production when available.
- [x] Add cleanup/capping if any in-memory fallback remains.
- [x] Tests or documented verification cover normal limit, reset window, and malformed/spoofed identity behavior.
