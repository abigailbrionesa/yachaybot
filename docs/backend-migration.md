# Backend Migration Milestones

YachayBot currently keeps public MVP behavior inside Next.js route handlers. FastAPI now proves deterministic search parity as a sidecar service boundary, but it should not be treated as production vector retrieval until the milestones below are implemented and verified.

## Milestone 1: Service Health

Goal: keep the FastAPI service scaffold runnable and observable.

Verification:

- health endpoint returns a stable response
- service starts without provider credentials
- README documents the command to run it

Credential requirement: none.

## Milestone 2: Shared Corpus And Search Parity

Goal: expose deterministic search and answer-preview parity through the service boundary over the same shared corpus used by Next.js.

Verification:

- FastAPI `/v1/search` returns the same response family as the current Next.js search route
- shared corpus JSON is read by both Next.js and FastAPI
- tests cover valid search, invalid requests, weak-evidence refusal, and expected EIB retrieval

Credential requirement: none for deterministic fixtures.

Status: implemented as a sidecar parity endpoint. It is not yet the public UI dependency.

## Milestone 3: Next.js Adapter

Goal: route the current Next.js search API through the FastAPI sidecar or a compatibility adapter without changing public product behavior.

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
