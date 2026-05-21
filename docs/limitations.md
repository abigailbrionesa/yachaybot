# Limitations

YachayBot v2 is an MVP rebuild, not a cultural authority.

Current limitations:

- The corpus is small and curated for demonstration.
- Local retrieval uses token overlap, not production vector search.
- Quechua and Aymara behavior is experimental and source-bound.
- Curated notes are methodology notes, not primary cultural sources.
- The app does not claim community validation.
- The app does not claim zero hallucinations.
- The app does not provide translation as a primary product.
- Query logging is represented in API responses; persistent storage is documented in migrations but not yet connected to Supabase.
- Sign-in flows are paused for the v2 MVP.
- `/ai-bot` and `/api/chat` are evidence-first wrappers around the same local retrieval baseline, source cards, citations, and refusal behavior.
- Pinecone credentials are reserved for the later vector-search migration and are not required for the current deterministic MVP.

Future work:

- connect FastAPI to Supabase Postgres with pgvector
- add real ingestion from public documents
- add provider-backed embeddings
- add mocked unit tests for retrieval, answer, and eval helpers
- add screenshots and GIFs from a deployed or locally running demo
- connect chat to the future vector retrieval path once pgvector or Pinecone-backed retrieval is ready
