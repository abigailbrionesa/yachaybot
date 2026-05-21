# PRD: YachayBot v2 Evidence-First RAG Search MVP

## 1. Executive Summary

YachayBot v2 rebuilds the original hackathon chatbot into an evidence-first multilingual search system for public Peruvian cultural and educational resources. The MVP must let users search a documented corpus, inspect source cards, see source-grounded answers with citations, and review retrieval evaluation metrics.

The current branch already contains a local deterministic MVP slice. This PRD defines the product target and the remaining requirements needed before the draft PR can become merge-ready: fix the Vercel deployment blocker, move the search UI behind API routes, align the answer endpoint with reviewed retrieved chunks, and tighten the public demo/documentation story.

## 2. Mission

YachayBot helps learners explore public cultural and educational resources with visible evidence, careful language boundaries, and honest limitations.

Core principles:

- Evidence is part of the product.
- The system must show sources before asking users to trust answers.
- The product must not claim cultural authority, community validation, or zero hallucinations.
- Quechua and Aymara behavior must be labeled experimental and source-bound.
- Technical reviewers should be able to inspect architecture, data, retrieval, citations, and evals.

## 3. Target Users

### Learners

Pain points:

- Generic AI answers are hard to verify.
- Cultural or educational topics can be presented without sources.
- Language support is often overstated.

Needs:

- Searchable source cards.
- Clear citations.
- Refusal or uncertainty when evidence is weak.

### Educators

Pain points:

- Need to evaluate whether resources are appropriate and source-backed.
- Need metadata such as topic, institution, region, and rights note.

Needs:

- Inspectable corpus.
- Filters by language, topic, and source type.
- Honest limitations.

### Technical Reviewers

Pain points:

- AI demos often hide retrieval, data modeling, and eval quality.
- Public copy may overclaim system capability.

Needs:

- Clear API boundaries.
- Documented schema and architecture.
- Evaluation dashboard with failed cases.

## 4. MVP Scope

In scope:

- [x] Search-first user experience.
- [x] Source cards with snippets, metadata, rights notes, and URLs.
- [x] Source browser with language, topic, and source type filters.
- [x] Local corpus with at least 15 public/official sources and 5 curated notes.
- [x] Deterministic retrieval baseline for local MVP.
- [x] Evidence strength classification.
- [x] Source-grounded answer generation with citations.
- [x] Refusal behavior when evidence is weak.
- [x] Eval dashboard with top-3 hit rate, top-5 hit rate, refusal pass rate, and latency.
- [x] API route drafts under `/api/v1`.
- [x] Architecture, methodology, limitations, demo, and portfolio documentation.
- [ ] UI search flow calls `/api/v1/search` instead of importing retrieval helpers directly.
- [ ] Answer endpoint accepts retrieved chunk IDs or payloads from the reviewed search result.
- [ ] Vercel preview deploys successfully.

Out of scope:

- [ ] Full Quechua/Aymara NLP support.
- [ ] Translation as a primary product.
- [ ] Community-submitted knowledge workflow.
- [ ] Paid plans or monetization.
- [ ] Auth for the v2 MVP.
- [ ] Production Supabase/pgvector integration.
- [ ] Large-scale scraping.
- [ ] Reranking or model comparison.

## 5. User Stories

1. As a learner, I want to ask a question and see retrieved source cards so that I can verify the answer.
2. As a learner, I want citation markers linked to sources so that I can inspect where claims came from.
3. As a learner, I want the system to refuse weak-evidence questions so that I do not mistake guesses for facts.
4. As an educator, I want to browse indexed sources so that I know what the system can use.
5. As an educator, I want metadata and rights notes so that I can judge source suitability.
6. As a bilingual user, I want Spanish and English support so that I can ask in a comfortable language.
7. As a user interested in Quechua or Aymara, I want clear experimental labels so that I understand product limits.
8. As a technical reviewer, I want eval metrics and failed cases so that I can evaluate retrieval quality.

## 6. Core Architecture

Current MVP:

- `src/app/[locale]/page.tsx`: search-first homepage.
- `src/components/v2/search-experience.tsx`: local search UI.
- `src/lib/v2-data.ts`: local corpus, chunk, retrieval, answer, and eval helpers.
- `src/app/api/v1/*`: API route drafts.
- `src/app/[locale]/sources/page.tsx`: source browser.
- `src/app/[locale]/evals/page.tsx`: eval dashboard.
- `migrations/001_v2_core.sql`: target Postgres/pgvector schema draft.

Target architecture:

- Web UI calls API routes for search, answers, documents, and evals.
- API routes or FastAPI service own retrieval, answer generation, logging, and eval execution.
- Corpus and chunks move from local TypeScript fixtures toward ingestion-managed storage.
- Supabase Postgres with pgvector stores documents, chunks, queries, citations, and evals.

## 7. Tools and Features

### Search

Requirements:

- Accept query text.
- Detect or accept language.
- Return ranked chunks with score, snippet, source metadata, and source URL.
- Return latency and retrieved chunk IDs.
- Return evidence strength.

### Source Cards

Requirements:

- Show title, source type, language, topic tags, institution, region, rights note, URL, and snippet.
- Clearly label curated notes.
- Link citations to source cards.

### Answer Generation

Requirements:

- Accept query and retrieved chunk IDs or payloads.
- Generate only from reviewed retrieved context.
- Include citation markers.
- Refuse when evidence is weak.

### Sources Page

Requirements:

- List all source records.
- Filter by language, source type, and topic.
- Show inspectable chunks.

