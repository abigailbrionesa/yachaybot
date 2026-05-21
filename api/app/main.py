from fastapi import FastAPI


app = FastAPI(
    title="YachayBot v2 API",
    version="0.1.0",
    description="Source-grounded search and evaluation service for YachayBot v2.",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "yachaybot-v2-api"}
