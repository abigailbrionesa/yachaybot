# PRD: YachayBot Systems Proof Hardening

## Problem Statement

YachayBot already has a working evidence-first MVP, passing tests, a passing production build, and documented limitations. The remaining problem is that the repository still reads more like a polished demo than a reproducible, continuously verified software system.

The project needs to demonstrate repeatable engineering rigor without inflating the AI claims. A reviewer should be able to clone it, verify it, understand the architecture, see automated quality gates, inspect the evaluation method, and understand the next backend/retrieval migration path. Right now, the strongest gaps are deployment/reproducibility, continuous verification, evaluation realism, and the distinction between scaffolded future architecture and runnable current behavior.

## Solution

Upgrade YachayBot into a systems-oriented project by adding continuous integration, a reproducible runtime path, stronger retrieval/evaluation artifacts, and a concrete milestone plan for moving from deterministic local retrieval toward a real backend and vector retrieval path.

This PRD does not ask for more product vision. It asks for evidence. The desired outcome is a repository where the SWE signal is obvious:

- quality gates run automatically on every pull request
- local setup can be reproduced predictably
- tests cover the supported public behavior
- evaluation artifacts include both successful and failing cases
- AI claims are bounded by the corpus and eval method
- future backend/vector-search work is broken into honest, testable increments

## User Stories

1. As a repository reviewer, I want to see automated checks, so that I can trust the project is maintained like real software.
2. As a technical reviewer, I want to see a reproducible local setup, so that I can distinguish runnable implementation from documentation-only claims.
3. As a maintainer, I want the project to show CI, tests, and build verification, so that regressions are caught consistently.
4. As a maintainer, I want the AI claims to stay evidence-backed, so that the project remains rigorous rather than overclaimed.
5. As a local developer, I want one documented command path for setup and verification, so that I can run the project without guessing.
6. As a local developer, I want missing optional provider keys to fail gracefully, so that the deterministic MVP remains runnable.
7. As a maintainer, I want CI to run linting, tests, and production build checks, so that regressions are caught before merge.
8. As a maintainer, I want CI output to be simple and readable, so that failures are easy to diagnose.
9. As a maintainer, I want dependency and framework warnings tracked, so that deprecated tooling does not quietly age the project.
10. As a technical reviewer, I want the test suite to focus on external behavior, so that tests prove product contracts instead of implementation details.
11. As a technical reviewer, I want route-level API tests, so that validation, refusal behavior, citation handling, and rate limiting are not just documented.
12. As a learner, I want source-grounded answers to preserve citations, so that I can inspect claims.
13. As a learner, I want the system to refuse weak-evidence requests, so that unsupported answers are not presented as facts.
14. As an educator, I want the source browser and source cards to reflect the indexed corpus, so that I can understand what the system can and cannot answer.
15. As an educator, I want limitations to stay visible, so that Quechua, Aymara, and cultural-source claims are not overstated.
16. As a demo reviewer, I want visible routes to either work or clearly state they are paused, so that the demo does not feel broken.
17. As a demo reviewer, I want screenshots or a short smoke-tested demo path, so that I can understand the product without running every route myself.
18. As a maintainer, I want the evaluation set to include harder examples, so that the project shows reliability thinking rather than only happy-path retrieval.
19. As a maintainer, I want failure cases captured, so that system tradeoffs are documented and reviewable.
20. As a maintainer, I want evaluation questions to include unsupported, ambiguous, multilingual, and off-topic queries, so that refusal behavior is tested deliberately.
21. As a maintainer, I want eval metrics to distinguish retrieval hits from answer quality, so that one good metric does not hide another weak area.
22. As a maintainer, I want latency to be tracked consistently, so that performance can be discussed honestly.
23. As a maintainer, I want a clear backend migration plan, so that FastAPI and pgvector are not just decorative scaffolding.
24. As a future contributor, I want the service boundary to be explicit, so that ingestion, retrieval, answer generation, and evals can move in increments.
25. As a future contributor, I want each migration step to preserve current public behavior, so that the demo remains stable while architecture improves.
26. As a maintainer, I want any containerized setup to use the same verification commands as local development, so that Docker does not become a separate untested path.
27. As a reviewer, I want the README to state what is current versus future, so that scaffolding is not mistaken for shipped behavior.
28. As a technical reviewer, I want the project summary to explain the problem, architecture, tradeoffs, tests, evals, and next steps concisely.

