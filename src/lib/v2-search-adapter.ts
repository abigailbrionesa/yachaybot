import { z } from "zod";
import { buildAnswer, classifyEvidence, searchCorpus } from "./v2-data";
import type { SearchResponse } from "./v2-types";

const searchResultSchema = z.object({
  chunkId: z.string(),
  documentId: z.string(),
  score: z.number(),
  snippet: z.string(),
  title: z.string(),
  language: z.enum(["es", "en", "qu", "ay"]),
  topicTags: z.array(z.string()),
  region: z.string(),
  institution: z.string(),
  sourceUrl: z.string(),
  sourceType: z.enum(["official", "public", "curated"]),
  rightsNote: z.string(),
});

const searchResponseSchema = z.object({
  query: z.string(),
  language: z.enum(["es", "en", "qu", "ay"]),
  latencyMs: z.number(),
  retrievedChunkIds: z.array(z.string()),
  evidenceStrength: z.enum(["strong", "moderate", "weak"]),
  results: z.array(searchResultSchema),
  answer: z.object({
    answer: z.string(),
    language: z.enum(["es", "en", "qu", "ay"]),
    citations: z.array(z.object({
      marker: z.string(),
      chunkId: z.string(),
      documentId: z.string(),
      title: z.string(),
    })),
    evidenceStrength: z.enum(["strong", "moderate", "weak"]),
    refused: z.boolean(),
  }),
});

export async function searchWithAdapter(query: string, limit: number): Promise<SearchResponse> {
  const serviceUrl = process.env.YACHAYBOT_SEARCH_SERVICE_URL?.trim();

  if (serviceUrl) {
    const serviceResponse = await searchViaService(serviceUrl, query, limit);
    if (serviceResponse) {
      return serviceResponse;
    }
  }

  return searchLocally(query, limit);
}

export function searchLocally(query: string, limit: number): SearchResponse {
  const search = searchCorpus(query, limit);
  const answer = buildAnswer(query, search.results);

  return {
    query,
    language: search.language,
    latencyMs: search.latencyMs,
    retrievedChunkIds: search.results.map((result) => result.chunkId),
    evidenceStrength: classifyEvidence(search.results),
    results: search.results,
    answer,
  };
}

async function searchViaService(serviceUrl: string, query: string, limit: number): Promise<SearchResponse | null> {
  const endpoint = new URL("/v1/search", serviceUrl);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, limit }),
  }).catch(() => null);

  if (!response?.ok) {
    return null;
  }

  const payload = await response.json().catch(() => null);
  const parsed = searchResponseSchema.safeParse(payload);

  return parsed.success ? parsed.data : null;
}
