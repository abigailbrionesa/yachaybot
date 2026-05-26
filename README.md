
<samp>

# YachayBot

<p>
YachayBot is a source-grounded AI search application for exploring public Peruvian cultural and educational knowledge. It turns a question into an inspectable path: source cards, cited answers, evidence strength, and refusal behavior when the indexed corpus cannot support a confident response.
</p>

<p>
Built with <strong>Next.js</strong>, <strong>TypeScript</strong>, <strong>Zod</strong>, and optional <strong>Mistral</strong> answer polishing, the project demonstrates production-minded AI engineering through typed API contracts, deterministic retrieval, citation validation, reproducible tests, and transparent product scope.
</p>

## Topic Rationale

<p>
I built YachayBot around one principle: AI education tools are only useful when people can inspect where an answer came from. The project connects cultural access, public educational resources, and responsible AI by making evidence visible instead of hiding it behind a chatbot response.
</p>

<p>
YachayBot showcases end-to-end product and engineering scope: retrieval design, API validation, model-output constraints, evaluation metrics, browser-tested flows, and user-facing polish.
</p>

## 𝙷𝚒𝚐𝚑𝚕𝚒𝚐𝚑𝚝𝚜

<ul>
  <li>
    <strong>Source-Grounded AI Search</strong><br>
    Search public Peruvian cultural and educational resources through inspectable source cards, snippets, metadata, rights notes, and URLs.
  </li>
  <li>
    <strong>Citation-Aware Answering</strong><br>
    Generate cited answers from retrieved evidence, with refusal behavior when indexed sources are too weak or absent.
  </li>
  <li>
    <strong>Model Output Safety</strong><br>
    Optional Mistral polishing is accepted only when the model preserves known citation markers instead of dropping or inventing citations.
  </li>
  <li>
    <strong>Evaluation Dashboard</strong><br>
    Review top-3 hit rate, top-5 hit rate, refusal pass rate, and latency for the deterministic retrieval baseline.
  </li>
  <li>
    <strong>Typed Full-Stack Implementation</strong><br>
    Next.js route handlers, TypeScript contracts, Zod request validation, unit tests, and browser-smoked public flows.
  </li>
</ul>

## 𝙿𝚛𝚘𝚍𝚞𝚌𝚝 𝚂𝚞𝚛𝚏𝚊𝚌𝚎

<table>
  <tr>
    <th>Route</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td><code>/es</code></td>
    <td>Spanish search experience</td>
  </tr>
  <tr>
    <td><code>/qu</code></td>
    <td>Quechua-locale search shell with source-bound behavior</td>
  </tr>
  <tr>
    <td><code>/ay</code></td>
    <td>Aymara-locale search shell with source-bound behavior</td>
  </tr>
  <tr>
    <td><code>/es/sources</code></td>
    <td>Source browser with language, topic, and source-type filters</td>
  </tr>
  <tr>
    <td><code>/es/evals</code></td>
    <td>Retrieval and refusal evaluation dashboard</td>
  </tr>
  <tr>
    <td><code>/es/ai-bot</code></td>
    <td>Chat UI over the same retrieval, citation, and refusal rules</td>
  </tr>
</table>

