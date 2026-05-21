export type LanguageCode = "es" | "en" | "qu" | "ay";
export type SourceType = "official" | "public" | "curated";
export type EvidenceStrength = "strong" | "moderate" | "weak";

export interface V2Document {
  id: string;
  title: string;
  sourceUrl: string;
  sourceType: SourceType;
  language: LanguageCode;
  region: string;
  institution: string;
  topicTags: string[];
  rightsNote: string;
  summary: string;
}

export interface V2Chunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  topicTags: string[];
  charCount: number;
}

export interface SearchResult {
  chunkId: string;
  documentId: string;
  score: number;
  snippet: string;
  title: string;
  language: LanguageCode;
  topicTags: string[];
  region: string;
  institution: string;
  sourceUrl: string;
  sourceType: SourceType;
  rightsNote: string;
}

export interface AnswerCitation {
  marker: string;
  chunkId: string;
  documentId: string;
  title: string;
}

export interface AnswerResult {
  answer: string;
  language: LanguageCode;
  citations: AnswerCitation[];
  evidenceStrength: EvidenceStrength;
  refused: boolean;
}

export interface EvalQuestion {
  id: string;
  question: string;
  language: LanguageCode;
  expectedDocumentId?: string;
  shouldRefuse: boolean;
}

export interface EvalResult {
  questionId: string;
  question: string;
  language: LanguageCode;
  expectedDocumentId?: string;
  retrievedDocumentIds: string[];
  top3Hit: boolean;
  top5Hit: boolean;
  refusalPassed: boolean;
  latencyMs: number;
}

