import { NextResponse } from "next/server";
import { buildAnswer, classifyEvidence, searchCorpus } from "@/lib/v2-data";
import { searchRequestSchema, validationError } from "@/lib/v2-schemas";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = searchRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(validationError("Search request is invalid", parsed.error.flatten()), { status: 400 });
  }

  const { query, limit = 5 } = parsed.data;
  const search = searchCorpus(query, limit);
  const answer = buildAnswer(query, search.results);

  return NextResponse.json({
    query,
    language: search.language,
    latencyMs: search.latencyMs,
    retrievedChunkIds: search.results.map((result) => result.chunkId),
    evidenceStrength: classifyEvidence(search.results),
    results: search.results,
    answer,
  });
}
