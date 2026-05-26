# Backend Migration Milestones

YachayBot currently keeps runnable MVP behavior inside Next.js route handlers. The FastAPI directory marks the intended service boundary, but it should not be treated as production search behavior until the milestones below are implemented and verified.

## Milestone 1: Service Health

Goal: keep the FastAPI service scaffold runnable and observable.

Verification:

- health endpoint returns a stable response
- service starts without provider credentials
- README documents the command to run it

Credential requirement: none.

## Milestone 2: Read-Only Corpus API

Goal: expose the same document and chunk metadata through the service boundary.

Verification:

- corpus API returns the same source records as the current Next.js MVP
- response schema is documented
- tests cover empty and populated corpus responses

Credential requirement: none for deterministic fixtures.

## Milestone 3: Retrieval API Parity

Goal: move deterministic retrieval behind the service boundary without changing public product behavior.

Verification:

- retrieval API returns ranked source cards with scores, snippets, and metadata
- current search API can call the service or a compatibility adapter
- existing retrieval tests pass against the service-backed path

Credential requirement: none for deterministic retrieval.

## Milestone 4: Eval API Parity

Goal: move eval execution and run retrieval behind the service boundary.

Verification:

- eval API returns the same metric families as the current MVP
- failed and risky cases remain inspectable
- dashboard behavior is unchanged from the user's perspective

Credential requirement: none for deterministic evals.

## Milestone 5: Vector Retrieval

Goal: add pgvector-backed retrieval while preserving the current public contracts.

Verification:

- migrations define document, chunk, embedding, query, citation, and eval storage
- vector retrieval can be compared against deterministic retrieval
- eval runs show before/after retrieval metrics
- missing provider credentials fail gracefully in local development

Credential requirement: Supabase Postgres with pgvector and an embedding provider for non-local experiments.

## Non-Goals

- Replacing the whole application in one migration.
- Requiring hosted infrastructure for baseline verification.
- Claiming production accuracy from a small local eval set.
- Expanding corpus ingestion without source and rights review.
