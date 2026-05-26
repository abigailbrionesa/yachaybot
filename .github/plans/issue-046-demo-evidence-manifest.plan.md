# Issue 46 Plan: Demo Evidence Manifest And Verification Script

## Goal

Make demo artifacts, routes, smoke checks, and review points discoverable and mechanically verifiable.

## Scope

- Add a demo evidence manifest in `docs/`.
- List required demo assets and their review purpose.
- Connect demo routes to existing smoke checks.
- Add a script that verifies required assets and documentation references.
- Add an npm script for the verification check.

## Implementation Steps

1. Add `docs/demo-evidence.md`.
2. Add `scripts/verify-demo-evidence.mjs`.
3. Add `npm run evidence:demo`.
4. Validate the script and existing app checks.

## Validation

- `npm run evidence:demo`
- `npm run validate`
- `C:\Users\abiga\AppData\Local\Programs\Python\Python313\python.exe -m pytest` from `api`
- `git diff --check`
