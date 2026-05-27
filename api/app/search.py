from __future__ import annotations

import json
import re
import time
import unicodedata
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field

LanguageCode = Literal["es", "en", "qu", "ay"]
SourceType = Literal["official", "public", "curated"]
EvidenceStrength = Literal["strong", "moderate", "weak"]

STOP_WORDS = {
    "the",
    "and",
    "for",
    "with",
    "que",
    "para",
    "con",
    "los",
    "las",
    "una",
    "uno",
    "del",
    "de",
    "la",
    "el",
    "y",
    "en",
    "a",
    "is",
    "to",
    "about",
}
QUERY_ALIASES = {
    "agua": ["water", "hidricos", "cuencas"],
    "ambiente": ["environmental", "environment", "ambiental"],
    "ambiental": ["environmental", "ambiente"],
    "andean": ["andes", "andino", "qhapaq", "nan"],
    "areas": ["protected", "natural", "protegidas"],
    "bilingual": ["bilingue", "eib", "intercultural"],
    "biblioteca": ["library", "librarry", "colecciones", "digital"],
    "climate": ["clima", "climatica", "ambiente"],
    "classroom": ["docentes", "pedagogicos", "recursos"],
    "culture": ["cultura", "patrimonio"],
    "digital": ["colecciones", "biblioteca"],
    "environment": ["ambiente", "ambiental"],
    "environmental": ["ambiente", "ambiental", "educacion"],
    "eval": ["evaluacion", "metricas", "quality"],
    "evidence": ["evidencia"],
    "fuente": ["source", "fuentes"],
    "heritage": ["patrimonio", "cultura"],
    "indigenous": ["lenguas", "languages", "eib"],
    "intercultural": ["eib", "bilingue"],
    "intangible": ["inmaterial", "patrimonio"],
    "language": ["lenguas", "languages"],
    "languages": ["lenguas", "language"],
    "learning": ["educacion", "aprendizaje"],
    "library": ["biblioteca", "librarry", "colecciones"],
    "librarry": ["library", "biblioteca", "colecciones"],
    "media": ["imagenes", "culture"],
    "metric": ["metricas", "eval", "evaluacion"],
    "metrics": ["metricas", "eval", "evaluacion"],
    "natural": ["areas", "protegidas", "sernanp"],
    "pedagogical": ["pedagogicos", "docentes", "recursos"],
    "protected": ["protegidas", "areas", "sernanp"],
    "quality": ["calidad", "metricas", "eval"],
    "resorces": ["resources", "recursos"],
    "resources": ["recursos"],
    "routes": ["qhapaq", "nan", "andino"],
    "source": ["fuente", "fuentes"],
    "teacher": ["docentes", "pedagogicos", "recursos"],
    "teachers": ["docentes", "pedagogicos", "recursos"],
    "water": ["agua", "hidricos", "cuencas"],
}
FIELD_WEIGHTS = {
    "title": 3,
    "topicTags": 2.5,
    "institution": 1.5,
    "content": 1,
    "region": 0.5,
}
MAX_FIELD_WEIGHT = max(FIELD_WEIGHTS.values())


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    limit: int = Field(default=5, ge=1, le=20)


class Document(BaseModel):
    id: str
    title: str
    sourceUrl: str
    sourceType: SourceType
    language: LanguageCode
    region: str
    institution: str
    topicTags: list[str]
    rightsNote: str
    summary: str


class Chunk(BaseModel):
    id: str
    documentId: str
    chunkIndex: int
    content: str
    topicTags: list[str]
    charCount: int


class SearchResult(BaseModel):
    chunkId: str
    documentId: str
    score: float
    snippet: str
    title: str
    language: LanguageCode
    topicTags: list[str]
    region: str
    institution: str
    sourceUrl: str
    sourceType: SourceType
    rightsNote: str


class AnswerCitation(BaseModel):
    marker: str
    chunkId: str
    documentId: str
    title: str


class AnswerResult(BaseModel):
    answer: str
    language: LanguageCode
    citations: list[AnswerCitation]
    evidenceStrength: EvidenceStrength
    refused: bool


class SearchResponse(BaseModel):
    query: str
    language: LanguageCode
    latencyMs: int
    retrievedChunkIds: list[str]
    evidenceStrength: EvidenceStrength
    results: list[SearchResult]
    answer: AnswerResult


def load_documents() -> list[Document]:
    corpus_path = Path(__file__).resolve().parents[2] / "data" / "corpus.json"
    payload = json.loads(corpus_path.read_text(encoding="utf-8"))
    return [Document.model_validate(item) for item in payload["documents"]]


DOCUMENTS = load_documents()
CHUNKS = [
    Chunk(
        id=f"chunk-{document.id}",
        documentId=document.id,
        chunkIndex=0,
        content=f"{document.summary} Topics: {', '.join(document.topicTags)}. Institution: {document.institution}. Region: {document.region}.",
        topicTags=document.topicTags,
        charCount=len(f"{document.summary} {' '.join(document.topicTags)}"),
    )
    for document in DOCUMENTS
]


