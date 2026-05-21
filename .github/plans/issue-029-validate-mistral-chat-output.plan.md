# Plan: Validate Mistral Chat Output

## Summary

Add a citation-integrity gate between the optional Mistral answer and the public `/api/chat` response. The deterministic answer remains the source of truth; model-polished text is only used when it preserves known citation markers and does not introduce unknown markers.

## User Story

As a learner using YachayBot
I want chat answers to stay grounded in retrieved evidence
So that polished model output cannot silently add unsupported claims.

## Metadata

| Field | Value |
|-------|-------|
| Type | BUG_FIX |
| Complexity | MEDIUM |
| Systems Affected | `src/app/api/chat/route.ts`, `src/lib/v2-api.test.ts` |
| GitHub Issue | #29 |

---

## Patterns to Follow

### Route Validation
```
// SOURCE: src/app/api/v1/search/route.ts:5-11
const body = await req.json().catch(() => ({}));
const parsed = searchRequestSchema.safeParse(body);

if (!parsed.success) {
  return NextResponse.json(validationError("Search request is invalid", parsed.error.flatten()), { status: 400 });
}
```

### Grounded Answer Flow
```
// SOURCE: src/app/api/chat/route.ts:39-61
const search = searchCorpus(lastUserMessage.content, 5);
const grounded = buildAnswer(lastUserMessage.content, search.results);
const modelAnswer = await generateGroundedAnswer(lastUserMessage.content, grounded.answer, search.results);
```

### Tests
```
// SOURCE: src/lib/v2-api.test.ts:40-49
test("/api/chat answers from retrieved evidence", async () => {
  const response = await postChat(jsonRequest({
    messages: [{ role: "user", content: "Que recursos explican educacion intercultural bilingue?" }],
  }));
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `src/app/api/chat/route.ts` | UPDATE | Add citation marker validation before accepting Mistral text |
| `src/lib/v2-api.test.ts` | UPDATE | Cover accepted, rejected, and fallback model outputs |

---

## Tasks

### Task 1: Add citation validation helper

- **File**: `src/app/api/chat/route.ts`
- **Action**: UPDATE
- **Implement**: Extract citation markers from candidate model output, compare them against citations present in the deterministic grounded answer, and reject citationless or unknown-marker output.
- **Mirror**: `src/app/api/chat/route.ts:39-61`
- **Validate**: `npm test -- src/lib/v2-api.test.ts`

### Task 2: Gate Mistral replacement

- **File**: `src/app/api/chat/route.ts`
- **Action**: UPDATE
- **Implement**: Only set `modelUsed: "mistral-small-latest"` when the candidate passes citation validation; otherwise return `local-grounded`.
- **Mirror**: `src/app/api/chat/route.ts:53-61`
- **Validate**: `npm test -- src/lib/v2-api.test.ts`

### Task 3: Add route tests

- **File**: `src/lib/v2-api.test.ts`
- **Action**: UPDATE
- **Implement**: Mock `globalThis.fetch` for valid cited output, citationless output, and unknown citation output.
- **Mirror**: `src/lib/v2-api.test.ts:40-49`
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

- [x] Mistral output is accepted only if it contains known citation markers from `grounded.citations`.
- [x] Mistral output is rejected if it contains unknown citation markers.
- [x] Invalid or citationless Mistral output falls back to the deterministic `grounded.answer`.
- [x] Tests cover accepted, rejected, and fallback paths.
