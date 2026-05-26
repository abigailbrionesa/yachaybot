from __future__ import annotations

import json
import math
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
    acceptableDocumentIds: list[str]
    retrievedDocumentIds: list[str]
    category: EvalCategory
    top1Hit: bool
    top3Hit: bool
    top5Hit: bool
    reciprocalRank: float
    precisionAt3: float
    recallAt5: float
    answerRefused: bool
    refusalPassed: bool
    citationMarkers: list[str]
    citationPassed: bool
    latencyMs: int


class EvalMetrics(BaseModel):
    top1HitRate: float
    top3HitRate: float
    top5HitRate: float
    meanReciprocalRank: float
    precisionAt3: float
    recallAt5: float
    refusalPassRate: float
    refusalFalsePositiveRate: float
    refusalFalseNegativeRate: float
    citationPassRate: float
    citationCoverage: float
    averageLatencyMs: int
    p50LatencyMs: int
    p95LatencyMs: int


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
        acceptable_document_ids = get_acceptable_document_ids(question)
        top1 = retrieved_document_ids[:1]
        top3 = retrieved_document_ids[:3]
        top5 = retrieved_document_ids[:5]
        citation_markers = [citation.marker for citation in response.answer.citations]
        top3_matches = len([document_id for document_id in top3 if document_id in acceptable_document_ids])
        top5_matches = len([document_id for document_id in top5 if document_id in acceptable_document_ids])

        results.append(
            EvalResult(
                questionId=question.id,
                question=question.question,
                language=question.language,
                expectedDocumentId=question.expectedDocumentId,
                acceptableDocumentIds=acceptable_document_ids,
                retrievedDocumentIds=retrieved_document_ids,
                category=question.category,
                top1Hit=any(document_id in acceptable_document_ids for document_id in top1) if acceptable_document_ids else False,
                top3Hit=any(document_id in acceptable_document_ids for document_id in top3) if acceptable_document_ids else False,
                top5Hit=any(document_id in acceptable_document_ids for document_id in top5) if acceptable_document_ids else False,
                reciprocalRank=get_reciprocal_rank(retrieved_document_ids, acceptable_document_ids),
                precisionAt3=ratio(top3_matches, max(len(top3), 1)),
                recallAt5=ratio(top5_matches, len(acceptable_document_ids)),
                answerRefused=response.answer.refused,
                refusalPassed=response.answer.refused if question.shouldRefuse else not response.answer.refused,
                citationMarkers=citation_markers,
                citationPassed=len(citation_markers) == 0 if question.shouldRefuse else len(citation_markers) > 0,
                latencyMs=response.latencyMs,
            )
        )

    factual = [result for result in results if len(result.acceptableDocumentIds) > 0]
    should_answer_cases = [question for question in EVAL_QUESTIONS if not question.shouldRefuse]
    should_refuse_cases = [question for question in EVAL_QUESTIONS if question.shouldRefuse]
    citation_cases = [
        result
        for result in results
        if not next(question for question in EVAL_QUESTIONS if question.id == result.questionId).shouldRefuse
    ]
    average_latency = round(sum(result.latencyMs for result in results) / len(results))
    latencies = [result.latencyMs for result in results]

    return EvalRun(
        id=LOCAL_EVAL_RUN_ID,
        createdAt="2026-05-21",
        metrics=EvalMetrics(
            top1HitRate=ratio(len([result for result in factual if result.top1Hit]), len(factual)),
            top3HitRate=ratio(len([result for result in factual if result.top3Hit]), len(factual)),
            top5HitRate=ratio(len([result for result in factual if result.top5Hit]), len(factual)),
            meanReciprocalRank=ratio(sum(result.reciprocalRank for result in factual), len(factual)),
            precisionAt3=ratio(sum(result.precisionAt3 for result in factual), len(factual)),
            recallAt5=ratio(sum(result.recallAt5 for result in factual), len(factual)),
            refusalPassRate=ratio(len([result for result in results if result.refusalPassed]), len(results)),
            refusalFalsePositiveRate=ratio(
                len(
                    [
                        result
                        for result in results
                        if any(question.id == result.questionId for question in should_answer_cases) and result.answerRefused
                    ]
                ),
                len(should_answer_cases),
            ),
            refusalFalseNegativeRate=ratio(
                len(
                    [
                        result
                        for result in results
                        if any(question.id == result.questionId for question in should_refuse_cases) and not result.answerRefused
                    ]
                ),
                len(should_refuse_cases),
            ),
            citationPassRate=ratio(len([result for result in citation_cases if result.citationPassed]), len(citation_cases)),
            citationCoverage=ratio(len([result for result in citation_cases if len(result.citationMarkers) > 0]), len(citation_cases)),
            averageLatencyMs=average_latency,
            p50LatencyMs=percentile(latencies, 50),
            p95LatencyMs=percentile(latencies, 95),
        ),
        results=results,
    )


def ratio(count: float, total: int) -> float:
    if total == 0:
        return 0
    return round(count / total, 2)


def get_acceptable_document_ids(question: EvalQuestion) -> list[str]:
    if question.acceptableDocumentIds:
        return question.acceptableDocumentIds
    if question.expectedDocumentId:
        return [question.expectedDocumentId]
    return []


def get_reciprocal_rank(retrieved_document_ids: list[str], acceptable_document_ids: list[str]) -> float:
    for index, document_id in enumerate(retrieved_document_ids):
        if document_id in acceptable_document_ids:
            return round(1 / (index + 1), 3)
    return 0


def percentile(values: list[int], percentile_value: int) -> int:
    if len(values) == 0:
        return 0
    sorted_values = sorted(values)
    index = math.ceil((percentile_value / 100) * len(sorted_values)) - 1
    return sorted_values[max(0, min(index, len(sorted_values) - 1))]
