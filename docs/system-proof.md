# Reviewer System Proof

This guide provides a short technical review path for the current YachayBot implementation. It is intended to make the repository easy to inspect without requiring a full codebase read.

## Review Order

1. Start with `README.md` for the product surface, AI/RAG card, validation commands, and API overview.
2. Review `docs/architecture.md` for the current system contract and service boundaries.
3. Review `docs/backend-migration.md` for the staged migration from Next.js route handlers to FastAPI-owned retrieval and eval services.
4. Review `docs/methodology.md`, `evals/README.md`, and `docs/limitations.md` for source-grounding rules, evaluation scope, metrics, and known boundaries.
5. Review `docs/demo-script.md` and `docs/demo-evidence.md` for the public demo path and available proof artifacts.

## Current System Contract

YachayBot is an evidence-first AI search application for public Peruvian cultural and educational resources. The current MVP uses deterministic retrieval over a shared local corpus. It returns source cards, cited answer previews, evidence strength, and refusal behavior when indexed sources cannot support a confident response.

The public application behavior remains in Next.js route handlers. FastAPI is present as a sidecar service boundary for deterministic search parity, eval-run parity, and experimental retrieval comparison.

## Implemented Behavior

| Area | Current implementation | Review path |
| --- | --- | --- |
| Search UI | Localized search-first pages | `src/app/[locale]/page.tsx`, `src/components/v2/search-experience.tsx` |
| Source browser | Inspectable records with metadata and filters | `src/app/[locale]/sources/page.tsx`, `src/app/api/v1/documents/route.ts` |
| Grounded answers | Retrieved chunks are converted into cited answer previews | `src/lib/v2-data.ts`, `src/app/api/v1/answers/route.ts` |
| Chat | Evidence-first wrapper over the same retrieval and refusal rules | `src/app/[locale]/ai-bot/page.tsx`, `src/app/api/chat/route.ts` |
| Evals | Local Eval v2 benchmark for retrieval, refusal, citation, and latency checks | `src/app/[locale]/evals/page.tsx`, `src/app/api/v1/evals/runs/route.ts`, `data/evals.json`, `evals/README.md` |
| FastAPI search | Sidecar deterministic search parity over the shared corpus | `api/app/main.py`, `api/app/search.py` |
| FastAPI evals | Sidecar eval-run parity over the shared eval set | `api/app/evals.py` |
| Retrieval comparison | Experimental deterministic-versus-pgvector comparison endpoint | `api/app/retrieval_compare.py` |

## Baseline, Fallback, And Experimental Behavior

| Category | Status | Notes |
| --- | --- | --- |
| Deterministic retrieval | Default baseline | Works locally without provider credentials or hosted databases. |
| FastAPI search adapter | Optional sidecar path | `YACHAYBOT_SEARCH_SERVICE_URL` can route Next.js search through FastAPI; local retrieval remains the fallback. |
| Mistral answer polishing | Optional model path | Used only after grounded retrieval. Output is accepted only when citation markers are preserved. |
| pgvector retrieval | Experimental comparison path | Exposed through FastAPI `/v1/retrieval/compare`; it is opt-in and not the public default. |

## API Review Points

| Endpoint | Runtime | Purpose |
| --- | --- | --- |
| `POST /api/v1/search` | Next.js | Public search API with local fallback behavior. |
| `POST /api/v1/answers` | Next.js | Builds cited answers from reviewed chunks. |
| `GET /api/v1/documents` | Next.js | Returns source records and chunks. |
| `GET /api/v1/evals/runs` | Next.js | Returns the local deterministic eval run. |
| `POST /api/chat` | Next.js | Evidence-first chat endpoint with optional Mistral polishing. |
| `POST /v1/search` | FastAPI | Sidecar deterministic search parity endpoint. |
| `GET /v1/evals/runs` | FastAPI | Sidecar eval-run parity endpoint. |
| `POST /v1/retrieval/compare` | FastAPI | Experimental retrieval comparison endpoint. |

## Validation Commands

```powershell
npm run validate
```

```powershell
npm run eval:run
```

```powershell
Set-Location api
C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest
```

```powershell
npm run smoke:public
```

```powershell
git diff --check
```

The deterministic search, eval, and documentation review paths do not require provider credentials. Optional Mistral and pgvector paths are explicitly configured and must fail gracefully when unavailable.

## Scope Boundaries

- The local corpus and eval set are intentionally small and inspectable.
- Current metrics validate the local deterministic baseline, not broad production accuracy.
- Quechua and Aymara surfaces are locale shells with source-bound behavior and should not be described as complete language coverage.
- Auth and educator workspace routes are intentionally paused in the public v2 MVP.
- pgvector retrieval is present for comparison and migration planning, not as the default search path.
