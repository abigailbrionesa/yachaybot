# PRD: YachayBot Whole-Project Review Hardening

## 1. Executive Summary

YachayBot v2 now has a passing evidence-first RAG MVP slice, but a whole-project review found older surfaces that can undermine production readiness if they remain public: legacy credentials auth, the Pinecone-backed `/api/chat` route, vulnerable dependencies, and small external-link hardening gaps.

This PRD defines the next product and engineering target: keep the v2 search experience stable while hardening or retiring legacy paths so the project can be merged and demoed without hidden security or reliability traps.

## 2. Mission

YachayBot should be a trustworthy educational search prototype whose public behavior is evidence-first, secure by default, and honest about limitations.

Core principles:

- Public endpoints validate input before doing work.
- Authentication must never rely on plaintext passwords.
- Legacy demo paths must either meet the same quality bar as v2 or be removed from the public surface.
- Dependencies should not carry known high-severity vulnerabilities.
- Errors should fail safely without hiding product-breaking regressions from maintainers.

## 3. Target Users

### Learners

Pain points:

- They need the search experience to work reliably without being exposed to broken legacy chat behavior.
- They need safe account and session handling if auth remains visible.

Needs:

- Stable search and source inspection.
- Clear errors when a feature is unavailable.
- No misleading unsupported chatbot claims.

### Educators and Demo Reviewers

Pain points:

- A demo can look polished while older routes fail or expose security debt.
- Reviewers may click into `/ai-bot` and judge the project by a legacy path.

Needs:

- A coherent public demo surface.
- Reviewable security and dependency posture.
- Documentation that matches actual deployed behavior.

### Maintainers

Pain points:

- Legacy code paths can quietly rot because the v2 MVP tests do not cover them.
- Dependency updates can require coordinated changes across auth, AI SDK, and Next tooling.

Needs:

- Explicit decision on whether to keep, fix, or remove legacy auth/chat.
- Regression tests for critical API behavior.
- A documented validation checklist before merge.

## 4. MVP Scope

In scope:

- [x] Fix or disable credentials login.
- [x] Fix or retire legacy `/api/chat`.
- [ ] Add request validation to legacy public API routes that remain enabled.
- [ ] Add rate limiting or a documented temporary guard for model-backed routes.
- [ ] Resolve high-severity dependency audit findings where non-breaking updates are available.
- [ ] Plan the major `ai` SDK upgrade if it cannot be safely done in this pass.
- [ ] Add tests covering auth helper behavior and chat request validation if those routes remain.
- [ ] Add `rel="noreferrer"` to external `target="_blank"` links.
- [x] Update README/docs to state which surface is the supported v2 experience.

Out of scope:

- [ ] Building a full account registration system.
- [ ] Production password reset and email verification.
- [ ] Production vector search migration.
- [ ] Full model-provider abstraction.
- [ ] Paid plans or protected educator workspaces.
- [ ] Community contribution moderation workflow.

## 5. User Stories

1. As a learner, I want the public search experience to remain available even if legacy AI chat is disabled so that I can still use the v2 MVP.
2. As a learner, I want login to be either secure or hidden so that I am not invited into a broken account flow.
3. As a demo reviewer, I want every visible navigation path to work or clearly state it is experimental so that I can trust the project quality.
4. As a maintainer, I want malformed API requests to return 400 responses so that bad input does not become a server error.
5. As a maintainer, I want high-severity dependency advisories addressed so that merge risk is visible and reduced.
6. As a maintainer, I want tests for retained legacy endpoints so that future v2 work does not accidentally break them.
7. As an educator, I want public copy to separate evidence-first search from unsupported legacy chatbot claims so that expectations stay accurate.

## 6. Core Architecture

Current architecture:

- `src/components/v2/search-experience.tsx` calls `/api/v1/search`.
- `src/app/api/v1/*` owns the supported v2 API routes.
- `src/lib/v2-data.ts`, `src/lib/v2-schemas.ts`, and `src/lib/v2-types.ts` support the deterministic v2 MVP.
- `src/app/api/chat/route.ts` is an evidence-first chat wrapper over the v2 corpus.
- `src/app/api/auth/*` and `src/components/ui/login-form.tsx` remain as legacy auth surfaces.

