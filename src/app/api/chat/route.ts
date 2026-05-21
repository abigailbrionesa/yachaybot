import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAnswer, searchCorpus } from "@/lib/v2-data";
import { validationError } from "@/lib/v2-schemas";

export const maxDuration = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_MAX_BUCKETS = 500;
const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000;
const requestCounts = new Map<string, { count: number; resetAt: number }>();
let lastRateLimitCleanup = 0;

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().trim().min(1).max(2000),
  })).min(1).max(12),
});

export async function POST(req: Request) {
  if (isRateLimited(req)) {
    return NextResponse.json(
      { error: { code: "RATE_LIMITED", message: "Too many chat requests. Please try again shortly." } },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = chatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(validationError("Chat request is invalid", parsed.error.flatten()), { status: 400 });
  }

  const lastUserMessage = parsed.data.messages.filter((message) => message.role === "user").at(-1);

  if (!lastUserMessage) {
    return NextResponse.json(validationError("Chat request must include a user message"), { status: 400 });
  }

  const search = searchCorpus(lastUserMessage.content, 5);
  const grounded = buildAnswer(lastUserMessage.content, search.results);

  if (grounded.refused) {
    return NextResponse.json({
      query: lastUserMessage.content,
      language: grounded.language,
      retrievedChunkIds: search.results.map((result) => result.chunkId),
      results: search.results,
      answer: grounded,
      modelUsed: "local-refusal",
    });
  }

  const modelAnswer = await generateGroundedAnswer(lastUserMessage.content, grounded.answer, search.results);
  const safeModelAnswer = modelAnswer && hasValidCitationMarkers(modelAnswer, grounded.citations.map((citation) => citation.marker))
    ? modelAnswer
    : null;

  return NextResponse.json({
    query: lastUserMessage.content,
    language: grounded.language,
    retrievedChunkIds: search.results.map((result) => result.chunkId),
    results: search.results,
    answer: safeModelAnswer ? { ...grounded, answer: safeModelAnswer } : grounded,
    modelUsed: safeModelAnswer ? "mistral-small-latest" : "local-grounded",
  });
}

function isRateLimited(req: Request) {
  const key = getRateLimitKey(req);
  const now = Date.now();

  if (requestCounts.size >= RATE_LIMIT_MAX_BUCKETS || now - lastRateLimitCleanup >= RATE_LIMIT_CLEANUP_INTERVAL_MS) {
    pruneExpiredRateLimitBuckets(now);
  }

  const current = requestCounts.get(key);

  if (!current || current.resetAt <= now) {
    if (requestCounts.size >= RATE_LIMIT_MAX_BUCKETS && !current) {
      evictOldestRateLimitBucket();
    }

    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function getRateLimitKey(req: Request) {
  const realIp = cleanClientIdentifier(req.headers.get("x-real-ip"));
  if (realIp) return realIp;

  const vercelForwardedFor = firstForwardedIdentifier(req.headers.get("x-vercel-forwarded-for"));
  if (vercelForwardedFor) return vercelForwardedFor;

  const forwardedFor = firstForwardedIdentifier(req.headers.get("x-forwarded-for"));
  return forwardedFor || "local";
}

function firstForwardedIdentifier(value: string | null) {
  return cleanClientIdentifier(value?.split(",")[0]);
}

function cleanClientIdentifier(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length > 128 || /[\s"'\\]/.test(trimmed)) return null;
  return trimmed;
}

function pruneExpiredRateLimitBuckets(now = Date.now()) {
  lastRateLimitCleanup = now;

  for (const [key, bucket] of requestCounts) {
    if (bucket.resetAt <= now) {
      requestCounts.delete(key);
    }
  }
}

function evictOldestRateLimitBucket() {
  const oldestKey = requestCounts.keys().next().value;
  if (oldestKey) {
    requestCounts.delete(oldestKey);
  }
}

function hasValidCitationMarkers(candidate: string, knownMarkers: string[]) {
  const markers = candidate.match(/\[\d+\]/g) ?? [];
  const known = new Set(knownMarkers);

  return markers.length > 0 && markers.every((marker) => known.has(marker));
}

async function generateGroundedAnswer(query: string, fallbackAnswer: string, results: ReturnType<typeof searchCorpus>["results"]) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return null;

  const evidence = results.slice(0, 3).map((result, index) => {
    return `[${index + 1}] ${result.title}\n${result.snippet}`;
  }).join("\n\n");

  const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistral-small-latest",
      temperature: 0.2,
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content: "Answer only from the provided evidence. Keep citation markers like [1]. If evidence is insufficient, say so.",
        },
        {
          role: "user",
          content: `Question: ${query}\n\nEvidence:\n${evidence}\n\nBaseline answer:\n${fallbackAnswer}`,
        },
      ],
    }),
  }).catch(() => null);

  if (!response?.ok) return null;

  const payload = await response.json().catch(() => null) as { choices?: Array<{ message?: { content?: string } }> } | null;
  const content = payload?.choices?.[0]?.message?.content?.trim();
  return content || null;
}
