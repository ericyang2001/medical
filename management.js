'use strict';
(()=>{
 const API='https://medical-version-service.ericccy1230.chatgpt.site/api';
 const byId=id=>document.getElementById(id);
 let token='',authenticated=false,record=null,editing=false,saving=false,loading=null;
 try{token=sessionStorage.getItem('medical-firebase-admin-session-v1')||''}catch{}
 const status=message=>{byId('version-status').textContent=message};
 function authUI(){byId('version-edit').hidden=!authenticated||!record||editing;byId('admin-login').setAttribute('aria-label',authenticated?'管理者帳號':'管理者登入');byId('admin-login').title=authenticated?'管理者帳號':'管理者登入';byId('admin-login').querySelector('.admin-indicator').hidden=!authenticated;byId('admin-form').hidden=authenticated;byId('admin-account').hidden=!authenticated;byId('admin-dialog-title').textContent=authenticated?'管理者帳號':'管理者登入';byId('version-save').disabled=!authenticated||saving}
 function setSession(value){token=value;authenticated=!!value;try{if(value)sessionStorage.setItem('medical-firebase-admin-session-v1',value);else sessionStorage.removeItem('medical-firebase-admin-session-v1')}catch{}authUI()}
 async function request(path,options={}){let res;try{res=await fetch(API+path,{...options,cache:'no-store',headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{}),...options.headers}})}catch{throw new Error('無法連線，請確認網路後再試。')}let data;try{data=await res.json()}catch{throw new Error('服務暫時無法使用，請稍後再試。')}if(!res.ok){if(res.status===401&&path!=='/auth/firebase')setSession('');throw new Error(data.error||'操作失敗，請稍後再試。')}return data}
 function draw(){if(!record)return;if(record.updatedAt)window.updateSiteDate?.(record.updatedAt);byId('version-content').textContent=record.content;byId('version-updated').textContent=record.updatedAt?'最後更新：'+new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(record.updatedAt)):'';authUI()}
 async function load(){if(editing)return;if(loading)return loading;byId('version-retry').hidden=true;status('載入中…');loading=(async()=>{try{record=await request('/versions');draw();status('')}catch(e){status(e.message);byId('version-retry').hidden=false}finally{loading=null}})();return loading}
 window.renderVersionHistory=load;
 byId('version-retry').addEventListener('click',load);
 byId('version-edit').addEventListener('click',()=>{if(!authenticated||!record)return;editing=true;byId('version-draft').value=record.content;byId('version-content').hidden=true;byId('version-form').hidden=false;status('');authUI();byId('version-draft').focus()});
 function finishEdit(){editing=false;byId('version-form').hidden=true;byId('version-content').hidden=false;draw()}
 byId('version-cancel').addEventListener('click',()=>{finishEdit();status('已取消編輯。')});
 byId('version-form').addEventListener('submit',async event=>{event.preventDefault();if(saving||!authenticated)return;saving=true;authUI();byId('version-cancel').disabled=true;status('儲存中…');try{record=await request('/versions',{method:'PUT',body:JSON.stringify({content:byId('version-draft').value,revision:record.revision})});finishEdit();status('已儲存，所有訪客皆可查看更新。')}catch(e){status(e.message+' 草稿已保留。')}finally{saving=false;byId('version-cancel').disabled=false;authUI()}});

 const googleButton=byId('admin-google-login');
 const authBridge=()=>window.firebaseAdminAuth;
 function syncGoogleButton(){
  googleButton.disabled=!authBridge()?.configured;
  if(!authBridge()?.configured)byId('admin-status').textContent='Google 登入尚未設定完成，請先在開發分支填寫 Firebase Web 設定。';
  else if(byId('admin-status').textContent.startsWith('Google 登入尚未設定'))byId('admin-status').textContent='';
 }
 window.addEventListener('firebase-admin-ready',syncGoogleButton);
 byId('admin-login').addEventListener('click',()=>{
  byId('admin-status').textContent='';
  authUI();
  byId('admin-dialog').showModal();
  syncGoogleButton();
  if(!googleButton.disabled)googleButton.focus();
 });
 const close=()=>byId('admin-dialog').close();
 byId('admin-close').addEventListener('click',close);
 googleButton.addEventListener('click',async()=>{
  if(googleButton.disabled||!authBridge()?.configured)return;
  googleButton.disabled=true;
  byId('admin-status').textContent='正在驗證 Google 帳號…';
  try{
   const idToken=await authBridge().signIn();
   // Do not send any stale legacy password session with Firebase login.
   setSession('');
   const result=await request('/auth/firebase',{method:'POST',body:JSON.stringify({idToken})});
   if(typeof result.token!=='string'||!result.token)throw new Error('後端未回傳有效管理員 Session。');
   setSession(result.token);
   close();
   if(location.hash==='#versions')status('已登入管理者。');
  }catch(e){
   try{await authBridge()?.signOut()}catch{}
   byId('admin-status').textContent=e?.code==='auth/popup-closed-by-user'
    ?'登入視窗已關閉，請重新嘗試。'
    :e?.code==='auth/popup-blocked'
     ?'瀏覽器封鎖了登入視窗，請允許彈出視窗後重試。'
     :e?.message||'登入失敗，請重新嘗試。';
  }finally{syncGoogleButton();}
 });
 byId('admin-logout').addEventListener('click',async()=>{const button=byId('admin-logout');button.disabled=true;try{await request('/logout',{method:'POST'});setSession('');try{await authBridge()?.signOut()}catch{}if(editing)finishEdit();close();if(location.hash==='#versions')status('已登出管理者。')}catch(e){byId('admin-status').textContent=e.message}finally{button.disabled=false}});
 window.addEventListener('beforeunload',event=>{if(editing&&byId('version-draft').value!==record?.content){event.preventDefault();event.returnValue=''}});
 load();
 authUI();if(token)request('/session').then(()=>{authenticated=true;authUI()}).catch(()=>{setSession('')});
})();
