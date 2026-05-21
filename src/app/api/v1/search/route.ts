import { NextResponse } from "next/server";
import { buildAnswer, classifyEvidence, searchCorpus } from "@/lib/v2-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const query = typeof body.query === "string" ? body.query : "";
  const limit = typeof body.limit === "number" ? body.limit : 5;

  if (!query.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

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
