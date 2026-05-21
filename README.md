# YachayBot v2

Evidence-first AI search for public Peruvian cultural and educational resources.

YachayBot began as a chatbot project that placed third at the INFORTELGRAF Peru Hackathon 2025. This v2 rebuild turns the original idea into a more rigorous full-stack AI search prototype: users can search a curated corpus, inspect source cards, ask grounded questions, see citations, and get refusals when the indexed evidence is too weak.

The project is designed to showcase practical software engineering and applied AI judgment: scoped product decisions, typed API contracts, source-grounded answer generation, evaluation metrics, browser-tested flows, and honest limitations.

## What You Can Try

The public MVP is localized and search-first:

- `/es`, `/qu`, `/ay`: search experience
- `/es/sources`: source browser with filters
- `/es/evals`: retrieval and refusal evaluation dashboard
- `/es/ai-bot`: chat interface over the same retrieval and citation rules

Legacy account flows are intentionally paused for this MVP:

- `/sign-in`: explains that auth is out of scope
- `/dashboard`: shows a paused educator-workspace state
- `/api/auth/*`: returns `503 FEATURE_UNAVAILABLE`

## Why This Project Exists

The original hackathon concept explored how AI could widen access to Peruvian cultural and educational knowledge, aligned with SDGs 4, 9, and 10.

The v2 implementation narrows that mission into a safer and more inspectable product slice. It does not present itself as a cultural authority, a community-validated archive, or a production preservation system. Instead, it demonstrates how an AI education product can make evidence visible, preserve uncertainty, and avoid unsupported claims.

## Key Features

- Search-first Next.js interface for public cultural and educational resources
- Source cards with snippets, institution metadata, language, topic tags, rights notes, and URLs
- Evidence-grounded answer generation with citation markers
- Refusal behavior when retrieved evidence is weak
- Optional Mistral answer polishing after deterministic retrieval succeeds
- Citation validation that falls back to the local grounded answer if model output drops or invents markers
- Local deterministic retrieval baseline using token-overlap scoring
- Evaluation dashboard with top-3 hit rate, top-5 hit rate, refusal pass rate, and latency
- API routes for documents, search, answers, eval runs, and chat
- Paused auth/workspace states instead of half-working protected flows
- Playwright-smoked demo flows for search, sources, chat, evals, paused dashboard, mobile navigation, and API contracts

## AI And Retrieval Design

The current MVP uses a deterministic local corpus so reviewers can inspect the behavior without provider keys or hosted infrastructure.

1. A user submits a query from search or chat.
2. The API validates the request with Zod.
3. `searchCorpus` ranks local chunks with token-overlap scoring.
4. `buildAnswer` classifies evidence as strong, moderate, or weak.
5. Weak evidence returns a refusal instead of a confident answer.
6. Usable evidence returns a cited local answer.
7. If `MISTRAL_API_KEY` is configured, Mistral may polish the answer.
8. Model output is accepted only if it preserves known citation markers.

This keeps the demo reproducible while leaving a clear migration path to embeddings, Postgres/pgvector, or Pinecone.

## Current Corpus And Evaluation

The MVP corpus contains:

- 15 public or official source records
- 5 curated methodology notes
- 1 inspectable chunk per source record
- source metadata for institution, language, region, topic tags, rights notes, and URL

The local eval set contains 10 questions:

- factual retrieval checks with expected source IDs
- refusal checks for unsupported or unsafe requests
- metrics for top-3 hit rate, top-5 hit rate, refusal pass rate, and average latency

Current deterministic local eval metrics:

| Metric | Value |
| --- | ---: |
| Top-3 hit rate | 1.00 |
| Top-5 hit rate | 1.00 |
| Refusal pass rate | 1.00 |

These metrics are useful for regression testing the MVP corpus. They are not a claim of production accuracy.

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, next-intl
- API: Next.js route handlers
- Validation: Zod request schemas
- Retrieval: local TypeScript corpus and deterministic token-overlap scoring
- AI: optional Mistral polishing after retrieval and citation checks
- Database path: documented Supabase Postgres and pgvector migration draft
- Future vector path: optional Pinecone migration
- Testing: TypeScript unit tests, Next.js build checks, Playwright smoke testing

## API Overview

### `GET /api/v1/documents`

Returns source records and inspectable chunks.

### `POST /api/v1/search`

Searches the local corpus and returns ranked chunks, source metadata, latency, detected language, evidence strength, and an answer preview.

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "limit": 5
}
```

### `POST /api/v1/answers`

Generates an answer from reviewed chunks only. If evidence is weak, the API refuses.

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "chunkIds": ["chunk-doc-minedu-eib-001"]
}
```

