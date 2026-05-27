# Issue 54 Plan: Field-Weighted Deterministic Ranking

## Goal

Improve deterministic retrieval precision by replacing flat token overlap with explainable field-weighted scoring.

## Scope

- Weight title and topic-tag matches highest.
- Weight institution and region lower.
- Keep summary/content matches as the baseline signal.
- Mirror behavior in Next.js and FastAPI.
- Preserve numeric scores and provider-free execution.

## Validation

- `npm run eval:analyze`
- `npm run validate`
- FastAPI `pytest`
- `git diff --check`
