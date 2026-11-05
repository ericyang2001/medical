'use strict';
(()=>{
 const API='https://medical-version-service.ericccy1230.chatgpt.site/api';
 const byId=id=>document.getElementById(id);
 let token='',authenticated=false,record=null,editing=false,saving=false,loading=null;
 try{token=sessionStorage.getItem('medical-admin-session')||''}catch{}
 const status=message=>{byId('version-status').textContent=message};
 function authUI(){byId('version-edit').hidden=!authenticated||!record||editing;byId('admin-login').setAttribute('aria-label',authenticated?'管理者帳號':'管理者登入');byId('admin-login').title=authenticated?'管理者帳號':'管理者登入';byId('admin-login').querySelector('.admin-indicator').hidden=!authenticated;byId('admin-form').hidden=authenticated;byId('admin-account').hidden=!authenticated;byId('admin-dialog-title').textContent=authenticated?'管理者帳號':'管理者登入';byId('version-save').disabled=!authenticated||saving}
 function setSession(value){token=value;authenticated=!!value;try{if(value)sessionStorage.setItem('medical-admin-session',value);else sessionStorage.removeItem('medical-admin-session')}catch{}authUI()}
 async function request(path,options={}){let res;try{res=await fetch(API+path,{...options,cache:'no-store',headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{}),...options.headers}})}catch{throw new Error('無法連線，請確認網路後再試。')}let data;try{data=await res.json()}catch{throw new Error('服務暫時無法使用，請稍後再試。')}if(!res.ok){if(res.status===401&&path!=='/login')setSession('');throw new Error(data.error||'操作失敗，請稍後再試。')}return data}
 function draw(){if(!record)return;if(record.updatedAt)window.updateSiteDate?.(record.updatedAt);byId('version-content').textContent=record.content;byId('version-updated').textContent=record.updatedAt?'最後更新：'+new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(record.updatedAt)):'';authUI()}
 async function load(){if(editing)return;if(loading)return loading;byId('version-retry').hidden=true;status('載入中…');loading=(async()=>{try{record=await request('/versions');draw();status('')}catch(e){status(e.message);byId('version-retry').hidden=false}finally{loading=null}})();return loading}
 window.renderVersionHistory=load;
 byId('version-retry').addEventListener('click',load);
 byId('version-edit').addEventListener('click',()=>{if(!authenticated||!record)return;editing=true;byId('version-draft').value=record.content;byId('version-content').hidden=true;byId('version-form').hidden=false;status('');authUI();byId('version-draft').focus()});
 function finishEdit(){editing=false;byId('version-form').hidden=true;byId('version-content').hidden=false;draw()}
 byId('version-cancel').addEventListener('click',()=>{finishEdit();status('已取消編輯。')});
 byId('version-form').addEventListener('submit',async event=>{event.preventDefault();if(saving||!authenticated)return;saving=true;authUI();byId('version-cancel').disabled=true;status('儲存中…');try{record=await request('/versions',{method:'PUT',body:JSON.stringify({content:byId('version-draft').value,revision:record.revision})});finishEdit();status('已儲存，所有訪客皆可查看更新。')}catch(e){status(e.message+' 草稿已保留。')}finally{saving=false;byId('version-cancel').disabled=false;authUI()}});
 byId('admin-login').addEventListener('click',()=>{byId('admin-status').textContent='';authUI();byId('admin-dialog').showModal();if(!authenticated)byId('admin-password').focus()});
 const close=()=>{byId('admin-password').value='';byId('admin-dialog').close()};
 byId('admin-close').addEventListener('click',close);byId('admin-dialog').addEventListener('close',()=>{byId('admin-password').value=''});
 byId('admin-form').addEventListener('submit',async event=>{event.preventDefault();const button=byId('admin-submit');if(button.disabled)return;button.disabled=true;byId('admin-status').textContent='登入中…';const password=byId('admin-password').value;byId('admin-password').value='';try{const result=await request('/login',{method:'POST',body:JSON.stringify({password})});setSession(result.token);close();if(location.hash==='#versions')status('已登入管理者。')}catch(e){byId('admin-status').textContent=e.message}finally{button.disabled=false}});
 byId('admin-logout').addEventListener('click',async()=>{const button=byId('admin-logout');button.disabled=true;try{await request('/logout',{method:'POST'});setSession('');if(editing)finishEdit();close();if(location.hash==='#versions')status('已登出管理者。')}catch(e){byId('admin-status').textContent=e.message}finally{button.disabled=false}});
 window.addEventListener('beforeunload',event=>{if(editing&&byId('version-draft').value!==record?.content){event.preventDefault();event.returnValue=''}});
 load();
 authUI();if(token)request('/session').then(()=>{authenticated=true;authUI()}).catch(()=>{authenticated=false;authUI()});
})();
