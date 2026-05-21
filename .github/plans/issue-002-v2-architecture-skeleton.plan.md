# Plan: Issue 002 - Establish v2 Architecture Skeleton

## Summary

Create an additive v2 architecture skeleton that makes the intended Next.js + FastAPI + Postgres/pgvector RAG platform visible without breaking the existing demo application. The current Next.js app remains runnable from the repository root while new top-level directories document and prepare the v2 system boundaries.

## User Story

As a technical reviewer
I want to see a clear v2 structure for web, API, data, evals, migrations, and docs
So that I can understand how the project will evolve from demo chatbot to source-grounded AI search system.

## Metadata

| Field | Value |
|-------|-------|
| GitHub Issue | #2 |
| Type | REFACTOR |
| Complexity | MEDIUM |
| Systems Affected | Repository structure, docs, README, FastAPI scaffold |
| Branch | v2-rag-platform |

---

## Patterns to Follow

### Preserve Existing Demo

```tsx
// SOURCE: src/app/[locale]/page.tsx
return (
  <>
    <Navbar/>
    <HeroSection />
    <BenefitsSection />
    <FeaturesSection />
    <ServicesSection />
    <CommunitySection />
    <PricingSection />
    <ContactSection />
    <FAQSection />
    <FooterSection />
  </>
);
```

The legacy/demo app is currently rooted in `src/`. Do not move it in this issue; add structure around it and document the transitional state.

### Existing Backend Boundary

```js
// SOURCE: src/app/api/chat/route.js
import { streamText } from "ai";
import { mistral } from "@ai-sdk/mistral";
import { queryKnowledgeBase } from "@/lib/pinecone";
```

The current AI route mixes web API handling and retrieval. v2 should introduce an `api/` FastAPI boundary without deleting the old route yet.

### Current Database Boundary

```prisma
// SOURCE: prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Prisma currently exists for the demo app. Add `migrations/README.md` for future v2 SQL migrations rather than reshaping the live schema in this architecture skeleton.

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | UPDATE | Add v2 transition note and skeleton map |
| `api/README.md` | CREATE | Explain FastAPI service ownership |
| `api/app/main.py` | CREATE | Minimal FastAPI health route |
| `api/pyproject.toml` | CREATE | Minimal backend dependencies and project metadata |
| `web/README.md` | CREATE | Explain current root Next.js app and future web boundary |
| `data/README.md` | CREATE | Explain source metadata/corpus ownership |
| `evals/README.md` | CREATE | Explain eval questions/runs ownership |
| `migrations/README.md` | CREATE | Explain v2 database migration ownership |
| `docs/architecture.md` | CREATE | Initial architecture overview |
| `docs/adr/0001-use-fastapi-for-ai-search-service.md` | CREATE | ADR placeholder |
| `docs/adr/0002-use-supabase-postgres-with-pgvector.md` | CREATE | ADR placeholder |
| `docs/adr/0003-use-search-first-ui.md` | CREATE | ADR placeholder |
| `docs/adr/0004-use-source-grounded-generation.md` | CREATE | ADR placeholder |

---

## Tasks

### Task 1: Add v2 Directory Skeleton

- **Files**: `api/`, `web/`, `data/`, `evals/`, `migrations/`, `docs/`
- **Action**: CREATE
- **Implement**: Add README or scaffold files so Git tracks each top-level boundary.
- **Mirror**: Existing simple Markdown README style.
- **Validate**: `git diff --check`

### Task 2: Add Minimal FastAPI Boundary

- **Files**: `api/pyproject.toml`, `api/app/main.py`
- **Action**: CREATE
- **Implement**: Add a minimal health endpoint that proves the backend boundary without touching existing Next.js API routes.
- **Mirror**: Planned `/health` endpoint from issue #1.
- **Validate**: `python -m py_compile api/app/main.py`

### Task 3: Add Architecture Docs and ADR Placeholders

- **Files**: `docs/architecture.md`, `docs/adr/*.md`
- **Action**: CREATE
- **Implement**: Document current state, target state, boundaries, and pending decisions.
- **Mirror**: Required docs/ADRs from issue #1.
- **Validate**: `git diff --check`

### Task 4: Add Root README v2 Note

- **File**: `README.md`
- **Action**: UPDATE
- **Implement**: Add a concise note explaining that v2 is a source-grounded AI search rebuild and link to docs.
- **Mirror**: Issue #2 acceptance criteria.
- **Validate**: `git diff --check`

### Task 5: Mark Issue #2 as Planned

- **File**: GitHub issue #2
- **Action**: UPDATE
- **Implement**: Add plan reference and `has-plan` label.
- **Mirror**: `/plan` GitHub integration.
- **Validate**: `gh issue view 2 --repo abigailbrionesa/yachaybot --json labels,comments`

---

## Validation

```bash
git diff --check
python -m py_compile api/app/main.py
bun run lint
bunx tsc --noEmit
bun test
```

If `/validate` commands fail because Bun or tests are not configured, report the exact failure rather than claiming success.

### Validation Run - 2026-05-21

| Check | Result | Details |
|-------|--------|---------|
| `git diff --check` | Passed | Only line-ending warnings for existing Windows checkout behavior |
| `python -m py_compile api/app/main.py` | Passed | FastAPI scaffold compiles |
| `bun run lint` | Failed | `bun` is not installed or not on PATH |
| `bunx tsc --noEmit` | Failed | `bunx` is not installed or not on PATH |
| `bun test` | Failed | `bun` is not installed or not on PATH |
| `npm run lint` | Passed | Next lint reported no warnings or errors |
| `npx tsc --noEmit` | Passed | TypeScript completed with exit code 0 after build artifacts stabilized |
| `npm run build` | Passed | Next.js production build completed |
| `npm test` | Failed | No `test` script exists in `package.json` |

---

## Acceptance Criteria

- [x] Branch is `v2-rag-platform`
- [x] Top-level structure exists for `web`, `api`, `data`, `evals`, `migrations`, and `docs`
- [x] Old demo code remains in place
- [x] Root README explains the v2 source-grounded AI search rebuild
- [x] Initial architecture docs and ADR placeholders exist
- [x] Repository still opens/installs without path-breaking restructure
