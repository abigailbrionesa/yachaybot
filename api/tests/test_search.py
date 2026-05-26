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


def test_search_rejects_invalid_request() -> None:
    response = client.post("/v1/search", json={"query": "", "limit": 5})

    assert response.status_code == 422


def test_search_limits_results() -> None:
    response = client.post("/v1/search", json={"query": "educacion patrimonio fuentes", "limit": 2})
    payload = response.json()

    assert response.status_code == 200
    assert len(payload["results"]) <= 2
