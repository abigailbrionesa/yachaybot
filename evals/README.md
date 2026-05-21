# YachayBot v2 Evals

This directory owns evaluation fixtures, question sets, and local outputs for retrieval and refusal checks.

MVP metrics:

- top-3 hit rate
- top-5 hit rate
- refusal pass rate
- average latency

Eval runs should be reproducible and should include failed cases for inspection.

The current local run ID is `local-eval-run-001`. Unknown run IDs should return `404` until persisted eval runs exist.
