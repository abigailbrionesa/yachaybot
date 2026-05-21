import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAnswer, searchCorpus } from "@/lib/v2-data";
import { validationError } from "@/lib/v2-schemas";

export const maxDuration = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

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

  return NextResponse.json({
    query: lastUserMessage.content,
    language: grounded.language,
    retrievedChunkIds: search.results.map((result) => result.chunkId),
    results: search.results,
    answer: modelAnswer ? { ...grounded, answer: modelAnswer } : grounded,
    modelUsed: modelAnswer ? "mistral-small-latest" : "local-grounded",
  });
}

function isRateLimited(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwardedFor || "local";
  const now = Date.now();
  const current = requestCounts.get(key);

  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
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
