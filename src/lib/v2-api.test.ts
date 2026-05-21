import assert from "node:assert/strict";
import test from "node:test";
import { GET as getPausedAuth, POST as postPausedAuth } from "../app/api/auth/[...nextauth]/route";
import { POST as postLogin } from "../app/api/auth/login/route";
import { POST as postChat } from "../app/api/chat/route";
import { POST as postAnswer } from "../app/api/v1/answers/route";
import { GET as getEvalRun } from "../app/api/v1/evals/runs/[runId]/route";
import { POST as postSearch } from "../app/api/v1/search/route";

delete process.env.MISTRAL_API_KEY;

function jsonRequest(body: unknown, identity = "test-client", headers: Record<string, string> = {}) {
  return new Request("http://localhost.test", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": identity, ...headers },
    body: JSON.stringify(body),
  });
}

function mockMistralResponse(content: string) {
  const originalFetch = globalThis.fetch;
  const originalApiKey = process.env.MISTRAL_API_KEY;

  process.env.MISTRAL_API_KEY = "test-key";
  globalThis.fetch = async () => Response.json({ choices: [{ message: { content } }] });

  return () => {
    globalThis.fetch = originalFetch;
    if (originalApiKey) {
      process.env.MISTRAL_API_KEY = originalApiKey;
    } else {
      delete process.env.MISTRAL_API_KEY;
    }
  };
}

test("/api/v1/search rejects invalid payloads", async () => {
  const response = await postSearch(jsonRequest({ query: "", limit: 5 }));
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.error.code, "INVALID_REQUEST");
});

test("/api/v1/answers rejects invalid payloads", async () => {
  const response = await postAnswer(jsonRequest({ query: "EIB", chunkIds: [] }));
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.error.code, "INVALID_REQUEST");
});

test("/api/chat rejects invalid payloads", async () => {
  const response = await postChat(jsonRequest({ messages: [] }));
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.error.code, "INVALID_REQUEST");
});

test("/api/chat answers from retrieved evidence", async () => {
  const response = await postChat(jsonRequest({
    messages: [{ role: "user", content: "Que recursos explican educacion intercultural bilingue?" }],
  }, "chat-evidence"));
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.answer.refused, false);
  assert.ok(payload.retrievedChunkIds.includes("chunk-doc-minedu-eib-001"));
});

test("/api/chat accepts Mistral output with known citation markers", async () => {
  const restore = mockMistralResponse("Respuesta pulida basada en la evidencia recuperada. [1]");

  try {
    const response = await postChat(jsonRequest({
      messages: [{ role: "user", content: "Que recursos explican educacion intercultural bilingue?" }],
    }, "chat-known-citation"));
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.modelUsed, "mistral-small-latest");
    assert.equal(payload.answer.answer, "Respuesta pulida basada en la evidencia recuperada. [1]");
  } finally {
    restore();
  }
});

test("/api/chat rejects Mistral output without citations", async () => {
  const restore = mockMistralResponse("Respuesta pulida sin marcador de fuente.");

  try {
    const response = await postChat(jsonRequest({
      messages: [{ role: "user", content: "Que recursos explican educacion intercultural bilingue?" }],
    }, "chat-no-citation"));
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.modelUsed, "local-grounded");
    assert.notEqual(payload.answer.answer, "Respuesta pulida sin marcador de fuente.");
  } finally {
    restore();
  }
});

test("/api/chat rejects Mistral output with unknown citation markers", async () => {
  const restore = mockMistralResponse("Respuesta con una fuente no recuperada. [99]");

  try {
    const response = await postChat(jsonRequest({
      messages: [{ role: "user", content: "Que recursos explican educacion intercultural bilingue?" }],
    }, "chat-unknown-citation"));
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.modelUsed, "local-grounded");
    assert.notEqual(payload.answer.answer, "Respuesta con una fuente no recuperada. [99]");
  } finally {
    restore();
  }
});

test("/api/auth/login is intentionally paused for the v2 MVP", async () => {
  const response = await postLogin();
  const payload = await response.json();

  assert.equal(response.status, 503);
  assert.equal(payload.error.code, "FEATURE_UNAVAILABLE");
});

test("/api/auth catch-all is intentionally paused for the v2 MVP", async () => {
  const getResponse = await getPausedAuth();
  const postResponse = await postPausedAuth();
  const getPayload = await getResponse.json();
  const postPayload = await postResponse.json();

  assert.equal(getResponse.status, 503);
  assert.equal(postResponse.status, 503);
  assert.equal(getPayload.error.code, "FEATURE_UNAVAILABLE");
  assert.equal(postPayload.error.code, "FEATURE_UNAVAILABLE");
});

test("/api/v1/evals/runs/[runId] returns the known local eval run", async () => {
  const response = await getEvalRun(new Request("http://localhost.test"), {
    params: Promise.resolve({ runId: "local-eval-run-001" }),
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.run.id, "local-eval-run-001");
});

test("/api/v1/evals/runs/[runId] rejects unknown eval runs", async () => {
  const response = await getEvalRun(new Request("http://localhost.test"), {
    params: Promise.resolve({ runId: "not-real" }),
  });
  const payload = await response.json();

  assert.equal(response.status, 404);
  assert.equal(payload.error.code, "NOT_FOUND");
});

test("/api/chat rate limits repeated requests", async () => {
  let response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }, "rate-limit"));

  for (let index = 0; index < 22; index += 1) {
    response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }, "rate-limit"));
  }

  const payload = await response.json();
  assert.equal(response.status, 429);
  assert.equal(payload.error.code, "RATE_LIMITED");
});

test("/api/chat rate limit ignores spoofed real IP headers", async () => {
  let response = await postChat(jsonRequest(
    { messages: [{ role: "user", content: "EIB" }] },
    "forwarded-priority",
    { "x-real-ip": "spoofed-real-ip-0" },
  ));

  for (let index = 1; index < 23; index += 1) {
    response = await postChat(jsonRequest(
      { messages: [{ role: "user", content: "EIB" }] },
      "forwarded-priority",
      { "x-real-ip": `spoofed-real-ip-${index}` },
    ));
  }

  const payload = await response.json();
  assert.equal(response.status, 429);
  assert.equal(payload.error.code, "RATE_LIMITED");
});

test("/api/chat rate limit resets after the window", async () => {
  const originalNow = Date.now;
  let now = 1_700_000_000_000;
  Date.now = () => now;

  try {
    let response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }, "reset-window"));

    for (let index = 0; index < 22; index += 1) {
      response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }, "reset-window"));
    }

    assert.equal(response.status, 429);

    now += 61_000;
    response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }, "reset-window"));

    assert.equal(response.status, 200);
  } finally {
    Date.now = originalNow;
  }
});

test("/api/chat rate limit falls back when forwarded identity is malformed", async () => {
  let response = await postChat(jsonRequest(
    { messages: [{ role: "user", content: "EIB" }] },
    "bad forwarded identity 0",
  ));

  for (let index = 1; index < 23; index += 1) {
    response = await postChat(jsonRequest(
      { messages: [{ role: "user", content: "EIB" }] },
      `bad forwarded identity ${index}`,
    ));
  }

  const payload = await response.json();
  assert.equal(response.status, 429);
  assert.equal(payload.error.code, "RATE_LIMITED");
});
