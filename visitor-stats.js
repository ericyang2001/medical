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
 // One in-memory public snapshot for footer, console and other open tabs.
 // Never persist totals as an authoritative counter, and never POST during refresh.
 let snapshot=null,revision=0,refreshing=null,channel=null;
 const valid=data=>data?.enabled===true&&Number.isSafeInteger(data.total)&&data.total>=0;
 const notify=()=>window.dispatchEvent(new CustomEvent('medical-analytics-total',{detail:snapshot}));
 function publish(data,broadcast=true){
  if(!valid(data))throw Error('統計暫時無法取得');
  const next={enabled:true,total:data.total,startedAt:data.startedAt??null,epochId:data.epochId??null,serverNow:Number(data.serverNow)||0};
  if(snapshot){
   if(snapshot.epochId!==null&&next.epochId===null){notify();return snapshot;}
   const sameEpoch=next.epochId===snapshot.epochId&&next.startedAt===snapshot.startedAt;
   // Within one epoch totals cannot fall, even if request start times race with writes.
   if(sameEpoch?next.total<snapshot.total||next.total===snapshot.total&&next.serverNow<snapshot.serverNow:next.serverNow<snapshot.serverNow){notify();return snapshot;}
   if(sameEpoch)next.serverNow=Math.max(next.serverNow,snapshot.serverNow);
  }
  snapshot=next;revision++;window.medicalAnalyticsTotal=snapshot;notify();
  if(broadcast)try{channel?.postMessage(snapshot)}catch{}
  return snapshot;
 }
 window.medicalPublishAnalyticsTotal=publish;
 async function refresh(){
  if(refreshing)return refreshing;
  const before=revision,controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  refreshing=(async()=>{
   try{
    const r=await fetch(base+'/analytics/total',{cache:'no-store',credentials:'omit',signal:controller.signal});
    if(!r.ok)throw Error('統計暫時無法取得');
    const data=await r.json();
    if(data.enabled===false&&!snapshot)return data;
    return publish(data);
   }catch(error){
    // A failed older GET must not hide a more recent successful update.
    if(revision===before)window.dispatchEvent(new Event('medical-analytics-error'));
    throw error;
   }finally{clearTimeout(timeout);refreshing=null;}
  })();
  return refreshing;
 }
 window.medicalRefreshAnalyticsTotal=refresh;
 if(official&&typeof BroadcastChannel==='function')try{
  channel=new BroadcastChannel('medical-analytics-total-v2');
  channel.onmessage=e=>{if(valid(e.data))publish(e.data,false)};
 }catch{}
 window.medicalAnalyticsReady=official?refresh():Promise.resolve({enabled:false});
 window.medicalAnalyticsReady.catch(()=>{});
 const refreshVisible=()=>{if(official&&!document.hidden)refresh().catch(()=>{})};
 if(official){
  window.addEventListener('focus',refreshVisible);
  window.addEventListener('pageshow',e=>{if(e.persisted)refreshVisible()});
  document.addEventListener('visibilitychange',refreshVisible);
  // Also catches other devices, or browsers without BroadcastChannel support.
  setInterval(refreshVisible,60000);
 }
 if(!official)return;
 let busy=false,pending=null,retries=0;
 const queueKey='medical-analytics-pending-v2',cooldownKey='medical-analytics-last-attempt-v2';
 async function send(){
  if(busy||!pending)return;busy=true;
  try{
   const r=await fetch(base+'/analytics/views',{method:'POST',credentials:'omit',redirect:'error',headers:{'Content-Type':'application/json'},body:JSON.stringify(pending)});
   if(r.ok){publish(await r.json());pending=null;try{sessionStorage.removeItem(queueKey)}catch{}}
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
