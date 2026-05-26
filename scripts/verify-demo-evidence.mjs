import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const requiredAssets = [
  "public/demo/search-home.svg",
  "public/demo/source-cards.svg",
  "public/demo/sources-filtering.svg",
  "public/demo/eval-dashboard.svg",
];

const requiredDocs = [
  {
    path: "docs/demo-evidence.md",
    references: [...requiredAssets, "scripts/smoke-public.mjs", "npm run smoke:public"],
  },
  {
    path: "docs/demo-script.md",
    references: requiredAssets,
  },
];

for (const asset of requiredAssets) {
  await assertReadable(asset);
}

for (const doc of requiredDocs) {
  await assertReadable(doc.path);
  const content = await readFile(doc.path, "utf8");

  for (const reference of doc.references) {
    if (!content.includes(reference)) {
      throw new Error(`${doc.path} is missing reference: ${reference}`);
    }
  }
}

console.log("Demo evidence verification passed.");

async function assertReadable(path) {
  try {
    await access(path, constants.R_OK);
  } catch {
    throw new Error(`Required demo evidence file is missing or unreadable: ${path}`);
  }
}
