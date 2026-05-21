# GitHub Issues: YachayBot Whole-Project Review Hardening

Source PRD: `.github/PRDs/review-hardening-prd.md`

## Issue #22: Decide and document legacy auth/chat public surface policy

Labels: `technical`, `area:architecture`, `area:backend`, `priority:p0`, `type:hitl`

Complexity: Medium

Dependencies: None

Description:

The v2 RAG MVP is the supported public experience, but legacy credentials auth, `/ai-bot`, and `/api/chat` are still reachable. Decide whether each legacy surface is kept and fixed, hidden temporarily, or removed from public navigation before further hardening work proceeds.

Acceptance criteria:

- [x] Credentials auth has a documented keep/fix/remove decision.
- [x] `/ai-bot` and `/api/chat` have a documented keep/fix/remove decision.
- [x] Navbar and README reflect the supported public surface.
- [x] Any intentionally disabled feature returns a clear unavailable state or is removed from navigation.
- [x] Follow-up implementation issues are updated if the decision changes scope.

Decision:

- Public v2 demo is search-first only.
- Credentials login and visible auth are out of scope until a protected workspace exists.
- `/ai-bot` shows evidence-first chat backed by v2 retrieval and citations.
- `/sign-in` shows a graceful paused page.
- `/api/chat` validates messages, retrieves sources, cites evidence, refuses weak evidence, and optionally uses Mistral from env.
- Pinecone remains reserved for future vector retrieval.

## Issue #23: Secure or disable credentials login

Labels: `bug`, `technical`, `area:backend`, `priority:p0`, `type:afk`

Complexity: Medium

Dependencies: Issue #22

Description:

The credentials login flow is inconsistent and unsafe: the client sends `email`, the API reads `username`, and the API compares plaintext passwords. Either remove credentials auth from the public path or upgrade it to validated, hashed-password verification.

Acceptance criteria:

- [x] Credentials login is removed or disabled from the public v2 surface.
- [x] `/sign-in` direct visits show an auth-paused page with a path back to search.
- [x] No visible navbar auth controls are shown in the public v2 demo.
- [x] Password verification code is not reachable from the public v2 path.
- [x] Disabled-route tests or smoke checks are added.

## Issue #24: Fix or retire legacy `/api/chat` and Pinecone integration

Labels: `bug`, `technical`, `area:backend`, `area:ai`, `priority:p0`, `type:afk`

Complexity: Medium

Dependencies: Issue #22

Description:

The legacy `/api/chat` route accepted unvalidated payloads and the Pinecone embedding helper referenced an out-of-scope `pc` variable. Chat is now retained only as an evidence-first wrapper over the v2 local corpus; Pinecone remains reserved for a later vector-search migration.

Acceptance criteria:

- [x] `/api/chat` validates messages before model/provider work.
- [x] `/api/chat` retrieves from the v2 corpus before answering.
- [x] Active route no longer contains the broken Pinecone client path.
- [x] Missing Mistral configuration falls back to the local grounded answer.
- [x] `/ai-bot` UI reflects evidence-first chat and visible sources.

## Issue #25: Add guardrails for expensive model-backed routes

Labels: `enhancement`, `technical`, `area:backend`, `area:ai`, `priority:p1`, `type:afk`

Complexity: Medium

Dependencies: Issue #24

Description:

Any retained model-backed route should have basic abuse prevention. Add rate limiting or a temporary feature guard for `/api/chat` so public traffic cannot freely trigger model and vector-provider calls.

Acceptance criteria:

- [x] Chat route has bounded request validation.
- [x] Invalid chat requests return a generic error object.
- [x] Repeated chat requests return 429 and are covered by a test.
- [x] The README or limitations doc states that chat is evidence-first and Mistral is optional.

## Issue #26: Reduce dependency audit risk and document deferred major upgrades

Labels: `technical`, `area:architecture`, `priority:p1`, `type:afk`

Complexity: Medium

Dependencies: None

Description:

`npm audit` reports 18 vulnerabilities including high-severity transitive findings and direct package advisories. Upgrade safe non-major packages first, then document any advisories that require major migrations, especially the `ai` SDK.

Acceptance criteria:

- [x] Safe non-major dependency upgrades are applied and committed.
- [x] `npm audit` has no high-severity findings that are fixable without a major migration.
- [x] Any remaining major-upgrade advisories are documented with package, risk, and migration owner.
- [x] `package-lock.json` is updated reproducibly.
- [x] Full validation passes after dependency changes.

Validation note:

- `npm audit` is reduced to two moderate Next/PostCSS advisories. The suggested npm fix is a breaking downgrade to `next@9.3.3`, so it is intentionally deferred until an upstream patched Next 15-compatible path is available.

## Issue #27: Add API validation and legacy-route regression tests

Labels: `technical`, `area:backend`, `area:evals`, `priority:p1`, `type:afk`

Complexity: Medium

Dependencies: Issues #23, #24, #25

Description:

The v2 data helpers have tests, but API validation and retained legacy-route behavior need coverage. Add focused tests for invalid request handling and the chosen auth/chat behavior.

Acceptance criteria:

- [x] `/api/v1/search` invalid payload behavior is covered.
- [x] `/api/v1/answers` invalid payload behavior is covered.
- [x] Credentials login retained or disabled behavior is covered.
- [x] Chat retained or disabled behavior is covered.
- [x] `npm test` remains fast and deterministic.

## Issue #28: Harden public docs, navigation, and external links

Labels: `documentation`, `enhancement`, `area:frontend`, `area:docs`, `priority:p1`, `type:afk`

Complexity: Small

Dependencies: Issue #22

Description:

Public docs and navigation should make the supported v2 experience unmistakable. External links opened in new tabs should use standard hardening attributes.

Acceptance criteria:

- [x] External `target="_blank"` links include `rel="noreferrer"`.
- [x] Navbar links point to supported locale-aware public pages.
- [x] README states which surfaces are supported v2 and which are legacy or disabled.
- [x] Demo/limitations docs match the auth/chat decision.
- [x] `npm run lint` and `npm run build` pass after UI/doc updates.
