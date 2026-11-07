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
