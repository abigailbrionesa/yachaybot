from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from pydantic import BaseModel

from .search import SearchRequest, search

EvalCategory = Literal[
    "retrieval",
    "paraphrase",
    "typo-noisy",
    "mixed-language",
    "source-confusion",
    "hard-negative",
    "unsupported",
    "ambiguous",
    "multilingual-boundary",
    "off-topic",
    "citation",
]
LanguageCode = Literal["es", "en", "qu", "ay"]


class EvalQuestion(BaseModel):
    id: str
    question: str
    language: LanguageCode
    category: EvalCategory
    expectedDocumentId: str | None = None
    acceptableDocumentIds: list[str] | None = None
    shouldRefuse: bool
    rationale: str | None = None


class EvalResult(BaseModel):
    questionId: str
    question: str
    language: LanguageCode
    expectedDocumentId: str | None = None
    retrievedDocumentIds: list[str]
    category: EvalCategory
    top3Hit: bool
    top5Hit: bool
    answerRefused: bool
    refusalPassed: bool
    citationMarkers: list[str]
    citationPassed: bool
    latencyMs: int


class EvalMetrics(BaseModel):
    top3HitRate: float
    top5HitRate: float
    refusalPassRate: float
    citationPassRate: float
    averageLatencyMs: int


class EvalRun(BaseModel):
    id: str
    createdAt: str
    metrics: EvalMetrics
    results: list[EvalResult]


def load_eval_questions() -> list[EvalQuestion]:
    evals_path = Path(__file__).resolve().parents[2] / "data" / "evals.json"
    payload = json.loads(evals_path.read_text(encoding="utf-8"))
    return [EvalQuestion.model_validate(item) for item in payload["questions"]]


EVAL_QUESTIONS = load_eval_questions()
LOCAL_EVAL_RUN_ID = "local-eval-run-001"


def list_eval_runs() -> list[EvalRun]:
    return [run_eval()]


def get_eval_run(run_id: str) -> EvalRun | None:
    if run_id != LOCAL_EVAL_RUN_ID:
        return None
    return run_eval()


def run_eval() -> EvalRun:
    results: list[EvalResult] = []

    for question in EVAL_QUESTIONS:
        response = search(SearchRequest(query=question.question, limit=5))
        retrieved_document_ids = [result.documentId for result in response.results]
        top3 = retrieved_document_ids[:3]
        top5 = retrieved_document_ids[:5]
        citation_markers = [citation.marker for citation in response.answer.citations]

        results.append(
            EvalResult(
                questionId=question.id,
                question=question.question,
                language=question.language,
                expectedDocumentId=question.expectedDocumentId,
                retrievedDocumentIds=retrieved_document_ids,
                category=question.category,
                top3Hit=question.expectedDocumentId in top3 if question.expectedDocumentId else False,
                top5Hit=question.expectedDocumentId in top5 if question.expectedDocumentId else False,
                answerRefused=response.answer.refused,
                refusalPassed=response.answer.refused if question.shouldRefuse else not response.answer.refused,
                citationMarkers=citation_markers,
                citationPassed=len(citation_markers) == 0 if question.shouldRefuse else len(citation_markers) > 0,
                latencyMs=response.latencyMs,
            )
        )

    factual = [result for result in results if result.expectedDocumentId]
    refusal_cases = [result for result in results if not result.expectedDocumentId]
    citation_cases = [result for result in results if result.category == "citation" or result.expectedDocumentId]
    average_latency = round(sum(result.latencyMs for result in results) / len(results))

    return EvalRun(
        id=LOCAL_EVAL_RUN_ID,
        createdAt="2026-05-21",
        metrics=EvalMetrics(
            top3HitRate=ratio(len([result for result in factual if result.top3Hit]), len(factual)),
            top5HitRate=ratio(len([result for result in factual if result.top5Hit]), len(factual)),
            refusalPassRate=ratio(len([result for result in refusal_cases if result.refusalPassed]), len(refusal_cases)),
            citationPassRate=ratio(len([result for result in citation_cases if result.citationPassed]), len(citation_cases)),
            averageLatencyMs=average_latency,
        ),
        results=results,
    )


def ratio(count: int, total: int) -> float:
    if total == 0:
        return 0
    return round(count / total, 2)
