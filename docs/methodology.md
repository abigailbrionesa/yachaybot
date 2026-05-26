# Methodology

YachayBot v2 is intentionally evidence-first. The MVP slice uses deterministic local data so the product behavior can be inspected without secrets, hosted databases, or model-provider access.

## Corpus Selection

The MVP corpus favors:

- public or official sources
- institutional pages with stable ownership
- clear language, topic, region, and rights metadata
- curated notes only when they explain project methodology

Curated notes are always labeled `curated` and are not treated as primary sources.

## Chunking

The local MVP creates one inspectable chunk per source record. Production ingestion should split long documents into overlapping chunks, store character/token counts, and preserve the original document relationship.

## Retrieval

The local MVP uses deterministic token overlap scoring. This keeps the demo reproducible and testable. Production retrieval should replace this with query embeddings and pgvector similarity search using the schema in `migrations/001_v2_core.sql`.

## Evidence Strength

Evidence strength is intentionally simple:

- `strong`: best score is at least `0.50` and at least three chunks are usable
- `moderate`: best score is at least `0.25` and at least one chunk is usable
- `weak`: anything below those thresholds

Weak evidence triggers refusal behavior rather than a confident answer.

## Evaluation

The deterministic eval run includes factual questions with expected source IDs, acceptable source sets, paraphrases, typo/noisy queries, mixed-language prompts, source-confusion cases, hard negatives, unsupported requests, ambiguous prompts, multilingual boundary checks, off-topic prompts, and citation behavior checks.

Eval layers:

- Regression evals protect the current deterministic MVP behavior.
- Retrieval-quality benchmark evals make harder retrieval, refusal, citation, and latency behavior inspectable.
- Future retriever comparison evals should reuse the benchmark to compare deterministic, vector, and hybrid retrieval.

Metrics are:

- top-1 hit rate
- top-3 hit rate
- top-5 hit rate
- mean reciprocal rank
- precision@3
- recall@5
- refusal pass rate
- refusal false positive rate
- refusal false negative rate
- citation pass rate
- citation coverage
- average latency
- latency p50
- latency p95

These metrics verify the local corpus, deterministic retrieval baseline, refusal behavior, and citation behavior. They do not claim broad production accuracy, cultural authority, or community validation.

Generate a local artifact with `npm run eval:run`. Generated JSON artifacts are written to `evals/runs/` and ignored by git unless intentionally promoted as documentation evidence.

## Browser QA

The current MVP has been smoke-tested with Playwright against the local Next.js app. The smoke path covers search, sources, chat, evals, the paused dashboard, auth/eval API contracts, and mobile navigation. This is not a full accessibility audit, but it does verify the main public demo flows in a real browser.

The repository also includes `npm run smoke:public` for lightweight checks against a running app. Set `SMOKE_BASE_URL` to target a non-default host.
