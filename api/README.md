# YachayBot v2 API

This directory owns the FastAPI service for the v2 rebuild.

Planned responsibilities:

- source ingestion
- document and chunk inspection
- embedding generation
- vector retrieval
- source-grounded answer generation
- query logging
- evaluation runs

The existing Next.js API routes remain in `src/app/api` while v2 is built in increments.
