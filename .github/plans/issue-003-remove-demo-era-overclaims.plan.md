# Plan: Issue 003 - Remove Demo-Era Overclaims

## Summary

Replace unsupported public claims in the README and localized UI copy with accurate v2 positioning. The app should describe YachayBot as a source-grounded educational search rebuild in progress, not as a validated cultural authority, patented NLP system, zero-hallucination model, offline/SMS product, or monetized service.

## User Story

As a public reviewer
I want YachayBot's copy to be specific, verifiable, and honest
So that I can evaluate the project without being distracted by unsupported product claims.

## Metadata

| Field | Value |
|-------|-------|
| GitHub Issue | #3 |
| Type | CONTENT_REFACTOR |
| Complexity | MEDIUM |
| Systems Affected | README, localized UI messages, homepage sections |
| Branch | v2-rag-platform |

---

## Patterns to Follow

### Localized Copy

```json
// SOURCE: messages/es.json
"Hero": {
  "badge": {
    "innovation": "Innovacion",
    "text": "Patente pendiente en NLP para lenguas indigenas"
  }
}
```

Copy lives in locale JSON files. Update Spanish first, then keep Quechua and Aymara copy conservative rather than maintaining unsupported claims.

### Homepage Composition

```tsx
// SOURCE: src/app/[locale]/page.tsx
<PricingSection />
```

Pricing is currently part of the public homepage. Issue #3 requires removing pricing or monetization language from MVP surfaces.

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `messages/es.json` | UPDATE | Replace unsupported Spanish public claims |
| `messages/qu.json` | UPDATE | Replace unsupported Quechua public claims conservatively |
| `messages/ay.json` | UPDATE | Replace unsupported Aymara public claims conservatively |
| `src/app/[locale]/page.tsx` | UPDATE | Remove pricing section from homepage |
| `README.md` | UPDATE | Ensure visible positioning stays honest |

---

## Tasks

### Task 1: Remove Unsupported Claim Copy

- **Files**: `messages/es.json`, `messages/qu.json`, `messages/ay.json`
- **Action**: UPDATE
- **Implement**: Remove or rewrite patent pending, zero hallucinations, undocumented validation, exact impact percentages, native NLP, offline/SMS, and certified knowledge claims.
- **Mirror**: Existing translation key structure.
- **Validate**: `npm run lint`

### Task 2: Remove Monetization Surface

- **File**: `src/app/[locale]/page.tsx`
- **Action**: UPDATE
- **Implement**: Stop rendering the pricing section on the public homepage.
- **Mirror**: Existing section import/render pattern.
- **Validate**: `npx tsc --noEmit`

### Task 3: Mark Issue #3 as Planned

- **File**: GitHub issue #3
- **Action**: UPDATE
- **Implement**: Add plan reference and `has-plan` label.
- **Mirror**: `/plan` GitHub integration.
- **Validate**: `gh issue view 3 --repo abigailbrionesa/yachaybot --json labels,comments`

---

## Validation

```bash
bun run lint
bunx tsc --noEmit
bun test
npm run lint
npx tsc --noEmit
npm run build
```

Record Bun availability and missing test script honestly.

### Validation Run - 2026-05-21

| Check | Result | Details |
|-------|--------|---------|
| Overclaim scan | Passed | Remaining matches are code/CSS percentages or internal namespace strings, not public promise copy |
| `bun run lint` | Failed | `bun` is not installed or not on PATH |
| `bunx tsc --noEmit` | Failed | `bunx` is not installed or not on PATH |
| `bun test` | Failed | `bun` is not installed or not on PATH |
| `npm run lint` | Passed | Next lint reported no warnings or errors |
| `npx tsc --noEmit` | Passed | TypeScript completed with exit code 0 after build artifacts stabilized |
| `npm run build` | Passed | Next.js production build completed |
| `npm test` | Failed | No `test` script exists in `package.json` |

---

## Acceptance Criteria

- [x] Patent-pending claims are removed from public copy
- [x] Zero-hallucination claims are removed from public copy
- [x] Elder/community validation claims are removed unless documented
- [x] Exact impact percentages are removed unless supported
- [x] Pricing/monetization UI is removed from MVP surfaces
- [x] Limitations/source-grounded positioning is visible
- [x] Public copy supports the v2 technical positioning without overclaiming
