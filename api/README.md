# YachayBot v2 API

This directory marks the intended FastAPI service boundary for the v2 rebuild.

The current public MVP keeps runnable API behavior inside Next.js route handlers under `src/app/api`. FastAPI now provides a sidecar deterministic search parity endpoint for proving the service boundary before the later ingestion, retrieval, and eval service split.

Current implemented behavior:

- Next.js route handlers serve public search, answers, documents, chat, and evals.
- FastAPI exposes the service scaffold, health endpoint, and deterministic `/v1/search` parity endpoint over the shared corpus.

Future behavior is tracked in `docs/backend-migration.md`.

Planned responsibilities:

- source ingestion
- document and chunk inspection
- embedding generation
- vector retrieval
- source-grounded answer generation
- query logging
- evaluation runs

The existing Next.js API routes remain in `src/app/api` while v2 is built in increments.
