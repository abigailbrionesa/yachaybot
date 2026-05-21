# YachayBot v2 Architecture

YachayBot v2 rebuilds the original hackathon chatbot into an evidence-first multilingual RAG search system for public Peruvian cultural and educational resources.

## Current State

- The existing user interface is a localized Next.js application in `src/`.
- The supported v2 public surface is search-first: search, source cards, sources, and evals.
- Chat at `src/app/api/chat/route.ts` is an evidence-first wrapper over local v2 retrieval, citations, and refusal behavior.
- `MISTRAL_API_KEY` is optional and only polishes answers after retrieval has produced sufficient evidence.
- Legacy sign-in and credentials login are paused for the v2 MVP.
- Prisma remains in the repository for future protected workspace work, but auth is not part of the public v2 demo.

## Target State

The v2 system separates product surfaces from AI/search behavior:

- `web/` documents the Next.js frontend boundary.
- `api/` owns the FastAPI service for ingestion, retrieval, answer generation, and evals.
- `data/` owns source metadata and corpus fixtures.
- `migrations/` owns v2 database migrations for Postgres and pgvector.
- `evals/` owns evaluation question sets and run artifacts.
- `docs/` owns architecture, methodology, limitations, and ADRs.

## Request Flow

1. A user submits a question from the search-first web UI.
2. The web app calls the Next.js v2 API route or the evidence-first chat wrapper.
3. The current MVP retrieves ranked chunks from the deterministic local corpus.
4. The API returns source cards with snippets and metadata.
5. If requested, the API generates a grounded answer using retrieved chunks only.
6. The UI displays the answer, citations, source cards, and evidence strength.

## Design Rules

- Evidence is part of the product, not just a hidden implementation detail.
- Search and answer generation remain separate API operations.
- Quechua and Aymara support must be labeled experimental unless source evidence exists.
- The system must refuse or qualify answers when evidence is weak.
- Public copy must avoid unsupported claims about validation, accuracy, or cultural authority.
