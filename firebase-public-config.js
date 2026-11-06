// Firebase 網頁應用程式公開設定（不是 Admin SDK 私密金鑰）。
// 在功能分支上以 Firebase Console > Project settings > Your apps > Config 的
// 實際資料取代 REPLACE_WITH_*；勿填入 Service Account 私鑰／OAuth Client Secret。
// 目前為安全的未設定範本，設定前 Google 管理員登入按鈕會停用。
export const firebaseConfig = {
  apiKey: 'REPLACE_WITH_API_KEY',
  authDomain: 'REPLACE_WITH_AUTH_DOMAIN',
  projectId: 'REPLACE_WITH_PROJECT_ID',
  appId: 'REPLACE_WITH_APP_ID',
  messagingSenderId: 'REPLACE_WITH_SENDER_ID',
  storageBucket: 'REPLACE_WITH_STORAGE_BUCKET'
};
