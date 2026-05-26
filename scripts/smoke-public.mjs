const baseUrl = process.env.SMOKE_BASE_URL ?? "http://localhost:3000";

const checks = [
  { name: "Spanish search page", path: "/es", status: 200 },
  { name: "Sources page", path: "/es/sources", status: 200 },
  { name: "Evals page", path: "/es/evals", status: 200 },
  { name: "Chat page", path: "/es/ai-bot", status: 200 },
  { name: "Paused sign-in page", path: "/es/sign-in", status: 200 },
  { name: "Paused dashboard page", path: "/es/dashboard", status: 200 },
];

const apiChecks = [
  {
    name: "Search API",
    path: "/api/v1/search",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "Que recursos explican educacion intercultural bilingue?", limit: 5 }),
    },
    status: 200,
    validate: (payload) => Array.isArray(payload.results) && payload.results.length > 0,
  },
  {
    name: "Chat API",
    path: "/api/chat",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Que recursos explican educacion intercultural bilingue?" }] }),
    },
    status: 200,
    validate: (payload) => payload.answer && typeof payload.answer.refused === "boolean",
  },
  {
    name: "Paused auth API",
    path: "/api/auth/login",
    init: { method: "POST" },
    status: 503,
    validate: (payload) => payload.error?.code === "FEATURE_UNAVAILABLE",
  },
  {
    name: "Eval run API",
    path: "/api/v1/evals/runs/local-eval-run-001",
    status: 200,
    validate: (payload) => payload.run?.id === "local-eval-run-001",
  },
];

for (const check of checks) {
  const response = await fetch(new URL(check.path, baseUrl));
  assert(response.status === check.status, `${check.name} expected ${check.status}, received ${response.status}`);
}

for (const check of apiChecks) {
  const response = await fetch(new URL(check.path, baseUrl), check.init);
  assert(response.status === check.status, `${check.name} expected ${check.status}, received ${response.status}`);
  const payload = await response.json();
  assert(check.validate(payload), `${check.name} returned an unexpected payload`);
}

console.log(`Public smoke checks passed against ${baseUrl}`);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