## Implementation Decisions

- Add a continuous integration workflow that runs install, lint, test, and production build checks on pull requests and pushes to active branches.
- Keep the CI workflow focused on the current runnable Next.js MVP before adding Python service checks.
- Add a dedicated typecheck script if the build currently hides type-check intent too deeply.
- Replace deprecated lint invocation with the supported ESLint CLI path before the framework deprecation becomes a maintenance issue.
- Add a reproducible runtime path through either Docker or an equivalent documented setup script.
- The reproducible runtime must support the deterministic MVP without requiring model-provider, vector database, or hosted database credentials.
- Keep optional AI provider behavior behind graceful fallbacks.
- Treat FastAPI as a future service boundary until it owns real behavior beyond health checks.
- Define backend migration as staged milestones: health scaffold, read-only corpus API, retrieval API parity, eval API parity, then optional ingestion/vector search.
- Keep current public API behavior stable while migration work happens behind clearly versioned routes or feature boundaries.
- Expand the eval suite before claiming stronger AI reliability.
- Separate retrieval evaluation, refusal evaluation, answer citation validation, and latency reporting.
- Include negative examples and weak-evidence examples in evals.
- Include multilingual boundary examples that prove the app refuses or qualifies when indexed evidence is insufficient.
- Keep corpus expansion source-bound and rights-aware.
- Avoid large-scale scraping or unsupported cultural-authority claims.
- Keep public documentation honest about what is implemented now and what is planned.

## Testing Decisions

- Good tests should verify external behavior: request validation, response shape, citation preservation, refusal behavior, rate limiting, eval metrics, and disabled/paused route behavior.
- Avoid tests that depend on private implementation details of ranking unless the ranking contract is intentionally part of the product.
- Keep deterministic tests fast enough to run in CI on every pull request.
- Add CI as the first test amplifier: existing tests are useful only if they run automatically.
- Continue testing the supported route handlers directly where prior route-level tests already exist.
- Add regression coverage for the reproducible setup only where it can be kept lightweight.
- Add tests around expanded eval cases so reliability improvements are not just visual dashboard changes.
- Add one smoke-test path for the public demo if browser tooling is introduced, but do not make browser tests the only proof.
- Do not require live provider keys in CI.
- Do not require hosted database credentials in CI for the deterministic MVP.

## Out of Scope

- Full production account system.
- Full educator workspace.
- Paid plans or monetization.
- Community submission and moderation workflow.
- Large-scale public web scraping.
- Claiming cultural authority or community validation.
- Claiming broad production accuracy from a small local eval set.
- Replacing the entire app architecture in one pass.
- Requiring Mistral, Pinecone, Supabase, or other provider credentials for baseline verification.
- Turning this PRD into generic cloud infrastructure work before the current MVP has CI and reproducibility.

## Further Notes

This is a systems-hardening PRD, not a feature-bloat PRD. The priority order should be:

1. CI.
2. Reproducible local/runtime setup.
3. Stronger eval suite with failure cases.
4. Clear backend/retrieval migration milestones.
5. Updated docs that separate current behavior from future architecture.

The project summary should become:

> YachayBot is an evidence-first AI search system. The current MVP uses deterministic retrieval so the behavior is reproducible without provider keys, validates API inputs, refuses weak evidence, preserves citations, and runs tests/build checks automatically. The next migration path moves retrieval and evals behind a service boundary and then upgrades to pgvector-backed retrieval while preserving the same public contracts.
