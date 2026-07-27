import { defineConfig } from "@vivliostyle/cli";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const bookDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(bookDir, "..");

export default defineConfig({
  title: "《三國志姜維傳》第一回樣張",
  language: "zh-Hant-TW",
  readingProgression: "rtl",
  size: "105mm,148mm",
  entryContext: rootDir,
  entry: [
    {
      rel: "contents",
      path: "book/build/novel-chapter-01.md",
      title: "第一回　漢中窺兵識虛實　麒麟縱火試常山",
      pageBreakBefore: "recto",
    },
  ],
  theme: [
    "@vivliostyle/theme-bunko",
    resolve(bookDir, "styles/jiangwei-bunko.css"),
  ],
  workspaceDir: resolve(bookDir, ".vivliostyle"),
  output: {
    path: resolve(bookDir, "output/novel-chapter-01-sample.pdf"),
    format: "pdf",
  },
  timeout: 300000,
});