Target architecture for this hardening pass:

- Supported v2 routes stay under `/api/v1`.
- Legacy chat is either fixed behind clear validation/rate limits or removed from navigation.
- Credentials auth is either removed in favor of Google-only auth or upgraded to hashed-password verification.
- Shared validation schemas live near API boundaries.
- Tests distinguish supported v2 behavior from intentionally disabled legacy features.

Locked decisions from product review:

- The public v2 demo is search-first, with chat as a source-grounded wrapper around the same retrieval and citation flow.
- `/ai-bot` chat is rebuilt as a conversational wrapper around source cards, citations, and refusal behavior.
- `/api/chat` validates messages, retrieves from the v2 corpus, cites sources, refuses weak evidence, and optionally uses `MISTRAL_API_KEY` to polish grounded answers.
- Pinecone credentials are reserved for the later vector-search migration and are not required for the deterministic MVP.
- Credentials login is out of scope for the v2 MVP.
- All visible auth/sign-in UI is hidden until there is a real protected workspace.
- Direct `/ai-bot` visits show evidence-first chat.
- Direct `/sign-in` visits show a graceful paused page with a route back to search.
- Dependency hardening follows after the legacy public surface is disabled.
- Issue #22 closes once these decisions are documented; execution continues in #23-#28.

## 7. Tools and Features

### Auth Hardening

Requirements:

- Use one consistent credentials field name if credentials auth remains.
- Validate request body before database lookup.
- Compare password hashes with bcrypt, never plaintext.
- Return generic 401 errors.
- Avoid recursive or self-fetching session callback patterns.

### Legacy Chat Decision

Requirements:

- Decide whether `/ai-bot` and `/api/chat` remain public.
- If retained, validate `messages` as a bounded array.
- Return 400 for malformed payloads.
- Rate limit or guard expensive model calls.
- Keep Pinecone out of the active route until vector retrieval is intentionally implemented.
- Surface provider configuration errors in maintainable logs without leaking secrets.

### Dependency Hardening

Requirements:

- Run `npm audit`.
- Upgrade direct packages with safe non-major fixes first.
- Document remaining advisories that require major upgrades.
- Keep `package-lock.json` committed.

### Link and UI Hardening

Requirements:

- Add `rel="noreferrer"` to external links using `target="_blank"`.
- Confirm navbar links point to locale-aware supported pages where needed.
- Ensure unsupported legacy links are hidden or labeled experimental.

### Tests

Requirements:

- Keep existing v2 retrieval tests.
- Add API validation tests for `/api/v1/search` and `/api/v1/answers`.
- Add tests for retained auth/chat behavior or disabled-route responses.

## 8. Technology Stack

Frontend:

- Next.js 15.5.x or newer patched version.
- React 19.
- TypeScript.
- Tailwind CSS.
- Radix/shadcn-style UI components.
- `next-intl` localized routing.

Backend/API:

- Next.js app router API routes.
- NextAuth for OAuth if auth remains.
- Prisma for user records if credentials auth remains.
- Mistral is optional for evidence-first chat answer polishing.
- Pinecone is reserved for the future vector retrieval migration.

Validation and testing:

- Zod for request validation.
- Node test runner through `tsx --test`.
- `npm audit` for dependency risk visibility.

## 9. Security and Configuration

Environment variables:

- `DATABASE_URL`: required only for Prisma-backed auth flows.
- `NEXTAUTH_URL`: required for NextAuth deployments if auth remains.
- `NEXTAUTH_SECRET`: required for production NextAuth security.
- `GOOGLE_CLIENT_ID`: required only if Google login remains.
- `GOOGLE_CLIENT_SECRET`: required only if Google login remains.
- `MISTRAL_API_KEY`: optional for model-polished grounded chat answers.
- `PINECONE_API_KEY`: reserved for future vector retrieval migration.
- `PINECONE_HOST`: reserved for future vector retrieval migration.

