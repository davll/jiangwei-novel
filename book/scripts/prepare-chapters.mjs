import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "../..");
const sourceDir = resolve(rootDir, "chapters");
const outputDir = resolve(rootDir, "book/build");
const chapterPdfDir = resolve(rootDir, "book/output/chapters");
const chapterFilename = /^novel-(?:history-)?chapter-\d{2}\.md$/;
const notesHeading = /^## 改寫註記\s*$/m;

const chapterFiles = (await readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && chapterFilename.test(entry.name))
  .map((entry) => entry.name)
  .sort();

if (chapterFiles.length === 0) {
  throw new Error(`No chapter files found in ${sourceDir}`);
}

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

if (process.env.BOOK_CLEAN_OUTPUT === "1") {
  await rm(chapterPdfDir, { recursive: true, force: true });
}

for (const filename of chapterFiles) {
  const sourcePath = resolve(sourceDir, filename);
  const outputPath = resolve(outputDir, filename);
  const source = await readFile(sourcePath, "utf8");
  const notesIndex = source.search(notesHeading);

  if (notesIndex === -1) {
    throw new Error(`Missing rewrite notes heading in ${sourcePath}`);
  }

  let manuscript = source.slice(0, notesIndex).trimEnd();
  manuscript = manuscript.replace(/\n---\s*$/, "").trimEnd();

  const title = manuscript.match(/^#\s+(.+)$/m)?.[1];
  if (!title) {
    throw new Error(`Missing chapter title in ${sourcePath}`);
  }

  const metadata = [
    "---",
    `title: ${JSON.stringify(title)}`,
    "lang: zh-Hant-TW",
    "---",
    "",
  ].join("\n");

  await writeFile(outputPath, `${metadata}${manuscript}\n`, "utf8");
}

console.log(`Prepared ${chapterFiles.length} chapter manuscripts in ${outputDir}`);
