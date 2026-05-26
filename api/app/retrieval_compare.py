from __future__ import annotations

import os
import time
from typing import Literal

from pydantic import BaseModel, Field

from .search import SearchResult, search_corpus

VectorStatus = Literal["not_configured", "missing_embedding", "unavailable", "ready"]


class RetrievalCompareRequest(BaseModel):
    query: str = Field(min_length=1)
    limit: int = Field(default=5, ge=1, le=20)
    queryEmbedding: list[float] | None = Field(default=None, min_length=1)


class VectorRetrievalReport(BaseModel):
    status: VectorStatus
    enabled: bool
    latencyMs: int
    results: list[SearchResult]
    message: str


class RetrievalCompareResponse(BaseModel):
    query: str
    mode: Literal["experimental-comparison"]
    baseline: list[SearchResult]
    vector: VectorRetrievalReport
    notes: list[str]


def compare_retrieval(payload: RetrievalCompareRequest) -> RetrievalCompareResponse:
    baseline = search_corpus(payload.query, payload.limit)
    vector = run_pgvector_retrieval(payload)

    return RetrievalCompareResponse(
        query=payload.query,
        mode="experimental-comparison",
        baseline=baseline,
        vector=vector,
        notes=[
            "Deterministic retrieval remains the default baseline.",
            "pgvector retrieval is experimental and only runs when explicitly configured.",
        ],
    )


def run_pgvector_retrieval(payload: RetrievalCompareRequest) -> VectorRetrievalReport:
    database_url = os.getenv("YACHAYBOT_PGVECTOR_DATABASE_URL", "").strip()
    enabled = os.getenv("YACHAYBOT_PGVECTOR_ENABLED", "").strip().lower() in {"1", "true", "yes"}

    if not enabled or not database_url:
        return VectorRetrievalReport(
            status="not_configured",
            enabled=False,
            latencyMs=0,
            results=[],
            message="Set YACHAYBOT_PGVECTOR_ENABLED=true and YACHAYBOT_PGVECTOR_DATABASE_URL to run pgvector retrieval.",
        )

    if not payload.queryEmbedding:
        return VectorRetrievalReport(
            status="missing_embedding",
            enabled=True,
            latencyMs=0,
            results=[],
            message="Provide queryEmbedding to compare pgvector retrieval against the deterministic baseline.",
        )

    started_at = time.perf_counter()

    try:
        import psycopg
    except ImportError:
        return VectorRetrievalReport(
            status="unavailable",
            enabled=True,
            latencyMs=round((time.perf_counter() - started_at) * 1000),
            results=[],
            message="The psycopg package is required for the experimental pgvector path.",
        )

    try:
        vector_literal = "[" + ",".join(str(value) for value in payload.queryEmbedding) + "]"
        with psycopg.connect(database_url, connect_timeout=5) as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    select
                      c.id as chunk_id,
                      c.document_id,
                      1 - (c.embedding <=> %s::vector) as score,
                      c.content,
                      d.title,
                      d.language,
                      d.topic_tags,
                      d.region,
                      d.institution,
                      d.source_url,
                      d.source_type,
                      d.rights_note
                    from chunks c
                    join documents d on d.id = c.document_id
                    where c.embedding is not null
                    order by c.embedding <=> %s::vector
                    limit %s
                    """,
                    (vector_literal, vector_literal, payload.limit),
                )
                rows = cursor.fetchall()
    except Exception as error:
        return VectorRetrievalReport(
            status="unavailable",
            enabled=True,
            latencyMs=round((time.perf_counter() - started_at) * 1000),
            results=[],
            message=f"pgvector retrieval could not run: {type(error).__name__}",
        )

    return VectorRetrievalReport(
        status="ready",
        enabled=True,
        latencyMs=round((time.perf_counter() - started_at) * 1000),
        results=[
            SearchResult(
                chunkId=row[0],
                documentId=row[1],
                score=round(float(row[2]), 3),
                snippet=row[3],
                title=row[4],
                language=row[5],
                topicTags=list(row[6]),
                region=row[7],
                institution=row[8],
                sourceUrl=row[9],
                sourceType=row[10],
                rightsNote=row[11],
            )
            for row in rows
        ],
        message="pgvector retrieval completed.",
    )
