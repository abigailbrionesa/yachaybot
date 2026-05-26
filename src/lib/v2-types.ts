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
  category: "retrieval" | "unsupported" | "ambiguous" | "multilingual-boundary" | "off-topic" | "citation";
  expectedDocumentId?: string;
  shouldRefuse: boolean;
}

export interface EvalResult {
  questionId: string;
  question: string;
  language: LanguageCode;
  expectedDocumentId?: string;
  retrievedDocumentIds: string[];
  category: EvalQuestion["category"];
  top3Hit: boolean;
  top5Hit: boolean;
  answerRefused: boolean;
  refusalPassed: boolean;
  citationMarkers: string[];
  citationPassed: boolean;
  latencyMs: number;
}

export interface SearchResponse {
  query: string;
  language: LanguageCode;
  latencyMs: number;
  retrievedChunkIds: string[];
  evidenceStrength: EvidenceStrength;
  results: SearchResult[];
  answer: AnswerResult;
}

export interface DocumentsResponse {
  documents: Array<V2Document & { chunks: V2Chunk[] }>;
}

export interface EvalRunResponse {
  runs: Array<{
    id: string;
    createdAt: string;
    metrics: {
      top3HitRate: number;
      top5HitRate: number;
      refusalPassRate: number;
      citationPassRate: number;
      averageLatencyMs: number;
    };
    results: EvalResult[];
  }>;
}
