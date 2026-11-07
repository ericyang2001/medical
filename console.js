'use strict';
(() => {
 const $ = id => document.getElementById(id);
 let generation = 0, cursor = null, page = 'overview', loading = false;
 const date = value => new Intl.DateTimeFormat('zh-TW', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(value));
 function clearPrivateData() {
  ['console-today','console-week','console-month'].forEach(id => $(id).textContent='—');
  $('console-login-rows').replaceChildren(); $('console-updated').textContent='';
  $('console-daily-chart').replaceChildren(); $('console-chart-note').textContent=''; $('console-chart-range').textContent='近期每日趨勢';
  $('console-more').hidden=true; cursor=null;
 }

 function drawDailyChart(data) {
  const target=$('console-daily-chart'), note=$('console-chart-note');
  target.replaceChildren();note.textContent='';
  const raw=[data.daily,data.dailyVisits,data.dailyCounts,data.dailyVisitors].find(Array.isArray);
  const rows=(raw||[]).map(item=>{
   if(!item||typeof item!=='object')return null;
   const day=String(item.date??item.day??item.dayDate??'');
   const amount=Number(item.count??item.visitors??item.visits??item.total);
   return /^\d{4}-\d{2}-\d{2}$/.test(day)&&Number.isFinite(amount)&&amount>=0?{day,count:Math.floor(amount)}:null;
  }).filter(Boolean).sort((a,b)=>a.day.localeCompare(b.day)).slice(-14);
  if(!rows.length){
   const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
   rows.push({day:today,count:Math.max(0,Number(data.today)||0)});
   note.textContent='目前 API 僅提供今日、週、月總數；圖表先顯示今日實際數值。完整每日趨勢需後端提供每日歷史明細。';
   $('console-chart-range').textContent='今日';
  }else{$('console-chart-range').textContent=rows.length+' 日趨勢';}
  const maximum=Math.max(1,...rows.map(x=>x.count));
  const plot=document.createElement('div');plot.className='console-chart-bars';
  for(const item of rows){
   const column=document.createElement('div');column.className='console-chart-column';
   const value=document.createElement('span');value.className='console-chart-value';value.textContent=item.count.toLocaleString('zh-TW');
   const track=document.createElement('div');track.className='console-chart-track';
   const bar=document.createElement('div');bar.className='console-chart-bar';bar.style.height=(item.count===0?0:Math.max(5,item.count/maximum*100))+'%';
   const caption=document.createElement('span');caption.className='console-chart-day';caption.textContent=item.day.slice(5).replace('-','/');
   column.title=item.day+'：'+item.count+' 人';track.append(bar);column.append(value,track,caption);plot.append(column);
  }
  target.append(plot);
  target.setAttribute('aria-label','每日瀏覽人數：'+rows.map(x=>x.day+' '+x.count+' 人').join('、'));
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
    drawDailyChart(data);
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
