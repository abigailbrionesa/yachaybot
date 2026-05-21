![Screenshot](/public/yachaybot.png)

> **v2 rebuild note:** YachayBot is being rebuilt as a source-grounded AI search system for public Peruvian cultural and educational resources. The v2 architecture separates the Next.js web app, FastAPI backend, source corpus, migrations, evals, and documentation. See [`docs/architecture.md`](docs/architecture.md) and the v2 skeleton directories: [`web/`](web/), [`api/`](api/), [`data/`](data/), [`evals/`](evals/), and [`migrations/`](migrations/).

## YachayBot v2 MVP

The current branch includes a local, inspectable vertical slice for the v2 rebuild:

- search-first homepage
- source cards with metadata, snippets, rights notes, and URLs
- `/sources` browser with filters for language, topic, and source type
- `/api/v1/documents`
- `/api/v1/search`
- `/api/v1/answers`
- `/api/v1/evals/runs`
- `/evals` dashboard for top-3 hit rate, top-5 hit rate, refusal pass rate, and latency

### Local Setup

```bash
npm install
npm run prisma-generate
npm run dev
```

Then open `http://localhost:3000/es`.

### Validation

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The slash-command validation contract also calls `bun run lint`, `bunx tsc --noEmit`, and `bun test`; those require Bun to be installed. This repo does not yet define an `npm test` script.

### API Overview

- `GET /api/v1/documents`: returns source records and inspectable chunks
- `POST /api/v1/search`: accepts `{ "query": "..." }` and returns ranked chunks, latency, language, evidence strength, and a grounded answer preview
- `POST /api/v1/answers`: accepts `{ "query": "..." }` and returns a source-grounded answer with citations or refusal
- `GET /api/v1/evals/runs`: returns the local deterministic eval run

### Documentation

- [Architecture](docs/architecture.md)
- [Methodology](docs/methodology.md)
- [Limitations](docs/limitations.md)
- [Demo script](docs/demo-script.md)
- [Portfolio summary](docs/portfolio-summary.md)

<samp>

<h1>YachayBot - 3rd Place, INFORTELGRAF Perú Hackathon 2025</h1>

<p>
<strong>YachayBot</strong> is an <strong>AI chatbot</strong> dedicated to preserving and democratizing the ancestral knowledge of Peru's Indigenous peoples — a mission aligned with <strong>SDGs 4 (Quality Education), 9 (Innovation), and 10 (Reduced Inequalities)</strong>. 
<br><br>
Built and deployed as a full-stack web application with session-based authentication, it is being rebuilt to support source-grounded search and carefully scoped multilingual interaction.
</p>

* . ﹢ ˖ ✦ ¸ . ﹢ ° ¸. ° ˖ ･ ·̩ ｡ ☆ ﾟ ＊ ¸* . ﹢ ˖ ✦ ¸ . ﹢ ° ¸. ° ˖ ･ ·̩ ｡ ☆ ﾟ ＊ ¸* . ﹢ ˖ ✦ ¸ . ﹢ ° ¸. ° ˖ ･ ·̩ ｡ ☆ ﾟ ＊ ¸* . ﹢ ˖ ✦ ¸ . ﹢ ° ¸. ° ˖ ･ ·̩ ｡ ☆ ﾟ ＊ ¸* . ﹢ ˖ ✦ ¸ . ﹢ ° ¸. ° ˖ ･ ·̩ ｡ ☆ ﾟ 
<h2>𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜</h2>

<ul>
  <li>
    <strong>Evidence-first educational search</strong><br>
    YachayBot v2 is being rebuilt to help users explore public Peruvian cultural and educational resources with visible sources and limitations.
  </li>
  <li>
    <strong>Inspectable retrieval pipeline</strong><br>
    The v2 roadmap separates ingestion, chunking, embeddings, retrieval, source-grounded answers, citations, and evaluation metrics.
  </li>
  <li>
    <strong>Full-stack rebuild</strong><br>
    The existing Next.js demo is being extended with a FastAPI backend, documented data model, migrations, and evaluation workflow.
  </li>
</ul>

<h2>𝙻𝚒𝚟𝚎 𝙳𝚎𝚖𝚘</h2>

<p>
🔗 <a href="https://github.com/abigailbrionesa/yachaybot" target="_blank">Explore on GitHub</a><br>
</p>

<h2>𝚃𝚎𝚌𝚑 𝚂𝚝𝚊𝚌𝚔</h2>

<ul>
  <li><strong>Frontend:</strong> Next.js (React + TypeScript), Tailwind CSS, Next-Intl (i18n)</li>
  <li><strong>Backend:</strong> Supabase (PostgreSQL), Prisma ORM, NextAuth.js</li>
  <li><strong>AI & NLP:</strong> Node.js, LangChain, Hugging Face gte-large, Pinecone Vector DB</li>
</ul>

<h2>𝙰𝚌𝚔𝚗𝚘𝚠𝚕𝚎𝚍𝚐𝚖𝚎𝚗𝚝𝚜</h2>

<p>
Deep thanks to <strong>Alberth Jesús Vigo Saldaña</strong> and <strong>Pierina Ramos</strong> for supporting innovation in Peruvian tech. 
And to the experts who inspire this work — <em>Jeff Barr, Lesly Zerna, Melissa Amado, Narciso Lema, Lennin Cenas Vasquez, and Nicolas Molina Monroy</em> — thank you for openly sharing your wisdom.
</p>

</samp>