### Eval Dashboard

Requirements:

- Show top-3 hit rate.
- Show top-5 hit rate.
- Show refusal pass rate.
- Show average latency.
- Show per-question expected vs retrieved source IDs.
- Highlight failed cases.

## 8. Technology Stack

Frontend:

- Next.js 15 or newer safe patched version.
- React 19.
- TypeScript.
- Tailwind CSS.
- Radix/shadcn-style UI components.
- `next-intl` for localized routes.

Backend/API:

- Current MVP: Next.js API routes under `/api/v1`.
- Target service: FastAPI for ingestion, retrieval, answer generation, query logging, and evals.

Data:

- Current MVP: deterministic TypeScript corpus fixtures.
- Target: Supabase Postgres with pgvector.

AI/retrieval:

- Current MVP: deterministic token-overlap retrieval.
- Target: provider-backed embeddings and pgvector similarity search.

## 9. Security and Configuration

Current configuration:

- Existing demo uses Prisma and NextAuth-related auth code.
- `PINECONE_API_KEY` is optional locally; missing key returns no legacy Pinecone results instead of crashing build.

Required configuration:

- No secrets committed.
- Missing provider keys must fail gracefully.
- API routes must validate request bodies.
- Production search must not leak stack traces or provider errors.
- Query logging must not store API keys or sensitive data.

Review blocker:

- Vercel currently rejects the PR due a vulnerable Next.js version. Upgrade `next` and matching `eslint-config-next` before merge.

## 10. API Specification

### `GET /api/v1/documents`

Response:

```json
{
  "documents": [
    {
      "id": "doc-minedu-eib-001",
      "title": "Educacion intercultural bilingue en Peru",
      "sourceType": "official",
      "language": "es",
      "topicTags": ["educacion", "eib", "lenguas"],
      "chunks": []
    }
  ]
}
```

### `POST /api/v1/search`

Request:

```json
{
  "query": "Que recursos explican educacion intercultural bilingue?",
  "limit": 5
}
```

Response:

```json
{
  "query": "...",
  "language": "es",
  "latencyMs": 12,
  "retrievedChunkIds": ["chunk-doc-minedu-eib-001"],
  "evidenceStrength": "strong",
  "results": [],
  "answer": {}
}
```

### `POST /api/v1/answers`

Required next iteration request:

```json
{
  "query": "...",
  "chunkIds": ["chunk-doc-minedu-eib-001"]
}
```

Response:

```json
{
  "query": "...",
  "language": "es",
  "latencyMs": 12,
  "retrievedChunkIds": [],
  "answer": {
    "answer": "... [1]",
    "citations": [],
    "evidenceStrength": "moderate",
    "refused": false
  }
}
```

### `GET /api/v1/evals/runs`

Response:

```json
{
  "runs": [
    {
      "id": "local-eval-run-001",
      "metrics": {
        "top3HitRate": 0.7,
        "top5HitRate": 0.9,
        "refusalPassRate": 1,
        "averageLatencyMs": 1
      },
      "results": []
    }
  ]
}
```

## 11. Success Criteria

MVP is successful when:

- Vercel preview deploys successfully.
- User can search from first screen.
- Search UI uses `/api/v1/search`.
- User can inspect ranked source cards.
- Answer generation uses the same retrieved chunks the user reviewed.
- Weak evidence produces refusal.
- Sources page shows complete metadata and filters.
- Evals page shows metrics and failed cases.
- README setup works from a fresh clone.
- Public copy avoids unsupported claims.

## 12. Implementation Phases

### Phase 1: Merge Blockers

Deliverables:

- Upgrade vulnerable Next.js dependency.
- Confirm Vercel preview passes.
- Move search UI to fetch `/api/v1/search`.
- Update answer endpoint to accept chunk IDs or payloads.

### Phase 2: MVP Hardening

Deliverables:

- Add request/response Zod schemas.
- Add `npm test` script and minimal tests for retrieval, evidence strength, answer refusal, and eval metrics.
- Add API error objects.
- Add empty/loading/error states to v2 pages.

### Phase 3: Backend/Data Transition

Deliverables:

- Move corpus from TypeScript fixture to data ingestion path.
- Connect Supabase Postgres schema.
- Add pgvector embeddings.
- Store queries and answer citations persistently.

### Phase 4: Public Demo

Deliverables:

- Add screenshots or GIFs.
- Verify fresh-clone setup.
- Finalize portfolio summary.
- Make PR ready for review and merge.

## 13. Future Considerations

- Hybrid search with keyword plus vector retrieval.
- Reranking.
- Model comparison.
- Citation coverage metrics.
- Groundedness scoring.
- Admin source ingestion UI.
- Authenticated educator workspace.
- Community contribution process with consent and validation.

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vercel blocks deployment due vulnerable dependencies | PR cannot ship | Upgrade Next.js and matching packages, rerun Vercel |
| UI bypasses API routes | Architecture story becomes misleading | Make UI call `/api/v1/search` and `/api/v1/answers` |
| Answer endpoint retrieves a different context than user reviewed | Citations can mismatch visible source cards | Accept chunk IDs/payloads and generate from those only |
| Local corpus ships to client bundle | Poor scalability and weak backend boundary | Keep retrieval/corpus server-side; fetch API JSON |
| No automated tests | Regressions in retrieval/evals go unnoticed | Add `npm test` with focused unit tests |
| Legacy README/demo copy remains confusing | Public positioning weakens | Replace old decorative README section with clean v2 docs |
