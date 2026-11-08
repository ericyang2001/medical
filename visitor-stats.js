'use strict';
(() => {
 // Anonymous browser counts; no account, IP or auth token is stored by this script.
 if(location.origin!=='https://ericyang2001.github.io')return;
 const API='https://medical-auth-v2-prod.eric20011230.workers.dev/api/visits';
 const key='medical-anonymous-visitor-v1';
 let visitor,store,lastDay='',pending=false;
 try{store=localStorage;visitor=store.getItem(key);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitor||'')){visitor=crypto.randomUUID();store.setItem(key,visitor)}}catch{
  try{store=sessionStorage;visitor=store.getItem(key);if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(visitor||'')){visitor=crypto.randomUUID();store.setItem(key,visitor)}}catch{visitor=crypto.randomUUID();store=null}
 }
 async function record(){
  if(document.visibilityState==='hidden'||pending)return;
  const day=new Date(Date.now()+8*3600000).toISOString().slice(0,10);
  if(day===lastDay)return;
  try{if(store?.getItem(key+'-day')===day){lastDay=day;return}}catch{}
  pending=true;
  try{
   const res=await fetch(API,{method:'POST',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorId:visitor})});
   if(res.ok){lastDay=day;try{store?.setItem(key+'-day',day)}catch{}}
  }catch{}finally{pending=false}
 }
 record();document.addEventListener('visibilitychange',record);window.addEventListener('focus',record);
})();

// Independent page-view totals. The daily unique visitor path above remains compatible.
(() => {
 const base='https://medical-auth-v2-prod.eric20011230.workers.dev/api';
 const official=location.origin==='https://ericyang2001.github.io';
 const emit=data=>{window.medicalAnalyticsTotal=data;window.dispatchEvent(new CustomEvent('medical-analytics-total',{detail:data}));return data};
 window.medicalAnalyticsReady=official?fetch(base+'/analytics/total',{cache:'no-store',credentials:'omit'}).then(async r=>{if(!r.ok)throw Error('統計暫時無法取得');return emit(await r.json())}):Promise.resolve({enabled:false});
 window.medicalAnalyticsReady.catch(()=>{});
 if(!official)return;
 let busy=false,pending=null,retries=0;
 const queueKey='medical-analytics-pending-v2',cooldownKey='medical-analytics-last-attempt-v2';
 async function send(){
  if(busy||!pending)return;busy=true;
  try{
   const r=await fetch(base+'/analytics/views',{method:'POST',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending)});
   if(r.ok){emit(await r.json());pending=null;try{sessionStorage.removeItem(queueKey)}catch{}}
   else if(r.status===409||r.status===400){pending=null;try{sessionStorage.removeItem(queueKey)}catch{}}
   else throw Error('retry');
  }catch{if(retries++<3)setTimeout(send,Math.min(30000,1000*2**retries))}finally{busy=false}
 }
 window.medicalAnalyticsReady.then(async meta=>{
  if(!meta.enabled)return;
  try{pending=JSON.parse(sessionStorage.getItem(queueKey)||'null')}catch{}
  if(pending){await send();return}
  const claim=()=>{
   const now=Date.now();let previous=0,visitor;
   try{previous=Number(localStorage.getItem(cooldownKey));localStorage.setItem(cooldownKey,String(now));visitor=localStorage.getItem('medical-anonymous-visitor-v1')}catch{}
   if(previous>0&&now>=previous&&now-previous<300000)return false;
   if(!/^[0-9a-f-]{36}$/i.test(visitor||'')){try{visitor=sessionStorage.getItem('medical-anonymous-visitor-v1')}catch{}}
   if(!visitor)visitor=crypto.randomUUID();
   // Offset only request freshness using server time; the server assigns the counting date.
   pending={visitorId:visitor,eventId:crypto.randomUUID(),clientAt:meta.serverNow};
   try{sessionStorage.setItem(queueKey,JSON.stringify(pending))}catch{}return true;
  };
  const claimed=navigator.locks?await navigator.locks.request(cooldownKey,claim):claim();
  if(claimed)await send();
 }).catch(()=>{});
 window.addEventListener('online',()=>{retries=0;send()});
})();
