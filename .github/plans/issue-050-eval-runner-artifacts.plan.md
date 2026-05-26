# Issue 50 Plan: Eval Runner Artifact Generation

## Goal

Add a repeatable command that writes inspectable Eval v2 JSON artifacts under `evals/runs/`.

## Scope

- Add an eval runner script.
- Include run ID, timestamp, retriever name, corpus size, metrics, and per-question results.
- Ignore generated JSON artifacts while keeping the output directory in git.
- Document the command and artifact policy.

## Validation

- `npm run eval:run`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
