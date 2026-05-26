# YachayBot v2 API

This directory marks the intended FastAPI service boundary for the v2 rebuild.

The current public MVP keeps runnable API behavior inside Next.js route handlers under `src/app/api`. FastAPI now provides sidecar deterministic search and eval parity endpoints for proving the service boundary before the later ingestion, retrieval, and hosted eval service split.

Current implemented behavior:

- Next.js route handlers serve public search, answers, documents, chat, and evals.
- FastAPI exposes the service scaffold, health endpoint, deterministic `/v1/search` parity endpoint, eval-run parity endpoints, and experimental `/v1/retrieval/compare` endpoint over the shared corpus.
- `/v1/retrieval/compare` always returns deterministic baseline results and only attempts pgvector retrieval when `YACHAYBOT_PGVECTOR_ENABLED=true`, `YACHAYBOT_PGVECTOR_DATABASE_URL` is set, and a `queryEmbedding` is provided.

Future behavior is tracked in `docs/backend-migration.md`.

Planned responsibilities:

- source ingestion
- document and chunk inspection
- embedding generation
- experimental pgvector retrieval comparison
- source-grounded answer generation
- query logging
- evaluation runs

The existing Next.js API routes remain in `src/app/api` while v2 is built in increments.
