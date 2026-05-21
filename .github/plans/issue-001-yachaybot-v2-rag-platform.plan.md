# Plan: Issue 001 - YachayBot v2 RAG Platform

## Summary

Issue #1 is the parent PRD for rebuilding YachayBot from a hackathon chatbot into an evidence-first multilingual RAG search system. The implementation should proceed as a dependency-ordered sequence from issue #2 through issue #13, preserving the existing Next.js demo while introducing a clear v2 architecture with a FastAPI backend, data corpus, migrations, evals, and documentation.

## User Story

As a student, educator, or technical reviewer
I want to search Peruvian cultural and educational resources with source cards, citations, and evaluation evidence
So that I can trust what the system says and understand its technical boundaries.

## Metadata

| Field | Value |
|-------|-------|
| GitHub Issue | #1 |
| Type | NEW_CAPABILITY |
| Complexity | HIGH |
| Systems Affected | Next.js web app, FastAPI backend, data corpus, migrations, evals, docs |
| Branch | v2-rag-platform |

---

## Existing Codebase Patterns

### App Structure

```tsx
// SOURCE: src/app/[locale]/page.tsx
export default function MainPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center">
        <p>...</p>
      </main>
    );
  }

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
}
```

The current app is a localized Next.js frontend with section-based marketing/demo pages. v2 should preserve this code under a legacy/demo path or documented legacy area while adding a search-first experience.

### API Pattern

```js
// SOURCE: src/app/api/chat/route.js
export async function POST(req) {
  const { messages } = await req.json();
  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .pop();
  const userQuestion = lastUserMessage?.content || "";
  const knowledgeResults = await queryKnowledgeBase(userQuestion);
  // ...
}
```

Existing AI behavior is implemented inside the Next.js route layer. v2 should move search, retrieval, answer generation, ingestion, and evals into a FastAPI service with versioned `/api/v1` routes.

### Database Pattern

```prisma
// SOURCE: prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(dbgenerated("gen_random_uuid()::text"))
  email        String        @unique
  name         String?
  avatar       String?
  password     String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}
```

The existing schema only supports auth users. v2 needs document, chunk, query, citation, and eval schema managed through migrations.

### UI Component Pattern

```tsx
// SOURCE: src/components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
    },
  }
)
```

New frontend work should reuse the existing component style, Tailwind conventions, and `lucide-react` icons.

### Test Pattern

No first-party test files were found with `rg --files -g '*test*' -g '*spec*'`. v2 should introduce tests deliberately as backend modules and frontend behavior arrive.

---

## Dependency Order

| Order | Issue | Purpose |
|-------|-------|---------|
| 1 | #1 | Parent PRD and roadmap anchor |
| 2 | #2 | Establish v2 architecture skeleton |
| 3 | #3 | Remove or quarantine unsupported public claims |
| 4 | #4 | Ship first inspectable source record |
| 5 | #5 | Add document chunks |
| 6 | #6 | Add embeddings and vector search |
| 7 | #7 | Generate source-grounded answers with citations |
| 8 | #8 | Add honest multilingual behavior |
| 9 | #9 | Scale corpus to MVP size |
| 10 | #10 | Add query logging and evidence strength |
| 11 | #11 | Add retrieval eval runner |
| 12 | #12 | Add eval dashboard |
| 13 | #13 | Prepare public demo and portfolio documentation |

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.github/plans/issue-001-yachaybot-v2-rag-platform.plan.md` | CREATE | Parent implementation plan for issue #1 |
| `.github/plans/issue-002-v2-architecture-skeleton.plan.md` | CREATE | Next plan produced by `/plan` for issue #2 |
| `README.md` | UPDATE | Later issues: explain v2 direction and remove overclaims |
| `docs/architecture.md` | CREATE | Later issues: architecture overview |
| `docs/adr/*.md` | CREATE | Later issues: major architecture decisions |
| `api/` | CREATE | Later issues: FastAPI service |
| `web/` or existing `src/` | CREATE/UPDATE | Later issues: search-first frontend |
| `data/` | CREATE | Later issues: source metadata and corpus |
| `evals/` | CREATE | Later issues: eval questions and runner outputs |
| `migrations/` | CREATE | Later issues: backend database migrations |

---

## Tasks

### Task 1: Record Parent Roadmap Plan

- **File**: `.github/plans/issue-001-yachaybot-v2-rag-platform.plan.md`
- **Action**: CREATE
- **Implement**: Capture the PRD implementation strategy, codebase patterns, dependency order, and validation approach.
- **Mirror**: `/plan` command output contract in `C:\Users\abiga\.config\opencode\commands\plan.md`
- **Validate**: `git diff --check`

### Task 2: Mark Issue #1 as Planned

- **File**: GitHub issue #1
- **Action**: UPDATE
- **Implement**: Add a comment linking this plan and add a `has-plan` label.
- **Mirror**: GitHub integration instructions in `/plan`
- **Validate**: `gh issue view 1 --repo abigailbrionesa/yachaybot --json labels,comments`

### Task 3: Generate Issue #2 Plan

- **File**: `.github/plans/issue-002-v2-architecture-skeleton.plan.md`
- **Action**: CREATE
- **Implement**: Convert issue #2 into a concrete architecture skeleton plan with files, tasks, and validation commands.
- **Mirror**: This plan's structure and existing project patterns.
- **Validate**: `git diff --check`

---

## Validation

```bash
git diff --check
bun run lint
bunx tsc --noEmit
bun test
```

The repository currently defines `npm` scripts but `/validate` explicitly asks for Bun commands. If Bun-based commands fail because the project has no Bun test setup or because `next lint` is unavailable in Next.js 15, record the exact failure and update the implementation plan before claiming completion.

### Validation Run - 2026-05-21

| Check | Result | Details |
|-------|--------|---------|
| `bun run lint` | Failed | `bun` is not installed or not on PATH |
| `bunx tsc --noEmit` | Failed | `bunx` is not installed or not on PATH |
| `bun test` | Failed | `bun` is not installed or not on PATH |
| `npm run lint` | Passed | Next lint reported no warnings or errors |
| `npx tsc --noEmit` | Passed | TypeScript completed with exit code 0 after build artifacts stabilized |
| `npm run build` | Passed | Next.js production build completed after Prisma client generation and lazy Pinecone initialization |
| `npm test` | Failed | No `test` script exists in `package.json` |

---

## Acceptance Criteria

- [x] Parent roadmap plan exists under `.github/plans`
- [x] Issue #1 has a plan reference
- [x] `has-plan` label exists and is attached to issue #1
- [x] Issue #2 plan is ready before implementation starts
- [x] Fresh validation output is recorded before any completion claim
