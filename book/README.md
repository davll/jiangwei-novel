# A5 直排 PDF 建置

本目錄使用 Vivliostyle 將 `chapters/` 內的 Markdown 小說章回轉換成 A5 繁體中文直排 PDF。所有指令都應在專案根目錄執行。

## 環境需求

- Node.js 22.12.0 以上版本。
- npm。

第一次使用時安裝依賴：

```bash
npm install
```

Vivliostyle 第一次建置時可能會自動下載用於產生 PDF 的瀏覽器。樣式優先使用 macOS 內建的 LiSong Pro 與標楷體；其他作業系統建議安裝 Noto Serif CJK TC，否則字型與分頁結果可能不同。

## 產生第一回

```bash
npm run book:sample
```

輸出檔案：

```text
book/output/a5/novel-chapter-01.pdf
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

此指令會先清除 `book/output/a5/` 內既有 PDF，再重新產生全部章回。輸出檔名沿用來源名稱，以區分第三十三回後的兩條路線。

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

指定章回同樣輸出至 `book/output/a5/`。

若出版稿位於其他目錄，可在準備時指定相對於專案根目錄的來源：

```bash
BOOK_SOURCE_DIR=revised-chapters npm run book:prepare
```

## 建置流程

1. `book/scripts/prepare-chapters.mjs` 尋找來源目錄內所有共通／真結局線與史實線章回。
2. 每章保留正文至 `## 改寫註記` 之前，移除出版時不需要的工作註記。
3. 中間稿將 `…` 替換為直排用的 `⋮`，不修改原始章回。
4. 處理後的 Markdown 寫入 `book/build/`。
5. `book/vivliostyle.config.js` 依檔名建立單章或批次建置工作。
6. `book/styles/jiangwei-a5.css` 套用 A5 直排樣式並輸出 PDF。

任何章回缺少回目標題或 `## 改寫註記` 時，準備程序會停止，以免輸出不完整或混入工作資料的 PDF。

## 版型規格

- 成品尺寸：A5，148 × 210mm。
- 閱讀方向：繁體中文直排、右開。
- 正文：10.5pt、行高 1.8 倍、每列 46 字、每頁 17 列。
- 頁面留白：上 22mm、下 17.5mm、內側 19mm、外側 15.5mm。
- 回目 18pt、分節 13pt、詩句 11pt，皆優先使用楷體。
- 第一頁隱藏頁眉與頁碼，其餘頁面顯示頁碼與回目。

目前輸出是裁切後的純內頁 PDF，不含封面、出血、裁切線、拼版或 PDF/X 轉換。

## 產物目錄

以下目錄已由 `.gitignore` 排除，不會提交到 Git：

```text
book/.vivliostyle-a5/
book/build/
book/output/
node_modules/
```

刪除這些目錄不會影響原始章回；執行建置指令即可重新產生。
