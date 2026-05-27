# Eval v2 Metric Deltas

This document records the local Eval v2 movement from the retrieval-quality improvement loop. The numbers are local benchmark evidence over `data/evals.json`, not production accuracy claims.

## Scope

- Benchmark: Eval v2, 50 questions.
- Corpus: 20 records: 15 public or official source records and 5 curated methodology notes.
- Retriever: deterministic local baseline with field weighting, query aliases, refusal intent rules, and citation checks.
- Final validation date: 2026-05-27.

## Implementation Slices

| Slice | Change | Evidence |
| --- | --- | --- |
| Failure analysis | Added `npm run eval:analyze` failure buckets for top-k misses, low precision, refusal, and citation failures. | Issue #53, commit `a07b4da` |
| Field-weighted ranking | Weighted title/topic/institution/content/region matches while preserving deterministic scoring. | Issue #54, commit `10c1554` |
| Query normalization | Added local bilingual and typo/noisy aliases in TypeScript and FastAPI retrieval paths. | Issue #55, commit `09a5acd` |
| Refusal and citation hardening | Added explicit unsupported-intent refusal rules and allowed grounded moderate-evidence citation answers. | Issue #56, commit `0c932fe` |

## Metric Delta

| Metric | Baseline before loop | Final local run | Delta |
| --- | ---: | ---: | ---: |
| Top-1 hit rate | 0.72 | 0.86 | +0.14 |
| Top-3 hit rate | 0.92 | 1.00 | +0.08 |
| Top-5 hit rate | 0.92 | 1.00 | +0.08 |
| Mean reciprocal rank | 0.81 | 0.92 | +0.11 |
| Precision@3 | 0.46 | 0.52 | +0.06 |
| Recall@5 | 0.79 | 0.92 | +0.13 |
| Refusal pass rate | 0.82 | 1.00 | +0.18 |
| Citation coverage | 0.78 | 1.00 | +0.22 |
| p95 latency | 2 ms | 13 ms | +11 ms |

Final run detail from `npm run eval:analyze`:

| Metric | Value |
| --- | ---: |
| Refusal false positive rate | 0.00 |
| Refusal false negative rate | 0.00 |
| Citation pass rate | 1.00 |
| Average latency | 3 ms |
| p50 latency | 2 ms |

Latency is local in-process benchmark timing and varies by machine/run. It should be treated as a regression signal, not hosted production latency.

## Remaining Weaknesses

- Top-1 ranking still misses 5 of 50 cases.
- Precision@3 remains modest at 0.52 because deterministic token expansion can retrieve adjacent but non-acceptable sources in the top 3.
- Some source-confusion and broad ambiguous prompts still need better ordering, especially when multiple source records share education, culture, or source-grounding terms.
- The benchmark is intentionally small and curated. It validates local behavior, not broad cultural authority or real-world answer accuracy.

## Next Measured Phase

Embeddings should be added as a comparison path, not as an unmeasured replacement:

1. Add an embedding pipeline for the same corpus records and chunks.
2. Store vectors in pgvector using the existing schema direction.
3. Compare deterministic, vector, and hybrid retrieval against the same 50-question Eval v2 fixture.
4. Promote a new default only if it improves top-1/top-3 quality without weakening refusal, citation, latency, or inspectability.

The current deterministic baseline is now strong enough to make that comparison meaningful.
