# Issue 56 Plan: Refusal Intent and Citation Behavior

## Objective

Reduce false confidence on unsupported requests while preserving answers for source-grounded citation and metadata questions.

## Scope

- Add explicit unsupported-intent detection for legal, medical, prediction, private, full-translation, generated-audio, and certification requests.
- Keep small indexed-source metadata requests answerable when retrieval evidence exists.
- Lower the moderate-evidence answer threshold enough for grounded citation-support questions.
- Mirror refusal and citation behavior in TypeScript and FastAPI.
- Add focused TypeScript and FastAPI tests.

## Validation

- `npm run eval:analyze`
- `npm test`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest`
- `git diff --check`
