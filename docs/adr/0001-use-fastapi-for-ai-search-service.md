# ADR 0001: Use FastAPI For AI Search Service

## Status

Proposed

## Context

The existing demo mixes AI behavior into Next.js API routes. The v2 rebuild needs explicit backend boundaries for ingestion, retrieval, answer generation, evals, and API contracts.

## Decision

Use FastAPI as the v2 backend service for AI/search behavior.

## Consequences

- The frontend can stay focused on user experience.
- FastAPI OpenAPI docs become part of the technical proof.
- Backend modules can be tested independently from the Next.js app.