### `GET /api/v1/evals/runs`

Returns the deterministic local eval run and metrics.

### `POST /api/chat`

Validates chat messages, retrieves from the v2 corpus, builds a cited answer or refusal, and optionally calls Mistral for grounded answer polishing.

## Demo Evidence

Committed demo assets show the intended review flow:

- [Search-first homepage](public/demo/search-home.svg)
- [Source cards and citations](public/demo/source-cards.svg)
- [Sources filtering](public/demo/sources-filtering.svg)
- [Eval dashboard](public/demo/eval-dashboard.svg)

## Local Setup

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npm run prisma-generate
```

Start the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/es
```

If port 3000 is busy:

```bash
npm run dev -- -p 3001
```

## Environment Variables

Create a local env file:

```bash
copy .env.example .env.local
```

Optional variables:

| Variable | Current role |
| --- | --- |
| `MISTRAL_API_KEY` | Enables optional answer polishing after source-grounded retrieval |
| `PINECONE_API_KEY` | Reserved for future vector-search migration |
| `PINECONE_HOST` | Reserved for future vector-search migration |

The current deterministic MVP does not require Mistral or Pinecone credentials.

## Validation

Run the main local checks:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

The historical slash-command validation contract also calls `bun run lint`, `bunx tsc --noEmit`, and `bun test`; those require Bun to be installed.

## Architecture Map

- `src/app/[locale]/page.tsx`: localized search-first homepage
- `src/app/[locale]/sources/page.tsx`: source browser
- `src/app/[locale]/evals/page.tsx`: eval dashboard
- `src/app/[locale]/ai-bot/page.tsx`: chat UI
- `src/app/api/v1/*`: v2 API routes
- `src/app/api/chat/route.ts`: evidence-first chat endpoint
- `src/lib/v2-data.ts`: local corpus, retrieval, answers, and evals
- `src/lib/v2-schemas.ts`: request validation schemas
- `src/lib/v2-types.ts`: shared TypeScript contracts
- `migrations/001_v2_core.sql`: target Postgres/pgvector schema draft
- `docs/adr/*`: architecture decision records

## Documentation

- [Architecture](docs/architecture.md)
- [Methodology](docs/methodology.md)
- [Limitations](docs/limitations.md)
- [Demo script](docs/demo-script.md)
- [Portfolio summary](docs/portfolio-summary.md)
- [PRD](.github/PRDs/PRD.md)

## What Changed From The Hackathon Demo

The first version described a broad multilingual chatbot, semantic search stack, and full authentication surface. The v2 project is intentionally narrower:

- From broad chatbot claims to source-grounded search and cited answers
- From hidden AI behavior to inspectable retrieval, evidence strength, and refusals
- From implied vector search to an explicit deterministic MVP baseline
- From active auth claims to paused auth until there is a protected workflow worth securing
- From general multilingual claims to explicit Spanish/English behavior and experimental Quechua/Aymara boundaries

## Limitations

- The corpus is small and curated for demonstration.
- Local retrieval uses token overlap, not production vector search.
- Quechua and Aymara behavior is experimental and source-bound.
- Curated notes are methodology notes, not primary cultural sources.
- Sign-in and educator workspace flows are paused.
- Rate limiting is an in-memory MVP guard, not a production Redis or KV limiter.
- The project does not claim community validation.
- The project does not claim zero hallucinations.
- The project does not claim to preserve ancestral knowledge by itself.

## Repository Topics

Suggested GitHub topics:

`ai-search`, `evidence-first`, `rag`, `retrieval-augmented-generation`, `source-grounded`, `citations`, `peru`, `education`, `cultural-heritage`, `multilingual`, `nextjs`, `typescript`, `tailwindcss`, `zod`, `mistral-ai`, `evals`, `playwright`, `postgresql`, `pgvector`, `open-source`

## Origin And Acknowledgements

YachayBot began at INFORTELGRAF Peru Hackathon 2025, where it placed third. This v2 rebuild keeps the educational motivation while making the system's evidence, architecture, and limitations inspectable.

Thank you to Alberth Jesus Vigo Saldana and Pierina Ramos for supporting innovation in Peruvian tech, and to Jeff Barr, Lesly Zerna, Melissa Amado, Narciso Lema, Lennin Cenas Vasquez, and Nicolas Molina Monroy for openly sharing knowledge that inspires this work.
