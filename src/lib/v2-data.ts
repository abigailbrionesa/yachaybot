import corpus from "../../data/corpus.json";
import evals from "../../data/evals.json";
import type { AnswerResult, EvalQuestion, EvalResult, EvidenceStrength, LanguageCode, SearchResult, V2Chunk, V2Document } from "./v2-types";

export const documents = corpus.documents as V2Document[];

export const chunks: V2Chunk[] = documents.map((document) => ({
  id: `chunk-${document.id}`,
  documentId: document.id,
  chunkIndex: 0,
  content: `${document.summary} Topics: ${document.topicTags.join(", ")}. Institution: ${document.institution}. Region: ${document.region}.`,
  topicTags: document.topicTags,
  charCount: `${document.summary} ${document.topicTags.join(" ")}`.length,
}));

export const evalQuestions = evals.questions as EvalQuestion[];

const stopWords = new Set(["the", "and", "for", "with", "que", "para", "con", "los", "las", "una", "uno", "del", "de", "la", "el", "y", "en", "a", "is", "to", "about"]);

export function detectLanguage(query: string): LanguageCode {
  const normalized = query.toLowerCase();
  const accentless = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (/[ñáéíóú¿]/i.test(query) || /\b(que|como|fuente|fuentes|recursos|educacion|patrimonio|traduccion|genera|sabes)\b/.test(accentless)) {
    return "es";
  }
  return "en";
}

export function getDocumentById(documentId: string) {
  return documents.find((document) => document.id === documentId);
}

export function getChunksForDocument(documentId: string) {
  return chunks.filter((chunk) => chunk.documentId === documentId);
}

export function getSearchResultsForChunkIds(chunkIds: string[]): SearchResult[] {
  return chunkIds
    .map((chunkId) => {
      const chunk = chunks.find((item) => item.id === chunkId);
      if (!chunk) return null;

      const document = getDocumentById(chunk.documentId);
      if (!document) return null;

      return {
        chunkId: chunk.id,
        documentId: document.id,
        score: 1,
        snippet: chunk.content,
        title: document.title,
        language: document.language,
        topicTags: document.topicTags,
        region: document.region,
        institution: document.institution,
        sourceUrl: document.sourceUrl,
        sourceType: document.sourceType,
        rightsNote: document.rightsNote,
      } satisfies SearchResult;
    })
    .filter((result): result is SearchResult => Boolean(result));
}

export function searchCorpus(query: string, limit = 5): { results: SearchResult[]; latencyMs: number; language: LanguageCode } {
  const startedAt = Date.now();
  const queryTokens = tokenize(query);
  const language = detectLanguage(query);

  const results = chunks
    .map((chunk) => {
      const document = getDocumentById(chunk.documentId);
      if (!document) return null;

      const haystack = tokenize(`${chunk.content} ${document.title} ${document.topicTags.join(" ")} ${document.institution}`);
      const overlap = queryTokens.filter((token) => haystack.includes(token)).length;
      const score = queryTokens.length === 0 ? 0 : overlap / queryTokens.length;

      return {
        chunkId: chunk.id,
        documentId: document.id,
        score: Number(score.toFixed(3)),
        snippet: chunk.content,
        title: document.title,
        language: document.language,
        topicTags: document.topicTags,
        region: document.region,
        institution: document.institution,
        sourceUrl: document.sourceUrl,
        sourceType: document.sourceType,
        rightsNote: document.rightsNote,
      } satisfies SearchResult;
    })
    .filter((result): result is SearchResult => Boolean(result))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return { results, latencyMs: Date.now() - startedAt, language };
}

export function classifyEvidence(results: SearchResult[]): EvidenceStrength {
  const bestScore = results[0]?.score ?? 0;
  if (bestScore >= 0.5 && results.length >= 3) return "strong";
  if (bestScore >= 0.25 && results.length >= 1) return "moderate";
  return "weak";
}

export function buildAnswer(query: string, results: SearchResult[]): AnswerResult {
  const language = detectLanguage(query);
  const evidenceStrength = classifyEvidence(results);
  const usable = results.filter((result) => result.score >= 0.2).slice(0, 3);

  if (evidenceStrength === "weak" || usable.length === 0) {
    return {
      answer: language === "es"
        ? "No tengo suficiente evidencia en las fuentes indexadas para responder con confianza."
        : "I do not have enough evidence in the indexed sources to answer confidently.",
      language,
      citations: [],
      evidenceStrength,
      refused: true,
    };
  }

  const citations = usable.map((result, index) => ({
    marker: `[${index + 1}]`,
    chunkId: result.chunkId,
    documentId: result.documentId,
    title: result.title,
  }));

  const extraSpanish = usable.slice(1).map((item, index) => `${item.title} ${citations[index + 1]?.marker}`).join(", ");
  const extraEnglish = usable.slice(1).map((item, index) => `${item.title} ${citations[index + 1]?.marker}`).join(", ");
  const answer = language === "es"
    ? `Segun las fuentes recuperadas, ${usable[0].snippet} ${citations[0].marker}${extraSpanish ? ` Revise tambien ${extraSpanish} para comparar contexto.` : ""}`
    : `Based on the retrieved sources, ${usable[0].snippet} ${citations[0].marker}${extraEnglish ? ` Also review ${extraEnglish} for context.` : ""}`;

  return { answer, language, citations, evidenceStrength, refused: false };
}

export function runEval() {
  const results: EvalResult[] = evalQuestions.map((question) => {
    const search = searchCorpus(question.question, 5);
    const retrievedDocumentIds = search.results.map((result) => result.documentId);
    const answer = buildAnswer(question.question, search.results);
    const top3 = retrievedDocumentIds.slice(0, 3);
    const top5 = retrievedDocumentIds.slice(0, 5);

    return {
      questionId: question.id,
      question: question.question,
      language: question.language,
      expectedDocumentId: question.expectedDocumentId,
      retrievedDocumentIds,
      category: question.category,
      top3Hit: question.expectedDocumentId ? top3.includes(question.expectedDocumentId) : false,
      top5Hit: question.expectedDocumentId ? top5.includes(question.expectedDocumentId) : false,
      answerRefused: answer.refused,
      refusalPassed: question.shouldRefuse ? answer.refused : !answer.refused,
      citationMarkers: answer.citations.map((citation) => citation.marker),
      citationPassed: question.shouldRefuse ? answer.citations.length === 0 : answer.citations.length > 0,
      latencyMs: search.latencyMs,
    };
  });

  const factual = results.filter((result) => result.expectedDocumentId);
  const top3HitRate = ratio(factual.filter((result) => result.top3Hit).length, factual.length);
  const top5HitRate = ratio(factual.filter((result) => result.top5Hit).length, factual.length);
  const refusalCases = results.filter((result) => !result.expectedDocumentId);
  const refusalPassRate = ratio(refusalCases.filter((result) => result.refusalPassed).length, refusalCases.length);
  const citationCases = results.filter((result) => result.category === "citation" || result.expectedDocumentId);
  const citationPassRate = ratio(citationCases.filter((result) => result.citationPassed).length, citationCases.length);
  const averageLatencyMs = Math.round(results.reduce((sum, result) => sum + result.latencyMs, 0) / results.length);

  return {
    id: "local-eval-run-001",
    createdAt: "2026-05-21",
    metrics: { top3HitRate, top5HitRate, refusalPassRate, citationPassRate, averageLatencyMs },
    results,
  };
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ ]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function ratio(count: number, total: number) {
  return total === 0 ? 0 : Number((count / total).toFixed(2));
}