def search(payload: SearchRequest) -> SearchResponse:
    started_at = time.perf_counter()
    language = detect_language(payload.query)
    results = search_corpus(payload.query, payload.limit)
    answer = build_answer(payload.query, results)
    latency_ms = round((time.perf_counter() - started_at) * 1000)

    return SearchResponse(
        query=payload.query,
        language=language,
        latencyMs=latency_ms,
        retrievedChunkIds=[result.chunkId for result in results],
        evidenceStrength=classify_evidence(results),
        results=results,
        answer=answer,
    )


def search_corpus(query: str, limit: int = 5) -> list[SearchResult]:
    query_tokens = tokenize_query(query)
    results: list[SearchResult] = []

    for chunk in CHUNKS:
        document = get_document_by_id(chunk.documentId)
        if not document:
            continue

        score = score_document(query_tokens, chunk, document)
        rounded_score = round(score, 3)

        if rounded_score <= 0:
            continue

        results.append(
            SearchResult(
                chunkId=chunk.id,
                documentId=document.id,
                score=rounded_score,
                snippet=chunk.content,
                title=document.title,
                language=document.language,
                topicTags=document.topicTags,
                region=document.region,
                institution=document.institution,
                sourceUrl=document.sourceUrl,
                sourceType=document.sourceType,
                rightsNote=document.rightsNote,
            )
        )

    return sorted(results, key=lambda result: result.score, reverse=True)[:limit]


def build_answer(query: str, results: list[SearchResult]) -> AnswerResult:
    language = detect_language(query)
    evidence_strength = classify_evidence(results)
    usable = [result for result in results if result.score >= 0.2][:3]

    if evidence_strength == "weak" or len(usable) == 0:
        return AnswerResult(
            answer=(
                "No tengo suficiente evidencia en las fuentes indexadas para responder con confianza."
                if language == "es"
                else "I do not have enough evidence in the indexed sources to answer confidently."
            ),
            language=language,
            citations=[],
            evidenceStrength=evidence_strength,
            refused=True,
        )

    citations = [
        AnswerCitation(marker=f"[{index + 1}]", chunkId=result.chunkId, documentId=result.documentId, title=result.title)
        for index, result in enumerate(usable)
    ]
    extras = ", ".join(f"{item.title} {citations[index + 1].marker}" for index, item in enumerate(usable[1:]))

    if language == "es":
        answer = f"Segun las fuentes recuperadas, {usable[0].snippet} {citations[0].marker}"
        if extras:
            answer += f" Revise tambien {extras} para comparar contexto."
    else:
        answer = f"Based on the retrieved sources, {usable[0].snippet} {citations[0].marker}"
        if extras:
            answer += f" Also review {extras} for context."

    return AnswerResult(answer=answer, language=language, citations=citations, evidenceStrength=evidence_strength, refused=False)


def classify_evidence(results: list[SearchResult]) -> EvidenceStrength:
    best_score = results[0].score if results else 0
    if best_score >= 0.5 and len(results) >= 3:
        return "strong"
    if best_score >= 0.25 and len(results) >= 1:
        return "moderate"
    return "weak"


def detect_language(query: str) -> LanguageCode:
    normalized = query.lower()
    accentless = strip_accents(normalized)
    if re.search(r"[ñáéíóú¿]", query, re.IGNORECASE) or re.search(
        r"\b(que|como|fuente|fuentes|recursos|educacion|patrimonio|traduccion|genera|sabes)\b",
        accentless,
    ):
        return "es"
    return "en"


def tokenize(value: str) -> list[str]:
    normalized = strip_accents(value.lower())
    cleaned = re.sub(r"[^a-z0-9ñ ]", " ", normalized)
    return [token for token in re.split(r"\s+", cleaned) if len(token) > 2 and token not in STOP_WORDS]


def tokenize_query(value: str) -> list[str]:
    expanded_tokens: list[str] = []
    seen: set[str] = set()

    for token in tokenize(value):
        for expanded_token in [token, *QUERY_ALIASES.get(token, [])]:
            if expanded_token not in seen:
                expanded_tokens.append(expanded_token)
                seen.add(expanded_token)

    return expanded_tokens


def score_document(query_tokens: list[str], chunk: Chunk, document: Document) -> float:
    if len(query_tokens) == 0:
        return 0

    field_tokens = {
        "title": tokenize(document.title),
        "topicTags": tokenize(" ".join(document.topicTags)),
        "institution": tokenize(document.institution),
        "content": tokenize(chunk.content),
        "region": tokenize(document.region),
    }
    flat_tokens = tokenize(f"{chunk.content} {document.title} {' '.join(document.topicTags)} {document.institution}")
    flat_overlap_score = len([token for token in query_tokens if token in flat_tokens]) / len(query_tokens)
    weighted_score = 0.0

    for token in query_tokens:
        token_weight = 0.0
        for field, tokens in field_tokens.items():
            if token in tokens:
                token_weight = max(token_weight, FIELD_WEIGHTS[field])
        weighted_score += token_weight

    field_boost_score = weighted_score / (len(query_tokens) * MAX_FIELD_WEIGHT)
    return min(1, flat_overlap_score + field_boost_score * 0.25)


def strip_accents(value: str) -> str:
    return "".join(character for character in unicodedata.normalize("NFD", value) if unicodedata.category(character) != "Mn")


def get_document_by_id(document_id: str) -> Document | None:
    return next((document for document in DOCUMENTS if document.id == document_id), None)
