# Issue 52 Plan: Eval v2 Validation Coverage

## Goal

Protect Eval v2 fixture shape, metric output, and artifact shape with automated validation coverage.

## Scope

- Add tests for fixture size, IDs, categories, rationales, and referenced source IDs.
- Add tests for richer metric presence and numeric sanity.
- Add a shared artifact builder and tests for artifact output shape.
- Keep validation provider-free.

## Validation

- `npm run eval:run`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
