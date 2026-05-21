# ADR 0002: Use Supabase Postgres With pgvector

## Status

Proposed

## Context

The PRD requires reproducible storage for source metadata, chunks, query logs, citations, and eval results. Vector search should be inspectable alongside relational metadata.

## Decision

Use Supabase Postgres with pgvector for v2 document, chunk, and retrieval storage.

## Consequences

- Migrations can recreate the schema from scratch.
- Source metadata and vectors live in one queryable system.
- Future retrieval improvements can build on SQL, indexes, and pgvector similarity search.
