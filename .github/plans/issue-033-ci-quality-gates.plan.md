# Issue #33 Plan: Add CI Quality Gates

## Implementation

- Add a GitHub Actions workflow for pull requests and pushes to `main`.
- Use Node.js 20 and `npm ci`.
- Run the same validation script used locally.
- Avoid requiring optional provider or hosted database credentials.

## Validation

- Run the local validation script.
- Confirm the workflow references existing package scripts.

