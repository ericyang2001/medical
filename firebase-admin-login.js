// 此模組只處理 Firebase Google 身分驗證；是否為管理員以後端核發 Session 為準。
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  initializeAuth, browserSessionPersistence, browserPopupRedirectResolver,
  GoogleAuthProvider, signInWithPopup, signOut
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { firebaseConfig } from './firebase-public-config.js';

const required=['apiKey','authDomain','projectId','appId'];
const hasConfig=required.every(k=>typeof firebaseConfig[k]==='string'&&
  firebaseConfig[k].trim()&&!firebaseConfig[k].startsWith('REPLACE_WITH_'));
let auth=null;
if(hasConfig){
 try{
  const app=initializeApp(firebaseConfig,'medical-admin');
  auth=initializeAuth(app,{
   persistence:browserSessionPersistence,
   popupRedirectResolver:browserPopupRedirectResolver
  });
 }catch{
  // Fail closed: do not enable the admin login button until config is valid.
 }
}
window.firebaseAdminAuth={
 configured:!!auth,
 async signIn(){
  if(!auth)throw new Error('Firebase Web App 尚未正確設定。');
  const provider=new GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});
  const credential=await signInWithPopup(auth,provider);
  // UID and Google provider must be validated by the backend, not the browser.
  return credential.user.getIdToken();
 },
 async signOut(){if(auth)await signOut(auth);}
};
window.dispatchEvent(new Event('firebase-admin-ready'));
