# YachayBot v2

Evidence-first AI search for public Peruvian cultural and educational resources.

YachayBot v2 rebuilds a hackathon chatbot into an inspectable RAG-style MVP. A user can ask a question, inspect retrieved source cards, read a grounded answer with citations, and see when the system does not have enough evidence.

The project favors visible sources, honest limitations, and reproducible evaluation over broad AI claims.

## MVP Features

- Search-first homepage
- Source cards with snippets, metadata, rights notes, and URLs
- `/sources` browser with filters for language, topic, and source type
- `/evals` dashboard for top-3 hit rate, top-5 hit rate, refusal pass rate, and latency
- `/ai-bot` chat wrapper over the same retrieval, citation, and refusal rules
- `/api/v1/documents`
- `/api/v1/search`
- `/api/v1/answers`
- `/api/v1/evals/runs`
- Local corpus with 15 public or official sources and 5 curated project notes
- Deterministic local retrieval baseline for demo and testing
- Playwright-smoked public flows for search, sources, chat, evals, paused dashboard, mobile nav, and API contracts

## Supported Public Surface

The v2 public demo is search-first only:

- `/es`, `/qu`, `/ay`: evidence-first search experience
- `/es/sources`: inspectable source browser
- `/es/evals`: deterministic eval dashboard
- `/es/ai-bot`: evidence-first chat wrapper over the same retrieval and citation flow

Legacy account flows are paused:

- `/api/chat` validates chat messages, retrieves from the v2 corpus, cites sources, and refuses weak evidence
- `/sign-in` shows an auth-out-of-scope page
- `/dashboard` shows a paused educator-workspace page
- `/api/auth/*` returns `503 FEATURE_UNAVAILABLE`

When `MISTRAL_API_KEY` is configured, `/api/chat` can polish grounded answers. Without it, the local evidence-grounded answer is returned. Pinecone credentials are reserved for the later vector-search migration and are not required for the current deterministic MVP.

## Repository Tags

Suggested GitHub topics for the current project state:

`ai-search`, `evidence-first`, `rag`, `retrieval-augmented-generation`, `source-grounded`, `citations`, `peru`, `education`, `cultural-heritage`, `multilingual`, `nextjs`, `typescript`, `tailwindcss`, `zod`, `mistral-ai`, `evals`, `playwright`, `postgresql`, `pgvector`, `open-source`

## Demo Evidence

These committed demo images show the intended public review flow:

- [Search-first homepage](public/demo/search-home.svg)
- [Source cards and citations](public/demo/source-cards.svg)
- [Sources filtering](public/demo/sources-filtering.svg)
- [Eval dashboard](public/demo/eval-dashboard.svg)

## Local Setup

```bash
npm install
npm run prisma-generate
npm run dev
```

Then open `http://localhost:3000/es`.

Optional model/provider configuration:

```bash
copy .env.example .env.local
```

Add a rotated `MISTRAL_API_KEY` to let `/api/chat` polish grounded answers. `PINECONE_API_KEY` and `PINECONE_HOST` are reserved for the later vector-search migration.

If another app is already using port 3000:

```bash
npm run dev -- -p 3001
```

## Validation

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

The historical slash-command validation contract also calls `bun run lint`, `bunx tsc --noEmit`, and `bun test`; those require Bun to be installed.

Recent browser QA also exercised the public demo with Playwright:

- search and source-card flow
- sources navigation
- chat with visible evidence
- eval dashboard
- paused dashboard
- auth/eval API contracts
- mobile navigation

## API Overview

### `GET /api/v1/documents`

Returns source records and inspectable chunks.

### `POST /api/v1/search`

Accepts:

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "limit": 5
}
```

Returns ranked chunks, source metadata, latency, language, evidence strength, and answer preview.

### `POST /api/v1/answers`

Accepts a query plus reviewed `chunkIds`:

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "chunkIds": ["chunk-doc-minedu-eib-001"]
}
```

Returns an answer generated from those reviewed chunks only, with citations or refusal.

### `GET /api/v1/evals/runs`

Returns the local deterministic eval run and metrics.

## Architecture

- `src/app/[locale]/page.tsx`: search-first homepage
- `src/components/v2/search-experience.tsx`: API-backed search UI
- `src/lib/v2-data.ts`: server-side local corpus, retrieval, answer, and eval helpers
- `src/lib/v2-types.ts`: shared public TypeScript types
- `src/lib/v2-schemas.ts`: request validation schemas
- `src/app/api/v1/*`: API routes
- `src/app/[locale]/sources/page.tsx`: source browser
- `src/app/[locale]/evals/page.tsx`: eval dashboard
- `migrations/001_v2_core.sql`: target Postgres/pgvector schema draft

## Documentation

- [Architecture](docs/architecture.md)
- [Methodology](docs/methodology.md)
- [Limitations](docs/limitations.md)
- [Demo script](docs/demo-script.md)
- [Portfolio summary](docs/portfolio-summary.md)
- [PRD](.github/PRDs/PRD.md)

## Limitations

- The current corpus is small and curated for demonstration.
- Local retrieval uses token overlap, not production vector search.
- Quechua and Aymara behavior is experimental and source-bound.
- Curated notes are methodology notes, not primary cultural sources.
- Sign-in flows are paused for this MVP.
- Chat uses the v2 retrieval baseline and must keep visible sources and refusal behavior.
- Rate limiting is an in-memory MVP guard, not a production KV/Redis limiter.
- The app does not claim community validation.
- The app does not claim zero hallucinations.

## Origin

YachayBot began as a hackathon project at INFORTELGRAF Peru 2025. This v2 rebuild keeps the educational motivation while narrowing public claims and making the system's evidence, architecture, and limitations inspectable.
