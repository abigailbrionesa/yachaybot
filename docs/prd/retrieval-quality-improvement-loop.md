# PRD: Retrieval Quality Improvement Loop

## Summary

Improve YachayBot's deterministic retrieval baseline before adding embeddings. The project now has Eval v2, which exposes measurable weaknesses in ranking precision, refusal handling, and citation coverage. This PRD turns those findings into a focused improvement loop.

## Problem

Eval v2 shows that the system is inspectable but not yet strong enough to treat embeddings as a meaningful comparison target. The deterministic retriever usually finds relevant sources by top 3, but top-1 ranking, precision@3, refusal behavior, and citation coverage need improvement.

Current live baseline from the local Eval v2 run:

- top-1 hit rate: 0.72
- top-3 hit rate: 0.92
- top-5 hit rate: 0.92
- mean reciprocal rank: 0.81
- precision@3: 0.46
- recall@5: 0.79
- refusal pass rate: 0.82
- citation coverage: 0.78
- p95 latency: 2 ms

These metrics should be treated as local benchmark evidence, not production accuracy claims.

## Goals

- Add failure analysis so metric changes are tied to concrete failed cases.
- Improve deterministic ranking with field weighting before vector retrieval.
- Add bilingual query normalization and synonym expansion for common corpus terms.
- Harden refusal and citation behavior for Eval v2 cases.
- Document before/after metric deltas and remaining known weaknesses.
- Preserve provider-free local validation.

## Non-Goals

- Add embedding generation in this PRD.
- Replace the deterministic baseline with pgvector.
- Claim production RAG accuracy.
- Expand the corpus broadly.
- Redesign the product UI.

## Requirements

### Failure Analysis

Add a command that reports failed or weak eval cases:

- failed top-1 retrieval
- failed top-3/top-5 retrieval
- refusal false positives
- refusal false negatives
- citation failures
- low precision@3 cases

The report should include question ID, category, expected/acceptable source IDs, retrieved source IDs, and a short failure type.

### Deterministic Ranking

Improve the deterministic retriever without adding provider dependencies:

- weight title matches higher than summary/body matches
- weight topic tag matches higher than generic content matches
- include institution and region as lower-weight signals
- preserve explainable numeric scores
- keep FastAPI and Next.js deterministic retrieval aligned

### Query Normalization

Add provider-free normalization for common bilingual and noisy query terms:

- English/Spanish corpus synonyms
- common domain equivalents such as `teacher -> docentes`, `heritage -> patrimonio`, `water -> agua`
- typo-tolerant aliases for known benchmark terms
- no broad semantic claims beyond the local dictionary

### Refusal And Citation Behavior

Improve answer/refusal behavior:

- identify unsupported intents such as legal advice, medical advice, future prediction, private/community-secret requests, full translation, and certification claims
- avoid refusing source-bound answerable citation cases when moderate evidence exists
- ensure answerable moderate evidence can still produce citations when grounded

### Metric Delta Documentation

Document before/after Eval v2 metrics:

- baseline metrics before this PRD
- improved metrics after implementation
- known remaining failure categories
- next planned step: embedding/vector/hybrid comparison against Eval v2

## Acceptance Criteria

- A failure-analysis command exists and runs without provider credentials.
- Deterministic ranking uses field weighting and remains explainable.
- Query normalization improves common bilingual/noisy benchmark cases.
- Refusal and citation behavior are covered by tests.
- Eval v2 metrics are documented before and after the improvement loop.
- Existing validation passes:
  - `npm run eval:run`
  - `npm run eval:analyze`
  - `npm run validate`
  - FastAPI `pytest`
  - `git diff --check`

## Proposed Issue Breakdown

1. Add Eval v2 failure analysis report.
2. Improve deterministic ranking with field weighting.
3. Add bilingual synonym and query normalization map.
4. Harden refusal intent and citation behavior.
5. Document before/after Eval v2 metric deltas.

## Future Phase

After this PRD, add embeddings, pgvector retrieval, and hybrid retrieval as measured retrievers. Compare them against the improved deterministic baseline using the same Eval v2 benchmark.
