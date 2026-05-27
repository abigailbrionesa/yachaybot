# Issue 55 Plan: Bilingual Synonym and Query Normalization Map

## Objective

Improve deterministic retrieval for bilingual, domain-specific, and typo/noisy queries by adding a local explicit query-normalization map.

## Scope

- Add provider-free query token expansion for common English/Spanish corpus concepts.
- Cover domain aliases for heritage, EIB, water, protected areas, environmental education, libraries, metrics, languages, and source terminology.
- Keep expansion deterministic and local to the retrieval layer.
- Mirror behavior in the TypeScript and FastAPI search paths.
- Add focused tests for bilingual paraphrase and noisy query coverage.

## Validation

- `npm run eval:analyze`
- `npm test`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest`
- `git diff --check`
