# 醫學加油站 — 專案交接說明

本包由 GitHub `ericyang2001/medical` 的最新 `main` 快照製作，封存日期為 2026-11-05（Asia/Taipei）。
來源 commit：`47ca78d10949d443c5ef9dfa43d230105a95b663`。
正式網站：https://ericyang2001.github.io/medical/
儲存庫：https://github.com/ericyang2001/medical

原始 ZIP 的程式與圖片已通過完整性核對；後續修改記錄如下。原 README 保留於 `docs/README.original.md`。

## 啟動與繼續編輯

解壓縮後進入 `medical/`，執行：

```bash
python3 -m http.server 8000
```

開啟 `http://localhost:8000/`。教材與書架為純 HTML/CSS/JavaScript，沒有 npm 安裝或編譯需求。版本紀錄與管理登入使用獨立後端服務。請優先透過 HTTP 預覽。
ABG 練習網址為 `http://localhost:8000/#book/abg/chapter-17`。

移到新的 ChatGPT 工作時，上傳整個 ZIP，請新工作先閱讀 README.md、CHANGELOG.md、TODO.md，並以現有檔案接續修改，不要重建網站。部署前重新讀取 GitHub main，比較本包 commit，避免覆蓋之後的新修改。ZIP 不含 `.git` 版本歷史或登入憑證；若要推送 GitHub，需使用新工作中的 GitHub 連線。

## 檔案架構

| 路徑 | 功能 |
| --- | --- |
| `index.html` | 首頁、閱讀區、導覽、頁尾與腳本載入；favicon 是內嵌 SVG |
| `styles.css` | 書架、響應式排版、表格、螢光重點、搜尋及練習樣式 |
| `catalog.js` | `window.MEDICAL_LIBRARY`；8 本書、章節 HTML、表格、Reference 與原文詳解 |
| `app.js` | 書架呈現、全文搜尋、hash 路由、章節導覽、按需載入、日期與瀏覽計數 |
| `abg-quiz.js` | ABG 第 17 節四個案例、每案六步選擇題、評分、答案揭露及重做 |
| `calculators.js` | 實驗數據公式計算器，相關分頁開啟時載入 |
| `drug-names.js` | 藥品搜尋資料與查詢介面，開啟藥物分頁時載入 |
| `assets/abg/` | 六張原始 PNG 圖片，檔名與內容完整保留 |
| `.nojekyll` | GitHub Pages 靜態資源設定，部署時保留 |
| `CHANGELOG.md` | 目前完成的功能與已知驗證結果 |
| `TODO.md` | 尚待驗證及移轉後注意事項 |
| `MANIFEST.sha256` | 本包其餘所有檔案的 SHA-256 完整性清單 |

## 現有分頁（順序保持不變）

1. 實驗數據判讀：`lab-interpretation`
2. 藥物：`drug-names`
3. 藥物副作用：`drug-adverse-effects`
4. 症狀處置：`symptom-management`
5. 抗生素入門：`antibiotics-primer`
6. 血糖：`blood-sugar`
7. 輸血：`blood-transfusion`
8. ABG：`abg`

路由使用 `#book/<book-id>` 與 `#book/<book-id>/<section-id>`；請保留既有 ID，避免既有連結失效。教材內容集中在 `catalog.js` 的 `books[].sections[].html`，不應插入未審閱的使用者 HTML。

## ABG 第 17 節的關鍵行為

`catalog.js` 保留四案資料與完整原文詳解；`mountABGQuiz()` 在閱讀頁掛載時將原表單改成連續選擇題。每個案例獨立顯示一題，選擇後按確認才前進。完成六題後顯示得分、錯題正解與原文完整詳解；重新練習會清空答案並隱藏詳解。答案只存在頁面記憶體，重新整理或離開再進入會重設，沒有雲端作答紀錄。

`index.html` 必須先載入 catalog.js、abg-quiz.js，再載入 app.js。請勿只還原舊 catalog.js 表單而遺漏 abg-quiz.js 或 app.js 中的掛載呼叫。現有全文搜尋會排除隱藏詳解，避免搜尋結果提前揭露答案。

## 外部依賴及完整性範圍

所有儲存庫內的程式碼與圖片均已包含。網頁使用 Google Fonts（Noto Sans TC、Zen Maru Gothic），需網路載入；離線時使用既有備援字型。Hits.sh 與 Shields.io 提供瀏覽計數，GitHub API 提供最後更新日期；這些是外部服務，不是可封裝的本機資源，其遠端資料與服務狀態不在 ZIP 內。其他醫學網站的連結保留原樣，外部網站本身不在本包內。

瀏覽計數與 GitHub 日期查詢限定正式 hostname `ericyang2001.github.io`，本機預覽不增加計數。移到不同網域時需按新需求調整，不應在預覽測試中誤累加正式計數。原始教材 PDF 未存放在此網站儲存庫中，因此不包含於本包；網站已整理的全部內容、圖片及參考文獻均保留。

## 部署

既有 GitHub Pages 使用 `main` 分支根目錄。部署時上傳 `medical/` 內的檔案到儲存庫根目錄，保留 assets 及 .nojekyll。更新 JS/CSS 後應同步對應載入網址的版本參數；保留手機左右滑動書架與表格設定。

頁尾保留「製作者：Eric Yang」及「僅供個人學習使用」。醫學內容沿用現有教材；後續修改需核對原始來源。

## 2026/11/05 接續開發

- 全站右下角新增 iOS 玻璃風格回到最上方按鈕，保留當頁作答進度。
- 右上方依序為版本紀錄、回首頁、重新整理、管理者圖示；移除「我的書房」導覽文字。
- `#versions` 為版本紀錄；`management.js` 提供公開閱讀、登入、登出、編輯與儲存。
- 共用版本紀錄 API：`https://medical-version-service.ericccy1230.chatgpt.site/api`。Sites 專案 ID：`appgprj_6aec786a1ddc8191a68a59a485b380d7`。
- 後端來源由該 Sites 專案獨立管理，D1 儲存紀錄及管理 session；此靜態儲存庫不是資料庫備份。
- 管理密碼只在伺服器驗證（PBKDF2-SHA256），不放入 GitHub 或前端程式。環境變數名稱為 ADMIN_PASSWORD_SALT、ADMIN_PASSWORD_HASH。
- 登入 token 保留在當前分頁的 sessionStorage，八小時到期，登出後伺服器撤銷；版本紀錄本身儲存於共用資料庫。
- 每次儲存附帶 revision，防止多視窗舊資料覆蓋；儲存失敗時保留編輯草稿。
- 網域變更須同步後端的 CORS 來源。版本紀錄只顯示純文字，不執行輸入的 HTML。

- 最新樣式調整：右上方三個操作按鈕統一採管理者按鈕的純圖示外觀，不再使用玻璃底色。
