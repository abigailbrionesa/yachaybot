import { NextResponse } from "next/server";
import { buildAnswer, searchCorpus } from "@/lib/v2-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const query = typeof body.query === "string" ? body.query : "";

  if (!query.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const search = searchCorpus(query, 5);
  const answer = buildAnswer(query, search.results);

  return NextResponse.json({
    query,
    language: answer.language,
    latencyMs: search.latencyMs,
    retrievedChunkIds: search.results.map((result) => result.chunkId),
    answer,
  });
}
