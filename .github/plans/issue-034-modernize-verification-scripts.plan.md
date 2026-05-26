# Issue #34 Plan: Modernize Verification Scripts

## Implementation

- Replace deprecated lint invocation with the ESLint CLI.
- Add explicit `typecheck` and `validate` scripts.
- Keep test and build commands intact.
- Document the canonical verification path.

## Validation

- Run lint, typecheck, tests, and production build through `npm run validate`.

