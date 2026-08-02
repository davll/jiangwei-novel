import { defineConfig } from "@vivliostyle/cli";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const bookDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(bookDir, "..");
const buildDir = resolve(bookDir, "build");
const chapterFilename = /^novel-(?:history-)?chapter-\d{2}(?:-[a-z0-9]+)*\.md$/;
const selectedChapter = process.env.BOOK_CHAPTER;

let chapterFiles = readdirSync(buildDir)
  .filter((filename) => chapterFilename.test(filename))
  .sort();

if (chapterFiles.length === 0) {
  throw new Error(`No prepared chapter manuscripts found in ${buildDir}`);
}

if (selectedChapter) {
  const selectedFilename = `${selectedChapter}.md`;
  if (!chapterFiles.includes(selectedFilename)) {
    throw new Error(`Prepared chapter not found: ${selectedFilename}`);
  }
  chapterFiles = [selectedFilename];
}

const tasks = chapterFiles.map((filename) => {
  const slug = filename.slice(0, -3);
  const manuscript = readFileSync(resolve(buildDir, filename), "utf8");
  const title = manuscript.match(/^#\s+(.+)$/m)?.[1];

  if (!title) {
    throw new Error(`Missing chapter title in prepared manuscript: ${filename}`);
  }

  return {
    title: `《三國志姜維傳》${title}`,
    language: "zh-Hant-TW",
    readingProgression: "rtl",
    size: "148mm,210mm",
    entryContext: rootDir,
    entry: [
      {
        rel: "contents",
        path: `book/build/${filename}`,
        title,
        pageBreakBefore: "recto",
      },
    ],
    theme: [
      "@vivliostyle/theme-bunko",
      resolve(bookDir, "styles/jiangwei-a5.css"),
    ],
    workspaceDir: resolve(bookDir, ".vivliostyle-a5"),
    output: {
      path: resolve(bookDir, `output/a5/${slug}.pdf`),
      format: "pdf",
    },
    timeout: 300000,
  };
});

export default defineConfig(tasks);
