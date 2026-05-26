import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildEvalArtifact } from "../src/lib/v2-eval-artifact";

const retriever = process.env.YACHAYBOT_EVAL_RETRIEVER ?? "deterministic";
const artifact = buildEvalArtifact({ retriever });
const outputDirectory = path.join(process.cwd(), "evals", "runs");
const outputPath = path.join(outputDirectory, `${artifact.id}.json`);

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

async function main() {
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");

  console.log(`Wrote eval artifact: ${path.relative(process.cwd(), outputPath)}`);
}