<p>
Account and educator workspace routes are intentionally scoped out of the public build. <code>/sign-in</code> and <code>/dashboard</code> show scope pages, while <code>/api/auth/*</code> returns <code>503 FEATURE_UNAVAILABLE</code>. This keeps the project focused on the AI search system instead of presenting unfinished authentication as a feature.
</p>

## 𝙰𝙸 𝚂𝚢𝚜𝚝𝚎𝚖 𝙳𝚎𝚜𝚒𝚐𝚗

<p>
YachayBot is designed around a simple rule: the answer is not useful unless the evidence is visible.
</p>

<ol>
  <li>A user submits a query from search or chat.</li>
  <li>API routes validate input with <strong>Zod</strong>.</li>
  <li><code>searchCorpus</code> ranks local chunks with deterministic token-overlap scoring.</li>
  <li><code>buildAnswer</code> classifies evidence as strong, moderate, or weak.</li>
  <li>Weak evidence returns a refusal instead of a confident answer.</li>
  <li>Usable evidence returns a cited grounded answer.</li>
  <li>If <code>MISTRAL_API_KEY</code> is configured, Mistral can polish the grounded answer.</li>
  <li>Polished output is accepted only if it preserves known citation markers.</li>
</ol>

## 𝙰𝚛𝚌𝚑𝚒𝚝𝚎𝚌𝚝𝚞𝚛𝚎

<pre>
User question
     |
     v
Next.js localized UI
     |--------------------------|
     v                          v
/api/v1/search              /api/chat
     |                          |
     v                          v
Inspectable local corpus -> Deterministic retrieval
                                |
                                v
                         Evidence strength check
                          |                 |
                          v                 v
                 Refusal for weak     Cited grounded answer
                     evidence                 |
                                              v
                                  Citation marker validation
                                      |              |
                                      v              v
                                      UI     Optional Mistral polishing
</pre>

<p>
Important implementation files:
</p>

<ul>
  <li><code>src/app/[locale]/page.tsx</code>: localized search-first homepage</li>
  <li><code>src/app/[locale]/sources/page.tsx</code>: source browser</li>
  <li><code>src/app/[locale]/evals/page.tsx</code>: evaluation dashboard</li>
  <li><code>src/app/[locale]/ai-bot/page.tsx</code>: chat UI</li>
  <li><code>src/app/api/v1/*</code>: public API routes</li>
  <li><code>src/app/api/chat/route.ts</code>: evidence-first chat endpoint</li>
  <li><code>src/lib/v2-data.ts</code>: corpus, retrieval, answer generation, and eval logic</li>
  <li><code>src/lib/v2-schemas.ts</code>: Zod request validation schemas</li>
  <li><code>src/lib/v2-types.ts</code>: shared TypeScript contracts</li>
  <li><code>migrations/001_v2_core.sql</code>: Postgres/pgvector schema design</li>
</ul>

## 𝙰𝙸 / 𝚁𝙰𝙶 𝙲𝚊𝚛𝚍

<table>
  <tr>
    <th>Area</th>
    <th>Implementation</th>
  </tr>
  <tr>
    <td>Intended use</td>
    <td>Discover and inspect public Peruvian cultural and educational resources</td>
  </tr>
  <tr>
    <td>Retrieval source</td>
    <td>Local TypeScript corpus in <code>src/lib/v2-data.ts</code></td>
  </tr>
  <tr>
    <td>Retrieval method</td>
    <td>Deterministic token-overlap baseline</td>
  </tr>
  <tr>
    <td>Generation</td>
    <td>Template-based grounded answer, with optional Mistral polishing</td>
  </tr>
  <tr>
    <td>Guardrails</td>
    <td>Zod validation, evidence-strength refusal, citation marker validation, rate limiting</td>
  </tr>
  <tr>
    <td>Citations</td>
    <td>Answers cite retrieved chunks with markers such as <code>[1]</code></td>
  </tr>
  <tr>
    <td>Unsupported requests</td>
    <td>Refused when indexed evidence is weak or absent</td>
  </tr>
  <tr>
    <td>Reproducibility</td>
    <td>Works locally without provider keys or hosted databases</td>
  </tr>
  <tr>
    <td>Database design</td>
    <td>Postgres/pgvector schema included in <code>migrations/001_v2_core.sql</code></td>
  </tr>
</table>

## 𝙲𝚘𝚛𝚙𝚞𝚜 𝚊𝚗𝚍 𝙴𝚟𝚊𝚕𝚞𝚊𝚝𝚒𝚘𝚗

<ul>
  <li><strong>15</strong> public or official source records</li>
  <li><strong>5</strong> curated methodology notes</li>
  <li><strong>1</strong> inspectable chunk per source record</li>
  <li>Metadata for institution, language, region, topic tags, rights notes, and source URL</li>
</ul>

<p>
The evaluation set contains 10 questions: factual retrieval checks with expected source IDs, refusal checks for unsupported or unsafe requests, and metrics for retrieval quality and response behavior.
</p>

<table>
  <tr>
    <th>Metric</th>
    <th>Value</th>
  </tr>
  <tr>
    <td>Top-3 hit rate</td>
    <td>1.00</td>
  </tr>
  <tr>
    <td>Top-5 hit rate</td>
    <td>1.00</td>
  </tr>
  <tr>
    <td>Refusal pass rate</td>
    <td>1.00</td>
  </tr>
</table>

<p>
These metrics verify the project corpus and refusal rules. They are not presented as broad production accuracy claims.
</p>

## 𝚃𝚎𝚌𝚑 𝚂𝚝𝚊𝚌𝚔

<ul>
  <li><strong>Frontend:</strong> Next.js, React, TypeScript, Tailwind CSS, next-intl</li>
  <li><strong>API:</strong> Next.js route handlers</li>
  <li><strong>Validation:</strong> Zod request schemas</li>
  <li><strong>Retrieval:</strong> Local TypeScript corpus with deterministic token-overlap scoring</li>
  <li><strong>AI:</strong> Optional Mistral polishing after retrieval and citation checks</li>
  <li><strong>Data Design:</strong> Supabase Postgres and pgvector migration schema</li>
  <li><strong>Testing:</strong> TypeScript unit tests, Next.js build checks, browser smoke testing</li>
</ul>

## 𝚀𝚞𝚒𝚌𝚔 𝚂𝚝𝚊𝚛𝚝

<pre><code>npm install
npm run prisma-generate
npm run dev</code></pre>

<p>
Open <code>http://localhost:3000/es</code>.
</p>

<p>
If port 3000 is busy:
</p>

<pre><code>npm run dev -- -p 3001</code></pre>

## 𝙲𝚘𝚗𝚏𝚒𝚐𝚞𝚛𝚊𝚝𝚒𝚘𝚗

<pre><code>copy .env.example .env.local</code></pre>

<table>
  <tr>
    <th>Variable</th>
    <th>Current role</th>
  </tr>
  <tr>
    <td><code>MISTRAL_API_KEY</code></td>
    <td>Enables optional answer polishing after source-grounded retrieval</td>
  </tr>
  <tr>
    <td><code>PINECONE_API_KEY</code></td>
    <td>Reserved for vector-search migration experiments</td>
  </tr>
  <tr>
    <td><code>PINECONE_HOST</code></td>
    <td>Reserved for vector-search migration experiments</td>
  </tr>
</table>

<p>
The deterministic search and evaluation flows work without Mistral or Pinecone credentials.
</p>

## Reproducible Runtime

<pre><code>docker build -t yachaybot .
docker run --rm -p 3000:3000 yachaybot</code></pre>

<p>
The Docker runtime serves the deterministic MVP without optional provider credentials. Mistral, Pinecone, and hosted database variables are reserved for optional or future paths.
</p>

## 𝙰𝙿𝙸 𝙾𝚟𝚎𝚛𝚟𝚒𝚎𝚠

<ul>
  <li><code>GET /api/v1/documents</code>: returns source records and inspectable chunks.</li>
  <li><code>POST /api/v1/search</code>: returns ranked chunks, source metadata, latency, detected language, evidence strength, and an answer preview.</li>
  <li><code>POST /api/v1/answers</code>: generates an answer from reviewed chunks only, or refuses weak evidence.</li>
  <li><code>GET /api/v1/evals/runs</code>: returns the deterministic eval run and metrics.</li>
  <li><code>POST /api/chat</code>: validates chat messages, retrieves from the corpus, builds a cited answer or refusal, and optionally calls Mistral.</li>
</ul>

## 𝙿𝚛𝚘𝚓𝚎𝚌𝚝 𝚂𝚝𝚛𝚞𝚌𝚝𝚞𝚛𝚎

<pre>
.
|-- src/
|   |-- app/                 # Localized pages and API routes
|   |-- components/          # UI components and search experience
|   |-- i18n/                # next-intl routing and request config
|   `-- lib/                 # Corpus, retrieval, schemas, tests, types
|-- docs/                    # Architecture, methodology, limitations, ADRs
|-- public/demo/             # Demo SVGs for review
|-- migrations/              # Postgres/pgvector schema
|-- data/                    # Curated data notes and source metadata placeholder
|-- evals/                   # Evaluation notes
|-- api/                     # FastAPI service boundary notes
|-- web/                     # Frontend boundary notes
`-- prisma/                  # Prisma setup retained for data/client generation
</pre>

## 𝚅𝚊𝚕𝚒𝚍𝚊𝚝𝚒𝚘𝚗

<pre><code>npm run lint
npm run typecheck
npm test
npm run build
npm run validate</code></pre>

<ul>
  <li>TypeScript route and data tests</li>
  <li>Invalid API payload tests</li>
  <li>Search and answer behavior tests</li>
  <li>Mistral citation acceptance and rejection tests</li>
  <li>Auth scope route tests</li>
  <li>Eval run API tests</li>
  <li>Chat rate-limiting tests</li>
  <li>Production Next.js build</li>
  <li>GitHub Actions CI on pull requests and pushes to <code>main</code></li>
</ul>

<p>
To smoke-test public demo routes against a running app:
</p>

<pre><code>npm run build
npm run start
npm run smoke:public</code></pre>

<p>
Set <code>SMOKE_BASE_URL</code> to test a non-default host.
</p>

## 𝚁𝚎𝚌𝚘𝚐𝚗𝚒𝚝𝚒𝚘𝚗

<p>
YachayBot placed third at <strong>INFORTELGRAF Peru Hackathon 2025</strong>. The project is aligned with educational access, responsible AI, and public-interest technology.
</p>

</samp>
