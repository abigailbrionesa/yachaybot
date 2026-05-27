from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_search_returns_expected_eib_source() -> None:
    response = client.post("/v1/search", json={"query": "Que recursos explican educacion intercultural bilingue?", "limit": 5})
    payload = response.json()

    assert response.status_code == 200
    assert payload["language"] == "es"
    assert payload["results"][0]["documentId"] == "doc-minedu-eib-001"
    assert payload["retrievedChunkIds"][0] == "chunk-doc-minedu-eib-001"
    assert payload["answer"]["refused"] is False
    assert payload["answer"]["citations"][0]["chunkId"] == "chunk-doc-minedu-eib-001"


def test_search_refuses_weak_evidence() -> None:
    response = client.post("/v1/search", json={"query": "zzzzzzzz unrelated", "limit": 5})
    payload = response.json()

    assert response.status_code == 200
    assert payload["results"] == []
    assert payload["evidenceStrength"] == "weak"
    assert payload["answer"]["refused"] is True
    assert payload["answer"]["citations"] == []


def test_search_refuses_unsupported_intent_with_related_sources() -> None:
    response = client.post("/v1/search", json={"query": "Give legal advice about water rights conflicts in Peru", "limit": 5})
    payload = response.json()

    assert response.status_code == 200
    assert payload["results"][0]["documentId"] == "doc-ana-water-010"
    assert payload["answer"]["refused"] is True
    assert payload["answer"]["citations"] == []


def test_search_answers_grounded_citation_support_question() -> None:
    response = client.post(
        "/v1/search",
        json={"query": "What indexed source can support an answer about query quality metrics?", "limit": 5},
    )
    payload = response.json()

    assert response.status_code == 200
    assert payload["results"][0]["documentId"] == "note-eval-method-020"
    assert payload["answer"]["refused"] is False
    assert len(payload["answer"]["citations"]) > 0


def test_search_rejects_invalid_request() -> None:
    response = client.post("/v1/search", json={"query": "", "limit": 5})

    assert response.status_code == 422


def test_search_limits_results() -> None:
    response = client.post("/v1/search", json={"query": "educacion patrimonio fuentes", "limit": 2})
    payload = response.json()

    assert response.status_code == 200
    assert len(payload["results"]) <= 2


def test_eval_runs_returns_local_run() -> None:
    response = client.get("/v1/evals/runs")
    payload = response.json()

    assert response.status_code == 200
    assert payload[0]["id"] == "local-eval-run-001"
    assert "citationPassRate" in payload[0]["metrics"]
    assert len(payload[0]["results"]) >= 15


def test_eval_run_returns_known_run() -> None:
    response = client.get("/v1/evals/runs/local-eval-run-001")
    payload = response.json()

    assert response.status_code == 200
    assert payload["id"] == "local-eval-run-001"
    assert any(result["category"] == "multilingual-boundary" for result in payload["results"])


def test_eval_run_rejects_unknown_run() -> None:
    response = client.get("/v1/evals/runs/not-real")

    assert response.status_code == 404


def test_retrieval_compare_returns_baseline_without_pgvector_credentials(monkeypatch) -> None:
    monkeypatch.delenv("YACHAYBOT_PGVECTOR_ENABLED", raising=False)
    monkeypatch.delenv("YACHAYBOT_PGVECTOR_DATABASE_URL", raising=False)

    response = client.post(
        "/v1/retrieval/compare",
        json={"query": "educacion intercultural bilingue", "limit": 3},
    )
    payload = response.json()

    assert response.status_code == 200
    assert payload["mode"] == "experimental-comparison"
    assert payload["baseline"][0]["documentId"] == "doc-minedu-eib-001"
    assert payload["vector"]["status"] == "not_configured"
    assert payload["vector"]["enabled"] is False
    assert payload["vector"]["results"] == []
    assert "Deterministic retrieval remains the default baseline." in payload["notes"]


def test_retrieval_compare_requires_embedding_when_pgvector_enabled(monkeypatch) -> None:
    monkeypatch.setenv("YACHAYBOT_PGVECTOR_ENABLED", "true")
    monkeypatch.setenv("YACHAYBOT_PGVECTOR_DATABASE_URL", "postgresql://example.invalid/yachaybot")

    response = client.post(
        "/v1/retrieval/compare",
        json={"query": "patrimonio cultural", "limit": 2},
    )
    payload = response.json()

    assert response.status_code == 200
    assert len(payload["baseline"]) <= 2
    assert payload["vector"]["status"] == "missing_embedding"
    assert payload["vector"]["enabled"] is True


def test_retrieval_compare_rejects_empty_query() -> None:
    response = client.post("/v1/retrieval/compare", json={"query": "", "limit": 3})

    assert response.status_code == 422
