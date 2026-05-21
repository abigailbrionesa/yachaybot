# GitHub Issues: YachayBot Whole-Project Review Hardening

Source PRD: `.github/PRDs/review-hardening-prd.md`

## Issue #22: Decide and document legacy auth/chat public surface policy

Labels: `technical`, `area:architecture`, `area:backend`, `priority:p0`, `type:hitl`

Complexity: Medium

Dependencies: None

Description:

The v2 RAG MVP is the supported public experience, but legacy credentials auth, `/ai-bot`, and `/api/chat` are still reachable. Decide whether each legacy surface is kept and fixed, hidden temporarily, or removed from public navigation before further hardening work proceeds.

Acceptance criteria:

- [ ] Credentials auth has a documented keep/fix/remove decision.
- [ ] `/ai-bot` and `/api/chat` have a documented keep/fix/remove decision.
- [ ] Navbar and README reflect the supported public surface.
- [ ] Any intentionally disabled feature returns a clear unavailable state or is removed from navigation.
- [ ] Follow-up implementation issues are updated if the decision changes scope.

## Issue #23: Secure or disable credentials login

Labels: `bug`, `technical`, `area:backend`, `priority:p0`, `type:afk`

Complexity: Medium

Dependencies: Issue #22

Description:

The credentials login flow is inconsistent and unsafe: the client sends `email`, the API reads `username`, and the API compares plaintext passwords. Either remove credentials auth from the public path or upgrade it to validated, hashed-password verification.

Acceptance criteria:

- [ ] Credentials request fields are consistent between `LoginForm`, NextAuth credentials provider, and `/api/auth/login`.
- [ ] Request body is validated before database lookup.
- [ ] Password verification uses bcrypt hashes if credentials auth remains.
- [ ] Invalid credentials return a generic 401 without leaking user existence.
- [ ] Credentials auth tests or disabled-route tests are added.

## Issue #24: Fix or retire legacy `/api/chat` and Pinecone integration

Labels: `bug`, `technical`, `area:backend`, `area:ai`, `priority:p0`, `type:afk`

Complexity: Medium

Dependencies: Issue #22

Description:

The legacy `/api/chat` route accepts unvalidated payloads and the Pinecone embedding helper references an out-of-scope `pc` variable. If chat remains public, it must validate input, handle missing provider configuration clearly, and fix Pinecone client usage. If retired, the route and UI should fail intentionally and safely.

Acceptance criteria:

- [ ] `/api/chat` validates `messages` as a bounded array before model/provider work.
- [ ] Malformed chat requests return 400 instead of 500.
- [ ] Pinecone embedding generation receives a valid client if the route remains enabled.
- [ ] Missing provider configuration returns a maintainable unavailable state or intentionally falls back.
- [ ] `/ai-bot` UI reflects whether chat is supported, experimental, or disabled.

## Issue #25: Add guardrails for expensive model-backed routes

Labels: `enhancement`, `technical`, `area:backend`, `area:ai`, `priority:p1`, `type:afk`

Complexity: Medium

Dependencies: Issue #24

Description:

Any retained model-backed route should have basic abuse prevention. Add rate limiting or a temporary feature guard for `/api/chat` so public traffic cannot freely trigger model and vector-provider calls.

Acceptance criteria:

- [ ] Retained chat route has a rate limit, feature flag, or documented temporary guard.
- [ ] Rate-limited responses return 429 with a generic error object.
- [ ] Guard behavior is covered by a test or documented smoke check.
- [ ] The README or limitations doc states whether legacy chat is enabled.

## Issue #26: Reduce dependency audit risk and document deferred major upgrades

Labels: `technical`, `area:architecture`, `priority:p1`, `type:afk`

Complexity: Medium

Dependencies: None

Description:

`npm audit` reports 18 vulnerabilities including high-severity transitive findings and direct package advisories. Upgrade safe non-major packages first, then document any advisories that require major migrations, especially the `ai` SDK.

Acceptance criteria:

- [ ] Safe non-major dependency upgrades are applied and committed.
- [ ] `npm audit` has no high-severity findings that are fixable without a major migration.
- [ ] Any remaining major-upgrade advisories are documented with package, risk, and migration owner.
- [ ] `package-lock.json` is updated reproducibly.
- [ ] Full validation passes after dependency changes.

## Issue #27: Add API validation and legacy-route regression tests

Labels: `technical`, `area:backend`, `area:evals`, `priority:p1`, `type:afk`

Complexity: Medium

Dependencies: Issues #23, #24, #25

Description:

The v2 data helpers have tests, but API validation and retained legacy-route behavior need coverage. Add focused tests for invalid request handling and the chosen auth/chat behavior.

Acceptance criteria:

- [ ] `/api/v1/search` invalid payload behavior is covered.
- [ ] `/api/v1/answers` invalid payload behavior is covered.
- [ ] Credentials login retained or disabled behavior is covered.
- [ ] Chat retained or disabled behavior is covered.
- [ ] `npm test` remains fast and deterministic.

## Issue #28: Harden public docs, navigation, and external links

Labels: `documentation`, `enhancement`, `area:frontend`, `area:docs`, `priority:p1`, `type:afk`

Complexity: Small

Dependencies: Issue #22

Description:

Public docs and navigation should make the supported v2 experience unmistakable. External links opened in new tabs should use standard hardening attributes.

Acceptance criteria:

- [ ] External `target="_blank"` links include `rel="noreferrer"`.
- [ ] Navbar links point to supported locale-aware public pages.
- [ ] README states which surfaces are supported v2 and which are legacy or disabled.
- [ ] Demo/limitations docs match the auth/chat decision.
- [ ] `npm run lint` and `npm run build` pass after UI/doc updates.