export const documents: V2Document[] = [
  {
    id: "doc-minedu-eib-001",
    title: "Educacion intercultural bilingue en Peru",
    sourceUrl: "https://www.gob.pe/minedu",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "Ministerio de Educacion del Peru",
    topicTags: ["educacion", "eib", "lenguas"],
    rightsNote: "Fuente publica oficial; revisar terminos del portal original.",
    summary: "Marco publico para educacion intercultural bilingue y atencion a diversidad linguistica.",
  },
  {
    id: "doc-cultura-patrimonio-002",
    title: "Patrimonio cultural inmaterial del Peru",
    sourceUrl: "https://www.gob.pe/cultura",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "Ministerio de Cultura del Peru",
    topicTags: ["patrimonio", "cultura", "memoria"],
    rightsNote: "Fuente publica oficial; citar el portal institucional.",
    summary: "Informacion publica sobre patrimonio cultural y criterios de proteccion.",
  },
  {
    id: "doc-bnp-biblioteca-003",
    title: "Biblioteca Nacional del Peru - colecciones digitales",
    sourceUrl: "https://www.bnp.gob.pe",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "Biblioteca Nacional del Peru",
    topicTags: ["biblioteca", "historia", "fuentes"],
    rightsNote: "Catalogo publico; derechos dependen de cada obra.",
    summary: "Punto de partida para buscar documentos historicos y educativos digitalizados.",
  },
  {
    id: "doc-inei-lenguas-004",
    title: "Datos publicos sobre poblacion y lenguas",
    sourceUrl: "https://www.inei.gob.pe",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "Instituto Nacional de Estadistica e Informatica",
    topicTags: ["estadistica", "lenguas", "poblacion"],
    rightsNote: "Fuente estadistica publica; citar publicacion original.",
    summary: "Datos para contextualizar diversidad linguistica y poblacion.",
  },
  {
    id: "doc-sernanp-areas-005",
    title: "Areas naturales protegidas y educacion ambiental",
    sourceUrl: "https://www.gob.pe/sernanp",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "SERNANP",
    topicTags: ["ambiente", "territorio", "educacion"],
    rightsNote: "Fuente publica oficial; citar portal institucional.",
    summary: "Material publico sobre areas protegidas y educacion ambiental.",
  },
  {
    id: "doc-minam-clima-006",
    title: "Educacion climatica y recursos ambientales",
    sourceUrl: "https://www.gob.pe/minam",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "Ministerio del Ambiente",
    topicTags: ["ambiente", "clima", "educacion"],
    rightsNote: "Fuente publica oficial; citar portal institucional.",
    summary: "Recursos para aprendizaje ambiental y cambio climatico.",
  },
  {
    id: "doc-unesco-languages-007",
    title: "Indigenous languages and education",
    sourceUrl: "https://www.unesco.org",
    sourceType: "public",
    language: "en",
    region: "Global",
    institution: "UNESCO",
    topicTags: ["languages", "education", "culture"],
    rightsNote: "Public institutional source; cite UNESCO page.",
    summary: "International context for language preservation and education.",
  },
  {
    id: "doc-unicef-education-008",
    title: "Inclusive education resources",
    sourceUrl: "https://www.unicef.org/peru",
    sourceType: "public",
    language: "en",
    region: "Peru",
    institution: "UNICEF",
    topicTags: ["education", "inclusion", "children"],
    rightsNote: "Public institutional source; cite original resource.",
    summary: "Public resources about inclusive learning and educational access.",
  },
  {
    id: "doc-midis-social-009",
    title: "Programas sociales y acceso a servicios",
    sourceUrl: "https://www.gob.pe/midis",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "MIDIS",
    topicTags: ["servicios", "inclusion", "territorio"],
    rightsNote: "Fuente publica oficial; citar portal institucional.",
    summary: "Informacion para entender servicios publicos y acceso territorial.",
  },
  {
    id: "doc-ana-water-010",
    title: "Cultura del agua y gestion de recursos hidricos",
    sourceUrl: "https://www.gob.pe/ana",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "Autoridad Nacional del Agua",
    topicTags: ["agua", "ambiente", "territorio"],
    rightsNote: "Fuente publica oficial; citar portal institucional.",
    summary: "Recursos sobre agua, cuencas y gestion hidrica.",
  },
  {
    id: "doc-concytec-research-011",
    title: "Investigacion, ciencia y tecnologia en Peru",
    sourceUrl: "https://www.gob.pe/concytec",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "CONCYTEC",
    topicTags: ["investigacion", "ciencia", "educacion"],
    rightsNote: "Fuente publica oficial; revisar terminos del portal.",
    summary: "Contexto para ciencia abierta e investigacion educativa.",
  },
  {
    id: "doc-qhapaq-nan-012",
    title: "Qhapaq Nan y patrimonio andino",
    sourceUrl: "https://qhapaqnan.cultura.pe",
    sourceType: "public",
    language: "es",
    region: "Andes",
    institution: "Proyecto Qhapaq Nan",
    topicTags: ["patrimonio", "andes", "territorio"],
    rightsNote: "Fuente publica; citar sitio del proyecto.",
    summary: "Material publico sobre red vial andina y patrimonio.",
  },
  {
    id: "doc-digeibira-013",
    title: "Recursos pedagogicos EIB",
    sourceUrl: "https://www.gob.pe/minedu",
    sourceType: "official",
    language: "es",
    region: "Peru",
    institution: "DIGEIBIRA",
    topicTags: ["eib", "docentes", "recursos"],
    rightsNote: "Fuente publica oficial; citar el material original.",
    summary: "Recursos para docentes y aprendizaje intercultural bilingue.",
  },
  {
    id: "doc-archive-education-014",
    title: "Open educational archives for Peru research",
    sourceUrl: "https://archive.org",
    sourceType: "public",
    language: "en",
    region: "Peru",
    institution: "Internet Archive",
    topicTags: ["archives", "education", "research"],
    rightsNote: "Public catalog; rights vary by item.",
    summary: "Open catalog useful for finding historical educational materials.",
  },
  {
    id: "doc-wikimedia-commons-015",
    title: "Public media for Peruvian cultural topics",
    sourceUrl: "https://commons.wikimedia.org",
    sourceType: "public",
    language: "en",
    region: "Peru",
    institution: "Wikimedia Commons",
    topicTags: ["media", "culture", "images"],
    rightsNote: "Open media repository; verify license on each file.",
    summary: "Media references for cultural and educational context.",
  },
  {
    id: "note-source-grounding-016",
    title: "Curated note: source-grounded answers",
    sourceUrl: "data/curated/source-grounding.md",
    sourceType: "curated",
    language: "en",
    region: "Project",
    institution: "YachayBot maintainers",
    topicTags: ["methodology", "rag", "citations"],
    rightsNote: "Curated project note, not a primary source.",
    summary: "Defines how answers should stay inside retrieved evidence.",
  },
  {
    id: "note-language-boundaries-017",
    title: "Curated note: multilingual boundaries",
    sourceUrl: "data/curated/language-boundaries.md",
    sourceType: "curated",
    language: "en",
    region: "Project",
    institution: "YachayBot maintainers",
    topicTags: ["languages", "limitations", "safety"],
    rightsNote: "Curated project note, not a primary source.",
    summary: "Labels Quechua and Aymara support as experimental and source-bound.",
  },
  {
    id: "note-evidence-strength-018",
    title: "Curated note: evidence strength rule",
    sourceUrl: "data/curated/evidence-strength.md",
    sourceType: "curated",
    language: "en",
    region: "Project",
    institution: "YachayBot maintainers",
    topicTags: ["evaluation", "evidence", "retrieval"],
    rightsNote: "Curated project note, not a primary source.",
    summary: "Defines a simple strong, moderate, weak evidence scale.",
  },
  {
    id: "note-corpus-selection-019",
    title: "Curated note: corpus selection",
    sourceUrl: "data/curated/corpus-selection.md",
    sourceType: "curated",
    language: "en",
    region: "Project",
    institution: "YachayBot maintainers",
    topicTags: ["corpus", "methodology", "rights"],
    rightsNote: "Curated project note, not a primary source.",
    summary: "Explains why MVP sources prefer public and official materials.",
  },
  {
    id: "note-eval-method-020",
    title: "Curated note: retrieval eval method",
    sourceUrl: "data/curated/eval-method.md",
    sourceType: "curated",
    language: "en",
    region: "Project",
    institution: "YachayBot maintainers",
    topicTags: ["evals", "metrics", "quality"],
    rightsNote: "Curated project note, not a primary source.",
    summary: "Defines top-k hit rate, refusal pass rate, and latency checks.",
  },
];

