-- YachayBot v2 core schema draft for Supabase Postgres + pgvector.
-- The current MVP uses deterministic local data; this migration documents the
-- intended production schema for the FastAPI service.

create extension if not exists vector;

create table if not exists documents (
  id text primary key,
  title text not null,
  source_url text not null,
  source_type text not null check (source_type in ('official', 'public', 'curated')),
  language text not null,
  region text not null,
  institution text not null,
  topic_tags text[] not null default '{}',
  rights_note text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists chunks (
  id text primary key,
  document_id text not null references documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  topic_tags text[] not null default '{}',
  char_count integer not null,
  embedding vector(1536),
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

create table if not exists queries (
  id bigserial primary key,
  query_text text not null,
  language text not null,
  latency_ms integer not null,
  retrieved_chunk_ids text[] not null default '{}',
  evidence_strength text not null check (evidence_strength in ('strong', 'moderate', 'weak')),
  created_at timestamptz not null default now()
);

create table if not exists answer_citations (
  id bigserial primary key,
  query_id bigint references queries(id) on delete cascade,
  chunk_id text references chunks(id),
  document_id text references documents(id),
  marker text not null
);

create table if not exists eval_questions (
  id text primary key,
  question text not null,
  language text not null,
  expected_document_id text references documents(id),
  should_refuse boolean not null default false
);

create table if not exists eval_runs (
  id text primary key,
  top3_hit_rate numeric not null,
  top5_hit_rate numeric not null,
  refusal_pass_rate numeric not null,
  average_latency_ms integer not null,
  created_at timestamptz not null default now()
);

create table if not exists eval_results (
  id bigserial primary key,
  run_id text not null references eval_runs(id) on delete cascade,
  question_id text not null references eval_questions(id),
  retrieved_document_ids text[] not null default '{}',
  top3_hit boolean not null,
  top5_hit boolean not null,
  refusal_passed boolean not null,
  latency_ms integer not null
);

create index if not exists documents_language_idx on documents(language);
create index if not exists documents_source_type_idx on documents(source_type);
create index if not exists chunks_document_id_idx on chunks(document_id);
create index if not exists chunks_embedding_idx on chunks using ivfflat (embedding vector_cosine_ops);
