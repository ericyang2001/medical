'use strict';
(() => {
 const $ = id => document.getElementById(id);
 let generation = 0, cursor = null, page = 'overview', loading = false;
 const date = value => new Intl.DateTimeFormat('zh-TW', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(value));
 function clearPrivateData() {
  ['console-today','console-week','console-month'].forEach(id => $(id).textContent='—');
  $('console-login-rows').replaceChildren(); $('console-updated').textContent='';
  $('console-more').hidden=true; cursor=null;
 }
 function updateAccess() {
  generation++; loading=false; clearPrivateData();$('console-refresh').disabled=false;$('console-more').disabled=false;
  const authenticated=window.medicalConsoleAccess?.authenticated();
  $('console-content').hidden=!authenticated;
  $('console-status').textContent=authenticated?'':'請先登入管理者以查看控制台。';
  if(location.hash.startsWith('#console')&&authenticated)load();
 }
 async function load(append=false) {
  if(!window.medicalConsoleAccess?.authenticated())return updateAccess();
  if(loading)return;
  loading=true;const current=++generation,selected=page;
  $('console-refresh').disabled=true;$('console-more').disabled=true;
  $('console-status').textContent='載入中…';
  try {
   const path=selected==='overview'?'/admin/overview':'/admin/login-records'+(append&&cursor?'?before='+cursor:'');
   const data=await window.medicalConsoleAccess.request(path);
   if(current!==generation||!window.medicalConsoleAccess.authenticated())return;
   if(selected==='overview'){
    for(const [id,key] of [['console-today','today'],['console-week','week'],['console-month','month']])$(id).textContent=Number(data[key]||0).toLocaleString('zh-TW');
   }else{
    if(!append)$('console-login-rows').replaceChildren();
    for(const item of data.items){
     const tr=document.createElement('tr');
     for(const value of [date(item.loggedAt),item.ip]){const td=document.createElement('td');td.textContent=value;tr.append(td)}
     $('console-login-rows').append(tr);
    }
    cursor=data.nextCursor;$('console-more').hidden=!cursor;
    if(!$('console-login-rows').children.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=2;td.textContent='尚無登入紀錄（從功能啟用後開始記錄）。';tr.append(td);$('console-login-rows').append(tr)}
   }
   $('console-updated').textContent='最後更新：'+date(data.updatedAt);
   $('console-status').textContent='';
  }catch(error){if(current===generation)$('console-status').textContent=error.message||'載入失敗，請重新整理。'}
  finally{if(current===generation){loading=false;$('console-refresh').disabled=false;$('console-more').disabled=false}}
 }
 window.renderAdminConsole=()=>{
  page=location.hash==='#console/logins'?'logins':'overview';generation++;loading=false;
  $('console-overview').hidden=page!=='overview';$('console-logins').hidden=page!=='logins';
  for(const [id,selected] of [['console-overview-tab',page==='overview'],['console-logins-tab',page==='logins']]){
   $(id).classList.toggle('active',selected);if(selected)$(id).setAttribute('aria-current','page');else $(id).removeAttribute('aria-current');
  }
  updateAccess();
 };
 $('console-refresh').addEventListener('click',()=>load());
 $('console-more').addEventListener('click',()=>load(true));
 window.addEventListener('medical-admin-state',updateAccess);
})();
