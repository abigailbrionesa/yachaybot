# Issue 48 Plan: Eval v2 Fixture Expansion

## Goal

Expand the eval fixture from a small regression set into a broader retrieval-quality benchmark fixture.

## Scope

- Grow `data/evals.json` to 50 questions.
- Add harder categories: paraphrase, typo/noisy, mixed-language, source-confusion, hard-negative, ambiguous, unsupported, multilingual-boundary, and citation-support.
- Add optional `acceptableDocumentIds` and `rationale` metadata.
- Update TypeScript and FastAPI eval types so the expanded fixture remains compatible.

## Validation

- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