Security requirements:

- No hardcoded secrets.
- `.env*` remains ignored.
- No plaintext password comparison.
- No public model-backed endpoint without request validation.
- No known high-severity dependency findings left unreviewed.
- No stack traces or provider errors returned to users.

## 10. API Specification

### `POST /api/auth/login`

Credentials auth is paused for the v2 MVP. The old contract is retained here only as future reference if password auth returns.

```json
{
  "email": "person@example.com",
  "password": "user-entered-password"
}
```

Success response:

```json
{
  "id": "user-id",
  "name": "User Name",
  "email": "person@example.com"
}
```

Failure responses:

- `400 INVALID_REQUEST` for malformed payloads.
- `401 INVALID_CREDENTIALS` for wrong credentials.

### `POST /api/chat`

Chat is active as an evidence-first wrapper. Request:

```json
{
  "messages": [
    { "role": "user", "content": "Pregunta sobre una fuente publica" }
  ]
}
```

Failure responses:

- `400 INVALID_REQUEST` for malformed payloads.
- `503 FEATURE_UNAVAILABLE` when provider configuration is missing and the feature is enabled.
- `429 RATE_LIMITED` when request volume exceeds the configured limit.

### `POST /api/v1/search`

Existing supported v2 route remains unchanged:

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "limit": 5
}
```

### `POST /api/v1/answers`

Existing supported v2 route remains unchanged:

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "chunkIds": ["chunk-doc-minedu-eib-001"]
}
```

## 11. Success Criteria

This hardening pass is successful when:

- Credentials login is secure or removed from public navigation.
- `/api/chat` is secure, validated, and working with provider configuration, or disabled intentionally.
- Pinecone is not called from the active chat route until vector retrieval is implemented.
- Malformed requests to public retained API routes return 400, not 500.
- `npm audit` has no high-severity findings that can be resolved without a major migration.
- Remaining major-upgrade advisories are documented as follow-up issues.
- External new-tab links include `rel="noreferrer"`.
- `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` pass.
- PR #14 remains green on Vercel after changes.

## 12. Implementation Phases

### Phase 1: Decide Legacy Surface Policy

Deliverables:

- Decide keep/fix/remove for credentials login.
- Decide keep/fix/remove for `/ai-bot` and `/api/chat`.
- Update navigation and docs to match the decision.

### Phase 2: Security Fixes

Deliverables:

- Fix credentials request mismatch and plaintext comparison if credentials auth remains.
- Keep Pinecone disabled in the active route until vector retrieval is implemented.
- Add Zod schemas to retained legacy routes.
- Add basic rate limiting or feature guards for model-backed chat.

### Phase 3: Dependency and Test Hardening

Deliverables:

- Upgrade safe dependency patches.
- Add tests for retained route behavior.
- Document advisories that require major migrations.

### Phase 4: Validation and Release Readiness

Deliverables:

- Run full local validation.
- Push to PR branch.
- Confirm Vercel passes.
- Create follow-up GitHub issues for deferred major upgrades.

## 13. Future Considerations

- Connect `/api/chat` to the future vector retrieval path once pgvector or Pinecone-backed retrieval is ready.
- Add persistent query logs with privacy review.
- Add production rate limiting backed by Redis or Vercel KV.
- Add Dependabot configuration.
- Add CI for lint, typecheck, tests, build, and audit policy.
- Move auth into a dedicated protected educator workspace after v2 search is stable.

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Legacy auth remains broken | Users cannot sign in and reviewers lose trust | Remove credentials auth or implement hashed-password verification |
| Chat silently returns weak answers | Demo contradicts evidence-first positioning | Keep chat on v2 retrieval, citations, and refusal behavior |
| Dependency upgrades break app router behavior | PR regressions after audit fixes | Upgrade in small batches and run full validation after each |
| Major `ai` SDK upgrade is too large for this pass | Security advisory remains open | Document explicit issue with migration plan and temporary exposure assessment |
| Rate limiting is skipped | Public model endpoint can be abused | Add temporary guard or disable chat until rate limiting exists |
