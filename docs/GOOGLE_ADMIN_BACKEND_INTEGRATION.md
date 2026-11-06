# Google 管理員登入 — 已檢查 D1 後端的實作規格（待整合）

> 僅適用於 `feature/google-admin-login` 開發階段。**尚未改動後端、未部署、未替換正式登入**。不得將 Firebase 管理員 UID、ID token 或任何私密金鑰提交至 GitHub。

## 唯讀檢查依據（使用者提供的後端快照）
後端檢查版本：`881be8da8c6300cfbb33b273d5713194447a9e0a`。
Cloudflare Workers + Vinext TypeScript route.ts + D1 綁定 `DB`；Schema 管理由 Drizzle migration 處理。
前端參考：`index.html`、`management.js`。

現有 API：
- `POST /api/login`：PBKDF2-SHA256，100000 次，密碼雜湊比對；限流，同 IP 每 15 分鐘至多 10 次。
- `GET /api/session`：Bear​​er token 的 SHA-256 hash 對比 D1，8 小時過期。
- `GET /api/versions`：公開讀取資料表 `version_records` id=1，沒有認證需求。
- `PUT /api/versions`：需有效 Session，最多 30000 字、revision 樂觀併發檢查、成功回傳 updatedAt。
- `POST /api/logout`：刪除單一 Session hash。
- CORS：允許 `https://ericyang2001.github.io` 和 `http://terminal.local:4173`，自有 API origin 亦接受；**CORS 不代表身分授權**。

D1：
```sql
CREATE TABLE admin_sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE login_limits (
  key TEXT PRIMARY KEY NOT NULL,
  attempts INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE TABLE version_records (
  id INTEGER PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  revision INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);
```

## 安全遷移的建議順序

1. 在原後端專案設定 `FIREBASE_PROJECT_ID`、`FIREBASE_ADMIN_UID`（後端機密或環境設定中，不放前端程式、不要在回應或日誌輸出）。
2. 安裝與 Cloudflare Workers 相容的 JWT 驗證工具，例如 `jose`；由 Google 發布的 Firebase Secure Token JWKS 驗證簽章。可用的 JWKS 位址：
   `https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com`
   固定 `algorithms:['RS256']`、`audience:FIREBASE_PROJECT_ID`、`issuer:https://securetoken.google.com/<project-id>`，且驗證 exp、iat、auth_time 為有效時間及 sub 非空；要求 `payload.firebase.sign_in_provider === 'google.com'`（如果政策限定 Google 來源），以及 `sub === FIREBASE_ADMIN_UID`。
3. 新增 `POST /api/auth/firebase`，接收 `{idToken}`。保留既有 IP 限流，加入實際 body 大小限制、JSON 格式檢查；invalid token 401、已驗證但不是管理員 403、設定缺失 503。不要回傳原始 ID token 或任何敏感認證資料。
4. **先進行 D1 安全 migration**（不要重建或清空資料表）：
   ```sql
   ALTER TABLE admin_sessions ADD COLUMN firebase_uid TEXT;
   ```
   舊 Session 的新欄位為 NULL，不應再允許通過新的 Session 查詢。
5. 驗證登入後，用現有 Session 建立方式產生長度足夠的隨機 token，只儲存 SHA-256 hash，使用新欄位寫入：
   ```sql
   INSERT INTO admin_sessions (token_hash, expires_at, firebase_uid)
   VALUES (?, ?, ?);
   ```
   回傳原有 `{token, expiresAt}`，沿用現有前端會話機制。
6. 受保護 API 使用 `Authorization: Bearer <server session token>`，每次都檢查：
   ```sql
   SELECT expires_at FROM admin_sessions
   WHERE token_hash=? AND expires_at>? AND firebase_uid=?;
   ```
   最後一個參數使用當前後端設定的 `FIREBASE_ADMIN_UID`，禁止舊 NULL Session 或已撤銷 UID 的 Session 繼續登入。依照原有邏輯處理 `/session`、`PUT /versions`、`/logout`。
7. 原本公開 `GET /api/versions`、`version_records` schema、revision 的 SQL、目前編輯內容、更新日期、公開網站其他功能全部保留。
8. 先在隔離測試環境驗證新 endpoint、有效 UID、其他 UID、失效/偽造/跨專案 token、資料儲存與登出。**切換正式系統之前不要停用密碼登入**，防止尚未驗證時失去管理權限；但切換時必須同時停用 `POST /api/login` 並撤銷所有遷移前 Session，避免舊方式被繞過。備份及回滾策略應同時規劃。
9. CORS 更新時請保留已允許來源與 Bearer Authorization；確認 Origin 為精確網址；請求並非有 Origin 才算合法，所有受保護操作仍必須驗證 Session。
10. Google Firebase 登出不會自動撤銷後端 D1 Session；須呼叫 `POST /logout` 刪除後端 Session。必要時提供管理員手動撤銷所有 Session 的管理操作。

## 前端整合（等後端已準備好且通過測試之後）
`index.html` 與 `management.js` 的管理登入框改為 Google 登入，其他部分不重建：
- Web Firebase SDK + 公開的 `firebaseConfig`（僅客戶端設定，絕不放 Admin SDK service account）。
- Firebase `signInWithPopup` 成功後，以 `user.getIdToken()` 呼叫新 `POST /api/auth/firebase`，交換原來格式的 D1 Session。
- **只根據後端回傳的有效 Session 決定管理員 UI**，不可只靠前端 UID/Email 比對。
- `GET /session` 恢復已登入狀態；`PUT /versions`、`GET /versions`、`POST /logout` 保持原有 API 契約。
- 不修改書架、原始教材、ABG 練習、計數、頁尾，測試時保留原手機版響應式樣式。
- GitHub Pages 目前發布 `main`，功能分支的檔案更動不會自動在正式網址出現。

## 測試清單
- [ ] 一般訪客免登入，公開版本紀錄可讀。
- [ ] 指定 UID 的 Firebase ID token 可成功換取後端 Session。
- [ ] 其他 UID 403；無效/過期/不同 Firebase 專案的 token 401。
- [ ] 原有 D1 舊 Session（firebase_uid 為 NULL）無法使用。
- [ ] 不帶 Session 或錯誤 Session 無法 PUT 版本紀錄。
- [ ] 指定管理員能編輯／儲存版本紀錄且 revision 衝突回 409。
- [ ] 登出撤銷 D1 token，原 token 無法再寫入。
- [ ] cutover 之後 POST /login 舊密碼路由不可取得管理 Session。
- [ ] 原本書架、ABG 練習、手機版及更新日期無回歸問題。

參考：
- https://firebase.google.com/docs/auth/admin/verify-id-tokens
- https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
