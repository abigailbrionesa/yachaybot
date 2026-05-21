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

Future work:

- connect FastAPI to Supabase Postgres with pgvector
- add real ingestion from public documents
- add provider-backed embeddings
- add mocked unit tests for retrieval, answer, and eval helpers
- add screenshots and GIFs from a deployed or locally running demo
