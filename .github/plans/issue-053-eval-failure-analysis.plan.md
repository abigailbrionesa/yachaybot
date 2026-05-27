# Issue 53 Plan: Eval v2 Failure Analysis Report

## Goal

Add a provider-free Eval v2 failure analysis command that turns metrics into concrete reviewable failure cases.

## Scope

- Add a failure analysis helper that classifies retrieval, refusal, citation, and low-precision cases.
- Add `npm run eval:analyze`.
- Add tests for analysis shape and failure type coverage.

## Validation

- `npm run eval:analyze`
- `npm test`
- `npm run validate`
- FastAPI `pytest`
- `git diff --check`
