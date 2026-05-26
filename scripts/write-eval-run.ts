import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { documents, runEval } from "../src/lib/v2-data";

const retriever = process.env.YACHAYBOT_EVAL_RETRIEVER ?? "deterministic";
const createdAt = new Date().toISOString();
const run = runEval();
const runId = `${createdAt.slice(0, 10)}-${retriever}-${run.id}`;
const outputDirectory = path.join(process.cwd(), "evals", "runs");
const outputPath = path.join(outputDirectory, `${runId}.json`);

const artifact = {
  id: runId,
  sourceRunId: run.id,
  createdAt,
  retriever,
  corpus: {
    documentCount: documents.length,
  },
  metrics: run.metrics,
  results: run.results,
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

  console.log(`Wrote eval artifact: ${path.relative(process.cwd(), outputPath)}`);
}
