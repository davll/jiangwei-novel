# 文庫版 PDF 建置

本目錄使用 Vivliostyle 將 `chapters/` 內的 Markdown 小說章回轉換成 A6 繁體中文直排 PDF。所有指令都應在專案根目錄執行。

## 環境需求

- Node.js 22.12.0 以上版本。
- npm。

第一次使用時安裝依賴：

```bash
npm install
```

Vivliostyle 第一次建置時可能會自動下載用於產生 PDF 的瀏覽器。

目前樣式優先使用 macOS 內建的 LiSong Pro 與標楷體；其他作業系統建議安裝 Noto Serif CJK TC，否則字型與分頁結果可能不同。

## 產生第一回樣張

```bash
npm run book:sample
```

輸出檔案：

```text
book/output/novel-chapter-01-sample.pdf
```

## 預覽第一回

```bash
npm run book:preview
```

此指令會先更新出版中間稿，再啟動 Vivliostyle 互動預覽。

## 產生所有章回

```bash
npm run book:all
```

此指令會先清除 `book/output/chapters/` 內既有的章回 PDF，再重新產生全部檔案。輸出位置為：

```text
book/output/chapters/
```

輸出檔名沿用來源名稱，以區分第三十三回後的兩條路線：

```text
novel-chapter-33.pdf
novel-history-chapter-33.pdf
```

目前完整建置包含：

- 共通／真結局線的 `novel-chapter-01.pdf` 至 `novel-chapter-57.pdf`，共 57 份。
- `novel-history-chapter-33.pdf` 至 `novel-history-chapter-46.pdf`，共 14 份。

## 產生指定章回

先準備所有出版中間稿：

```bash
npm run book:prepare
```

再以不含副檔名的章回檔名指定 `BOOK_CHAPTER`：

```bash
BOOK_CHAPTER=novel-chapter-28 npm run book:build
BOOK_CHAPTER=novel-history-chapter-33 npm run book:build
```

指定章回會輸出到 `book/output/`，並在檔名後加上 `-sample.pdf`。

## 建置流程

1. `book/scripts/prepare-chapters.mjs` 尋找 `chapters/` 內所有共通／真結局線與史實線章回。
2. 每章保留正文至 `## 改寫註記` 之前，移除出版時不需要的工作註記。
3. 處理後的 Markdown 寫入 `book/build/`，不修改原始章回。
4. `book/vivliostyle.config.js` 依檔名建立單章或批次建置工作。
5. `book/styles/jiangwei-bunko.css` 套用文庫版直排樣式並輸出 PDF。

任何章回缺少回目標題或 `## 改寫註記` 時，準備程序會停止，以免輸出不完整或混入工作資料的 PDF。

## 目前版型

- 成品尺寸：A6，105 × 148mm。
- 閱讀方向：繁體中文直排、右開。
- 正文：每列 39 字、每頁 14 列。
- 頁面留白：上 15mm、下 9mm、內側 14mm、外側 10mm。
- 奇數頁顯示頁碼與橫排回目，第一頁隱藏頁眉。
- 正文字體優先使用 LiSong Pro，回目與詩句優先使用標楷體。

目前輸出是裁切後的純內頁 PDF，不含封面、出血、裁切線或 PDF/X 印刷前檢設定。

## 產物目錄

以下目錄已由 `.gitignore` 排除，不會提交到 Git：

```text
book/.vivliostyle/
book/build/
book/output/
node_modules/
```

刪除這些目錄不會影響原始章回；執行建置指令即可重新產生。
