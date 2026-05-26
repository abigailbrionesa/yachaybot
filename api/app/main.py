from fastapi import FastAPI, HTTPException

from .evals import EvalRun, get_eval_run, list_eval_runs
from .retrieval_compare import RetrievalCompareRequest, RetrievalCompareResponse, compare_retrieval
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


@app.get("/v1/evals/runs", response_model=list[EvalRun])
def eval_runs_endpoint() -> list[EvalRun]:
    return list_eval_runs()


@app.get("/v1/evals/runs/{run_id}", response_model=EvalRun)
def eval_run_endpoint(run_id: str) -> EvalRun:
    run = get_eval_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail={"code": "NOT_FOUND", "message": "Eval run not found"})
    return run


@app.post("/v1/retrieval/compare", response_model=RetrievalCompareResponse)
def retrieval_compare_endpoint(payload: RetrievalCompareRequest) -> RetrievalCompareResponse:
    return compare_retrieval(payload)
