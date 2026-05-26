# Issue 47 Plan: README Review Path And Validation Index

## Goal

Make the README the fastest entry point for technical review of the current YachayBot system.

## Scope

- Add a `How to Review This Repo` section near the top of the README.
- Link to system proof, demo evidence, architecture, backend migration, methodology, limitations, evals, and API docs.
- Include exact validation commands for Next.js, FastAPI, and demo evidence checks.
- Preserve the existing product narrative and avoid new feature claims.

## Implementation Steps

1. Add the review section after the opening project description.
2. Add a compact validation index with commands.
3. Cross-link the new reviewer docs and existing technical docs.
4. Run full validation.

## Validation

- `npm run evidence:demo`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
