# 醫學加油站
Eric Yang 的個人醫學學習書房。圓潤粗體、木質書架、響應式頁面、搜尋、分類，以及可收藏網址的書籍分頁。

## GitHub Pages（首次設定）
1. 開啟 https://github.com/ericyang2001/medical/settings/pages
2. Build and deployment → Source → Deploy from a branch
3. Branch 選 main，資料夾選 /(root)，按 Save。
4. 等待 GitHub Pages 部署完成，網址為 https://ericyang2001.github.io/medical/

後續更新 main 分支後 GitHub Pages 會重新部署。無需 npm 或建置程序。

## 新增教材
在 ChatGPT 上傳教材並要求整理及更新本儲存庫。編輯 catalog.js 的 books 陣列：每本書使用唯一 id，包含 title、subtitle、category、color、tags、sections。section 包含唯一 id、title、html。html 僅限人工審閱的可信內容，不可直接插入訪客輸入。原始檔可放 assets/ 並以相對路徑連結。

網站本身不提供檔案上傳或 AI 整理服務。初始三本書為使用指南，未包含醫學教材。此儲存庫及網站為公開，僅供個人學習使用。

## 更新日期
頁尾使用 GitHub 最新 main 提交時間，顯示 Asia/Taipei 日期。API 不可用時退回 catalog.js 的 updated；每次內容更新也應同步該值。不使用造訪日期冒充更新日期。

## 檔案
- index.html：頁面結構
- styles.css：書架設計、手機排版、字型
- catalog.js：書籍內容
- app.js：搜尋、分類、閱讀路由、日期

字型從 Google Fonts 載入 Zen Maru Gothic 與 Noto Sans TC；無網路時使用裝置備援字型。
