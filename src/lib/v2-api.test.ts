import assert from "node:assert/strict";
import test from "node:test";
import { POST as postLogin } from "../app/api/auth/login/route";
import { POST as postChat } from "../app/api/chat/route";
import { POST as postAnswer } from "../app/api/v1/answers/route";
import { POST as postSearch } from "../app/api/v1/search/route";

function jsonRequest(body: unknown) {
  return new Request("http://localhost.test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
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
  }));
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.answer.refused, false);
  assert.ok(payload.retrievedChunkIds.includes("chunk-doc-minedu-eib-001"));
});

test("/api/auth/login is intentionally paused for the v2 MVP", async () => {
  const response = await postLogin();
  const payload = await response.json();

  assert.equal(response.status, 503);
  assert.equal(payload.error.code, "FEATURE_UNAVAILABLE");
});

test("/api/chat rate limits repeated requests", async () => {
  let response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }));

  for (let index = 0; index < 22; index += 1) {
    response = await postChat(jsonRequest({ messages: [{ role: "user", content: "EIB" }] }));
  }

  const payload = await response.json();
  assert.equal(response.status, 429);
  assert.equal(payload.error.code, "RATE_LIMITED");
});
