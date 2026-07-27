import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "../..");
const sourcePath = resolve(rootDir, "chapters/novel-chapter-01.md");
const outputPath = resolve(rootDir, "book/build/novel-chapter-01.md");
const notesHeading = /^## 改寫註記\s*$/m;

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

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${metadata}${manuscript}\n`, "utf8");

console.log(`Prepared ${outputPath}`);
