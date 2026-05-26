# Issue 51 Plan: Eval v2 Methodology And Limitations Docs

## Goal

Document what Eval v2 proves, what it does not prove, and how it supports future deterministic/vector/hybrid comparison.

## Scope

- Distinguish regression evals from retrieval-quality benchmark evals.
- Define categories and metrics in plain technical language.
- Document artifact generation and generated-output policy.
- Clarify future embedding/vector retrieval work as a measured next phase.

## Validation

- `npm run evidence:demo`
- `npm run eval:run`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
