# Demo Evidence

This manifest lists the reviewable demo evidence available in the repository. It is not a production analytics report; it is a compact proof path for the current local MVP.

## Demo Routes

| Route | Review point | Covered by smoke check |
| --- | --- | --- |
| `/es` | Search-first product surface and source-grounded answer flow | Yes |
| `/es/sources` | Source browser, metadata visibility, and filtering surface | Yes |
| `/es/evals` | Retrieval, refusal, citation, and latency metrics | Yes |
| `/es/ai-bot` | Evidence-first chat wrapper over the same retrieval rules | Yes |
| `/es/sign-in` | Paused auth scope page | Yes |
| `/es/dashboard` | Paused educator workspace scope page | Yes |

## API Smoke Coverage

| Endpoint | Review point | Covered by smoke check |
| --- | --- | --- |
| `POST /api/v1/search` | Ranked source cards and answer preview | Yes |
| `POST /api/chat` | Evidence-first chat response shape | Yes |
| `POST /api/auth/login` | Paused auth returns `503 FEATURE_UNAVAILABLE` | Yes |
| `GET /api/v1/evals/runs/local-eval-run-001` | Local deterministic eval run is available | Yes |

The smoke check is implemented in `scripts/smoke-public.mjs` and runs against a live app with `npm run smoke:public`.

## Demo Artifacts

| Artifact | Purpose |
| --- | --- |
| `public/demo/search-home.svg` | Search-first homepage and query entry point. |
| `public/demo/source-cards.svg` | Retrieved source cards, metadata, and evidence presentation. |
| `public/demo/sources-filtering.svg` | Source browsing and filtering surface. |
| `public/demo/eval-dashboard.svg` | Eval metrics dashboard and reviewable run output. |

These assets are static demo artifacts for repository review. Current runtime behavior should still be validated with `npm run validate` and, when the app is running, `npm run smoke:public`.

## Verification

```powershell
npm run evidence:demo
```

The verification script checks that required demo assets and documentation references exist. It does not require provider credentials, a hosted database, or a running app.
