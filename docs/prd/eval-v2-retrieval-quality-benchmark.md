# PRD: Eval v2 And Retrieval Quality Benchmark

## Summary

Create a stronger evaluation layer for YachayBot before adding embedding-based retrieval. The goal is to turn the current local eval fixture into a more credible retrieval-quality benchmark that can measure deterministic retrieval today and compare vector or hybrid retrieval in later phases.

## Problem

YachayBot currently has a useful 15-question eval set that verifies the deterministic MVP behavior. It checks expected retrieval, refusal behavior, multilingual boundaries, off-topic handling, citation presence, and latency. This is enough for regression coverage, but it is not yet strong enough to support serious claims about retrieval quality or to evaluate whether embeddings improve the system.

Before adding embedding retrieval, the project needs a better benchmark with harder questions, richer metrics, inspectable run artifacts, and clearer methodology.

## Goals

- Expand the eval set from a small regression fixture into a stronger benchmark.
- Add harder query types: paraphrases, typos, mixed-language prompts, ambiguous prompts, hard negatives, source-confusion cases, and citation-support cases.
- Add retrieval and refusal metrics beyond top-3 and top-5 hit rate.
- Save eval run artifacts for review and future retriever comparison.
- Document what the evals prove, what they do not prove, and how they should guide embedding work.
- Preserve the deterministic retriever as the baseline.

## Non-Goals

- Add embedding generation in this PRD.
- Connect pgvector to production data in this PRD.
- Claim production accuracy from the local benchmark.
- Replace the existing search UI or public API behavior.
- Expand the corpus beyond what is needed for evaluation clarity.

## Audience

- Engineers reviewing retrieval quality and AI-system rigor.
- Maintainers comparing future deterministic, vector, and hybrid retrievers.
- Technical reviewers looking for evidence that the system is measured, not only implemented.

## Current Baseline

- Shared corpus: 20 source records.
- Current eval fixture: 15 questions.
- Current metrics: top-3 hit rate, top-5 hit rate, refusal pass rate, citation pass rate, average latency.
- Current validation: Next.js tests, FastAPI tests, demo evidence verification, and CI.

## Requirements

### 1. Eval Fixture Expansion

Expand `data/evals.json` to approximately 50 eval questions.

Required categories:

- factual retrieval
- paraphrase retrieval
- typo/noisy retrieval
- mixed-language retrieval
- ambiguous prompts
- hard negatives
- source-confusion cases
- unsupported requests
- multilingual-boundary requests
- citation-support cases

Each eval item should support:

- stable ID
- question
- language
- category
- expected document ID when applicable
- acceptable document IDs when more than one source is valid
- refusal expectation
- short rationale for why the case exists

### 2. Richer Retrieval Metrics

Add metrics that make retrieval quality easier to inspect:

- top-1 hit rate
- top-3 hit rate
- top-5 hit rate
- mean reciprocal rank
- precision@3
- recall@5 for cases with acceptable source sets
- refusal false positive rate
- refusal false negative rate
- citation coverage
- latency p50
- latency p95

Metrics should remain deterministic and runnable without provider credentials.

### 3. Eval Runner Artifacts

Add a repeatable eval runner that writes inspectable JSON artifacts under `evals/runs/`.

Each artifact should include:

- run ID
- created timestamp
- retriever name
- corpus version or source count
- metric summary
- per-question results
- retrieved document IDs
- refusal result
- citation result
- latency

### 4. Documentation

Update eval documentation to distinguish:

- regression evals
- retrieval-quality benchmark evals
- future retriever comparison evals

The docs should clearly state that the benchmark validates local retrieval behavior and does not claim broad production accuracy.

### 5. Validation

The new eval layer must run inside the existing validation workflow or through a documented command.

Required checks:

- existing Next.js validation passes
- existing FastAPI tests pass
- eval runner writes a valid artifact
- generated artifact is documented or ignored intentionally
- no provider credentials are required

## Acceptance Criteria

- `data/evals.json` contains approximately 50 eval questions with richer metadata.
- Retrieval metrics include top-1, top-3, top-5, MRR, precision@3, recall@5, refusal false positive/negative rates, citation coverage, p50 latency, and p95 latency.
- A command can generate an eval artifact under `evals/runs/`.
- Eval docs explain the benchmark scope, limitations, and future use for embeddings/vector retrieval.
- Existing validation still passes without provider credentials.
- GitHub issues are created from this PRD and can be implemented incrementally.

## Proposed Issue Breakdown

1. Expand eval fixture with harder benchmark cases.
2. Add richer retrieval and refusal metrics.
3. Add eval runner artifact generation.
4. Document Eval v2 methodology and limitations.
5. Add validation coverage for Eval v2 benchmark outputs.

## Future Phase: Embeddings

After Eval v2 is in place, add embedding generation, pgvector retrieval, and hybrid retrieval as measured retrievers. Future comparison should use the Eval v2 benchmark to report deterministic versus vector versus hybrid retrieval results.
