# Issue #42 Plan: Wire Next.js Search API To FastAPI Behind Adapter

## Decisions

- Keep the public `/api/v1/search` response shape unchanged.
- Keep local deterministic retrieval as the default behavior.
- Use FastAPI only when `YACHAYBOT_SEARCH_SERVICE_URL` is configured.
- Fall back to local deterministic retrieval when the service is unavailable or returns an invalid payload.
- Do not change the public UI.
- Do not introduce pgvector in this slice.

## Implementation

1. Add a Next.js search adapter module.
2. Move the existing local response construction into the adapter.
3. Add remote FastAPI call support with response validation and fallback.
4. Update the API route to call the adapter.
5. Add route tests for service success and fallback.
6. Update environment and API docs.

## Validation

- `npm run validate`
- FastAPI tests
- Public smoke test

