import { NextResponse } from "next/server";
import { buildAnswer, getSearchResultsForChunkIds, searchCorpus } from "@/lib/v2-data";
import { answerRequestSchema, validationError } from "@/lib/v2-schemas";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = answerRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(validationError("Answer request is invalid", parsed.error.flatten()), { status: 400 });
  }

  const { query, chunkIds } = parsed.data;
  const startedAt = Date.now();
  const results = chunkIds ? getSearchResultsForChunkIds(chunkIds) : searchCorpus(query, 5).results;
  const answer = buildAnswer(query, results);

  return NextResponse.json({
    query,
    language: answer.language,
    latencyMs: Date.now() - startedAt,
    retrievedChunkIds: results.map((result) => result.chunkId),
    answer,
  });
}
