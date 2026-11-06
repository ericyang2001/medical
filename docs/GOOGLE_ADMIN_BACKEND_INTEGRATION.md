# Google 管理員登入 — 後端安全整合規格（尚未部署）

## 狀態
- 目標分支：`feature/google-admin-login`
- 目前僅完成 GitHub 前端程式檢查，**未修改正式前端或後端、未完成登入整合**。
- 本檔不包含 Firebase UID、projectId、密碼或 Token；請勿將私密憑證提交至 GitHub。

## 已確認的現有架構
前端 `management.js` 呼叫 `https://medical-version-service.ericccy1230.chatgpt.site/api`：
- `GET /versions`：所有訪客可讀取版本紀錄。
- `POST /login`：現行管理密碼登入，成功後回傳 `{token}`。
- `GET /session`：驗證管理 Session。
- `PUT /versions`：持有效管理 Session 更新版本紀錄，使用 `revision` 防止覆寫。
- `POST /logout`：撤銷管理 Session。

GitHub README 記載獨立 Sites 後端持有 D1、Session 及密碼驗證實作；**後端原始碼不在 GitHub 專案內**，不可只靠修改靜態前端完成安全遷移。Firestore 規則不會自動保護這個獨立 API。

## 後端修改（須在原 Sites 後端專案執行）
1. 在後端環境變數設定 `FIREBASE_PROJECT_ID`、`FIREBASE_ADMIN_UID`（實際值只放在後端，不放到前端檢查作為安全依據）。
2. 新增 `POST /api/auth/firebase`，只接受 HTTPS JSON `{ "idToken": "<Firebase ID token>" }`；限制請求大小、建立失敗時回傳 401/403。
3. 以 Firebase Admin SDK 或正確的 JWT 驗證函式庫，在**後端**完整驗證 ID token 簽章、`alg=RS256`、`kid`、`aud=FIREBASE_PROJECT_ID`、`iss=https://securetoken.google.com/FIREBASE_PROJECT_ID`、`exp`、`iat`、`auth_time`、`sub` 等必要欄位，然後檢查 `sub/uid === FIREBASE_ADMIN_UID`。嚴禁只解碼 JWT payload 後比對 UID。
4. 驗證通過後，**沿用原本後端生成與驗證 Session 的方法**，回傳 `{ "token": "<existing server session>" }`；不需變更既有版本紀錄表／修訂衝突機制。
5. `PUT /api/versions`、`GET /api/session`、`POST /api/logout` 必須強制驗證有效 Session；`GET /api/versions` 維持公開。
6. 如有其他管理寫入 API，逐項檢查權限。CORS 僅允許預期網站來源與必要 header/method，但**CORS 不等於授權**，所有受保護 API 仍須驗證 Session。
7. 遷移驗證通過後，停用舊 `POST /api/login` 密碼路由（不只是隱藏按鈕），必要時撤銷舊 Session，避免繞過 Google 限制；確認登入後台僅接受指定 Google UID。
8. 不在日誌、網址、GitHub、HTML 或可公開讀取的資料庫紀錄中保存完整 ID token、管理 Session、service account 金鑰。

## 前端修改（後端已可測試才實作）
- 註冊 Firebase Web SDK（使用既有 `firebaseConfig`，屬公開客戶端設定）。
- `index.html` 管理對話框改為「使用 Google 帳號登入」，保留現有樣式及管理員狀態 UI。
- `signInWithPopup(auth, new GoogleAuthProvider())` 成功後，從 `user.getIdToken()` 取得 Firebase ID token，`POST /auth/firebase` 換取**原本後端 Session token**，沿用 `management.js` 現有會話與 `request()` 邏輯。
- 未獲得原後端 Session 前，禁止前端視為管理員，也不得顯示版本紀錄編輯權限。
- 登出時先撤銷後端 Session，再處理 Firebase signOut／本機 UI 狀態；要處理 API 失敗、重新整理及多分頁情況。
- 確保 `index.html`、`management.js` 前端更動只在功能分支測試，暫不合併到 `main`。

## 端到端測試（上線條件）
- [ ] 不登入可公開瀏覽書架與 `GET /versions`
- [ ] 指定 UID 可以換取有效後端管理 Session
- [ ] 另一個有效 Firebase 使用者的 ID token 必須 403
- [ ] 無效、過期、簽章錯誤、其他 Firebase project 的 token 必須 401
- [ ] 不帶 Session 直接 `PUT /versions` 必須拒絕
- [ ] 指定管理員可以成功編輯、儲存版本紀錄，修訂版本衝突保護仍有效
- [ ] 登出後原 Session 無法再寫入
- [ ] 停用舊密碼 API 後，無法再藉舊密碼／舊 Session 取得權限
- [ ] 現有教材、ABG 練習、瀏覽計數、手機版介面沒有回歸問題

## 下一步需要的存取
請在原本的 Sites 後端專案找到 `/api/login`、`/api/session`、`/api/versions`、`/api/logout` 的伺服器程式，以及建 Session、驗 Session 的函式。這個 GitHub Repo 不含那些檔案。可在能編輯原 Sites 專案的工作中套用本規格，或安全地提供**移除密碼/金鑰後的**後端原始碼，以便做確切修改。

參考：https://firebase.google.com/docs/auth/admin/verify-id-tokens
