'use strict';
(() => {
 const $ = id => document.getElementById(id);
 let generation = 0, cursor = null, page = 'overview', loading = false, chartMode='views', chartData=null, serverOffset=0, renderedDay='';
 const date = value => new Intl.DateTimeFormat('zh-TW', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(value));
 function clearPrivateData() {
  ['console-today','console-week','console-month','console-views-today','console-views-week','console-views-month','console-total'].forEach(id => $(id).textContent='—');
  chartData=null;$('console-total-start').textContent='';for(const key of ['today','week','month'])$('console-date-'+key).textContent='';
  $('console-login-rows').replaceChildren(); $('console-updated').textContent='';
  $('console-daily-chart').replaceChildren(); $('console-chart-note').textContent=''; $('console-chart-range').textContent='近期每日趨勢';
  $('console-more').hidden=true; cursor=null;
 }

 function showTotal(data){
  $('console-total').textContent=Number.isSafeInteger(data.total)&&data.total>=0?data.total.toLocaleString('zh-TW'):'暫時無法取得';
  $('console-total-start').textContent=data.startedAt?'自 '+new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(data.startedAt))+' 起累加':'等待首筆有效瀏覽';
 }
 function showDates(now){
  const d=new Date(now+8*3600000), day=d.toISOString().slice(0,10);renderedDay=day;
  const monday=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-(d.getUTCDay()+6)%7));
  const sunday=new Date(monday.getTime()+6*86400000),md=x=>x.toISOString().slice(5,10).replace('-','/');
  $('console-date-today').textContent=day.replaceAll('-','/');$('console-date-week').textContent=md(monday)+'－'+md(sunday);$('console-date-month').textContent=day.slice(0,7).replace('-','/');
 }
 function drawDailyChart(data) {
  const target=$('console-daily-chart'), note=$('console-chart-note');
  target.replaceChildren();
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Number(data.serverNow)||Date.now()));
  const end=Date.parse(today+'T00:00:00Z');
  const values=new Map();
  const series=Array.isArray(data.dailyMetrics)?data.dailyMetrics.map(r=>({date:r.date,count:r[chartMode]})):chartMode==='visitors'&&Array.isArray(data.daily)?data.daily:[];
  for(const item of series){
   if(item&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)&&typeof item.count==='number'&&Number.isInteger(item.count)&&item.count>=0)values.set(item.date,item.count);
  }
  if(chartMode==='visitors'&&!Array.isArray(data.daily)&&typeof data.today==='number')values.set(today,data.today);
  const rows=Array.from({length:7},(_,i)=>{const day=new Date(end-(6-i)*86400000).toISOString().slice(0,10);return {day,count:values.get(day)??null}});
  $('console-chart-title').textContent=chartMode==='views'?'每日瀏覽人次':'每日瀏覽人數';
  $('console-chart-range').textContent=rows[0].day.slice(5).replace('-','/')+'－'+today.slice(5).replace('-','/');
  for(const mode of ['views','visitors'])$('console-chart-'+mode).setAttribute('aria-pressed',String(mode===chartMode));
  note.textContent=rows.some(r=>r.count===null)?'— 表示無資料。':'';if(chartMode==='views'&&data.dailyMetrics?.some(r=>r.viewsPartial))note.textContent+=' 啟用當日僅含啟用後的人次。';
  const ns='http://www.w3.org/2000/svg', svg=document.createElementNS(ns,'svg');
  const mobile=window.matchMedia?.('(max-width:600px)').matches===true, width=mobile?Math.max(240,target.clientWidth||300):630;
  svg.setAttribute('viewBox',`0 0 ${width} 240`);svg.style.width='100%';svg.style.height='auto';svg.setAttribute('class','console-line-chart');svg.setAttribute('role','img');
  svg.setAttribute('aria-label',(chartMode==='views'?'最近七日瀏覽人次：':'最近七日瀏覽人數：')+rows.map(r=>r.day+' '+(r.count===null?'無紀錄':r.count+(chartMode==='views'?' 次':' 人'))).join('、'));
  function el(tag,attrs,text){const n=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));if(text!==undefined)n.textContent=text;svg.append(n);return n}
  const max=Math.max(1,...rows.map(r=>r.count??0));
  const label=n=>mobile?new Intl.NumberFormat('zh-TW',{notation:'compact',maximumFractionDigits:1}).format(n):String(n);
  const left=mobile?Math.max(40,label(max).length*13+8):45, right=mobile?width-20:585;
  const x=i=>left+i*(right-left)/6,y=n=>180-n/max*(mobile?125:140);
  for(const n of [0,max]){el('line',{x1:left-5,x2:mobile?right+5:590,y1:y(n),y2:y(n),stroke:'#d7dece'});el('text',{x:left-11,y:y(n)+4,'text-anchor':'end','font-size':mobile?13:11,fill:'currentColor'},label(n))}
  let previous=null;
  rows.forEach((r,i)=>{
   if(!mobile||i%2===0)el('text',{x:x(i),y:218,'text-anchor':'middle','font-size':mobile?13:12,fill:'currentColor'},r.day.slice(5).replace('-','/'));
   if(r.count===null){el('text',{x:x(i),y:174,'text-anchor':'middle',fill:'currentColor'},'—');previous=null;return}
   const point={x:x(i),y:y(r.count)};
   if(previous)el('line',{x1:previous.x,y1:previous.y,x2:point.x,y2:point.y,stroke:'#34594d','stroke-width':3});
   const dot=el('circle',{cx:point.x,cy:point.y,r:4,fill:'#34594d'});
   const title=document.createElementNS(ns,'title');title.textContent=r.day+'：'+r.count+(chartMode==='views'?' 次':' 人');dot.append(title);
   el('text',{x:point.x,y:point.y-(mobile&&i%2?32:12),'text-anchor':mobile&&i===0?'start':mobile&&i===6?'end':'middle','font-size':12,fill:'currentColor'},label(r.count));previous=point;
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
    chartData=data;serverOffset=(Number(data.serverNow)||Date.now())-Date.now();showDates(Date.now()+serverOffset);
    if(data.enabled===true&&window.medicalPublishAnalyticsTotal)showTotal(window.medicalPublishAnalyticsTotal(data));
    else showTotal(window.medicalAnalyticsTotal||data);
    for(const [key,kind] of [['today','day'],['week','week'],['month','month']]){const v=data.periods?.[kind]?.views;$('console-views-'+key).textContent=Number.isSafeInteger(v)?v.toLocaleString('zh-TW'):'—';$('console-views-'+key).title=data.periods?.[kind]?.viewsPartial?'此期間僅含新統計啟用後的人次':''}
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
 for(const mode of ['views','visitors'])$('console-chart-'+mode).addEventListener('click',()=>{chartMode=mode;if(chartData)drawDailyChart(chartData)});
 window.addEventListener('medical-analytics-total',e=>{if(window.medicalConsoleAccess?.authenticated())showTotal(e.detail)});
 window.addEventListener('medical-analytics-error',()=>{if(window.medicalConsoleAccess?.authenticated())$('console-total').textContent='暫時無法取得'});
 window.addEventListener('resize',()=>{if(chartData)drawDailyChart(chartData)});
 function rollover(){if(!document.hidden&&page==='overview'&&location.hash.startsWith('#console')&&window.medicalConsoleAccess?.authenticated()&&new Date(Date.now()+serverOffset+8*3600000).toISOString().slice(0,10)!==renderedDay)load()}
 document.addEventListener('visibilitychange',rollover);setInterval(rollover,60000);
})();
