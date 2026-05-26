from fastapi import FastAPI

from .search import SearchRequest, SearchResponse, search


app = FastAPI(
    title="YachayBot v2 API",
    version="0.1.0",
    description="Source-grounded search and evaluation service for YachayBot v2.",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "yachaybot-v2-api"}


@app.post("/v1/search", response_model=SearchResponse)
def search_endpoint(payload: SearchRequest) -> SearchResponse:
    return search(payload)