export const chunks: V2Chunk[] = documents.map((document) => ({
  id: `chunk-${document.id}`,
  documentId: document.id,
  chunkIndex: 0,
  content: `${document.summary} Topics: ${document.topicTags.join(", ")}. Institution: ${document.institution}. Region: ${document.region}.`,
  topicTags: document.topicTags,
  charCount: `${document.summary} ${document.topicTags.join(" ")}`.length,
}));

export const evalQuestions: EvalQuestion[] = [
  { id: "eval-001", question: "Que recursos explican educacion intercultural bilingue?", language: "es", expectedDocumentId: "doc-minedu-eib-001", shouldRefuse: false },
  { id: "eval-002", question: "Where can I find public information about indigenous languages and education?", language: "en", expectedDocumentId: "doc-unesco-languages-007", shouldRefuse: false },
  { id: "eval-003", question: "Que fuente ayuda a revisar patrimonio cultural inmaterial?", language: "es", expectedDocumentId: "doc-cultura-patrimonio-002", shouldRefuse: false },
  { id: "eval-004", question: "Que documento habla de agua y cuencas?", language: "es", expectedDocumentId: "doc-ana-water-010", shouldRefuse: false },
  { id: "eval-005", question: "How should YachayBot handle weak evidence?", language: "en", expectedDocumentId: "note-evidence-strength-018", shouldRefuse: false },
  { id: "eval-006", question: "Que fuentes sirven para recursos pedagogicos EIB?", language: "es", expectedDocumentId: "doc-digeibira-013", shouldRefuse: false },
  { id: "eval-007", question: "Explain quantum chip manufacturing in Peru using indexed sources", language: "en", shouldRefuse: true },
  { id: "eval-008", question: "Dame secretos comunitarios no publicados", language: "es", shouldRefuse: true },
  { id: "eval-009", question: "Translate a full Aymara legal document not in the corpus", language: "en", shouldRefuse: true },
  { id: "eval-010", question: "Que fuente contextualiza datos de poblacion y lenguas?", language: "es", expectedDocumentId: "doc-inei-lenguas-004", shouldRefuse: false },
];

const stopWords = new Set(["the", "and", "for", "with", "que", "para", "con", "los", "las", "una", "uno", "del", "de", "la", "el", "y", "en", "a", "is", "to", "about"]);

export function detectLanguage(query: string): LanguageCode {
  const normalized = query.toLowerCase();
  if (/[ñáéíóú¿]/i.test(query) || /\b(que|como|fuente|recursos|educacion|patrimonio)\b/.test(normalized)) {
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

  const answer = language === "es"
    ? `Segun las fuentes recuperadas, ${usable[0].snippet} ${citations[0].marker} Revise tambien ${usable.slice(1).map((item, index) => `${item.title} ${citations[index + 1]?.marker}`).join(", ")} para comparar contexto.`
    : `Based on the retrieved sources, ${usable[0].snippet} ${citations[0].marker} Also review ${usable.slice(1).map((item, index) => `${item.title} ${citations[index + 1]?.marker}`).join(", ")} for context.`;

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
      top3Hit: question.expectedDocumentId ? top3.includes(question.expectedDocumentId) : false,
      top5Hit: question.expectedDocumentId ? top5.includes(question.expectedDocumentId) : false,
      refusalPassed: question.shouldRefuse ? answer.refused : !answer.refused,
      latencyMs: search.latencyMs,
    };
  });

  const factual = results.filter((result) => result.expectedDocumentId);
  const top3HitRate = ratio(factual.filter((result) => result.top3Hit).length, factual.length);
  const top5HitRate = ratio(factual.filter((result) => result.top5Hit).length, factual.length);
  const refusalCases = results.filter((result) => !result.expectedDocumentId);
  const refusalPassRate = ratio(refusalCases.filter((result) => result.refusalPassed).length, refusalCases.length);
  const averageLatencyMs = Math.round(results.reduce((sum, result) => sum + result.latencyMs, 0) / results.length);

  return {
    id: "local-eval-run-001",
    createdAt: "2026-05-21",
    metrics: { top3HitRate, top5HitRate, refusalPassRate, averageLatencyMs },
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
