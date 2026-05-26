# YachayBot v2 Data

This directory owns source metadata and corpus files for the v2 rebuild.

`corpus.json` is the shared deterministic corpus used by the Next.js MVP helpers and the FastAPI sidecar search endpoint. Keeping this data outside either runtime makes the later ingestion and pgvector migration easier to verify.

`evals.json` is the shared deterministic evaluation set used by the Next.js eval helpers and the FastAPI sidecar eval endpoints.

Source records should include:

- title
- source URL
- source type
- language
- region
- institution
- topic tags
- rights note

Curated notes must be clearly labeled and must not be presented as primary sources.
