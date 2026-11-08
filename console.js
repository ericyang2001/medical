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
  target.replaceChildren();
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const end=Date.parse(today+'T00:00:00Z');
  const values=new Map();
  for(const item of Array.isArray(data.daily)?data.daily:[]){
   if(item&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)&&typeof item.count==='number'&&Number.isInteger(item.count)&&item.count>=0)values.set(item.date,item.count);
  }
  if(!Array.isArray(data.daily)&&typeof data.today==='number')values.set(today,data.today);
  const rows=Array.from({length:7},(_,i)=>{const day=new Date(end-(6-i)*86400000).toISOString().slice(0,10);return {day,count:values.get(day)??null}});
  $('console-chart-range').textContent='最近 7 日（含今日）';
  note.textContent=rows.some(r=>r.count===null)?'無紀錄的日期顯示「—」，不視為 0 人；統計從追蹤功能啟用後開始累積。':'依臺灣日期統計，每日以瀏覽器識別去重。';
  const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 630 240');svg.style.width='100%';svg.style.height='auto';svg.setAttribute('class','console-line-chart');svg.setAttribute('role','img');
  svg.setAttribute('aria-label','最近七日瀏覽人數：'+rows.map(r=>r.day+' '+(r.count===null?'無紀錄':r.count+' 人')).join('、'));
  function el(tag,attrs,text){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;svg.append(n);return n}
  const max=Math.max(1,...rows.map(r=>r.count??0)),x=i=>45+i*90,y=n=>180-n/max*140;
  for(const n of [0,max]){el('line',{x1:40,x2:590,y1:y(n),y2:y(n),stroke:'#d7dece'});el('text',{x:34,y:y(n)+4,'text-anchor':'end','font-size':11,fill:'currentColor'},String(n))}
  let previous=null;
  rows.forEach((r,i)=>{
   el('text',{x:x(i),y:218,'text-anchor':'middle','font-size':12,fill:'currentColor'},r.day.slice(5).replace('-','/'));
   if(r.count===null){el('text',{x:x(i),y:174,'text-anchor':'middle',fill:'currentColor'},'—');previous=null;return}
   const point={x:x(i),y:y(r.count)};
   if(previous)el('line',{x1:previous.x,y1:previous.y,x2:point.x,y2:point.y,stroke:'#34594d','stroke-width':3});
   const dot=el('circle',{cx:point.x,cy:point.y,r:4,fill:'#34594d'});
   const title=document.createElementNS(ns,'title');title.textContent=r.day+'：'+r.count+' 人';dot.append(title);
   el('text',{x:point.x,y:point.y-12,'text-anchor':'middle','font-size':12,fill:'currentColor'},String(r.count));previous=point;
  });
  target.append(svg);
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
