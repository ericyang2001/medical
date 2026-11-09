import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8'),pause=()=>new Promise(r=>setTimeout(r,25));
const now=Date.parse('2026-11-09T00:15:00+08:00');
const payload=(total,time=now)=>({enabled:true,total,serverNow:time,startedAt:now-86400000,epochId:1,today:2,week:3,month:4,updatedAt:new Date(time).toISOString(),periods:{day:{views:3},week:{views:4},month:{views:5}},dailyMetrics:Array.from({length:7},(_,i)=>({date:`2026-11-${String(i+3).padStart(2,'0')}`,views:i,visitors:i}))});
function setup(t,{storage=new Map(),channel,locks,allowView=false}={}){
 const dom=new JSDOM(read('index.html'),{url:'https://ericyang2001.github.io/medical/#console',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document;
 t.after(()=>w.close());let total=12,active=true,fail=false;const calls=[];
 storage.set('medical-anonymous-visitor-v1','11111111-1111-4111-8111-111111111111');
 if(!allowView)storage.set('medical-analytics-last-attempt-v2',String(Date.now()));
 Object.defineProperty(w,'localStorage',{value:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});
 if(channel)w.BroadcastChannel=channel;if(locks)Object.defineProperty(w.navigator,'locks',{value:locks});
 const response=()=>({ok:true,json:async()=>payload(total)});
 w.fetch=async(url,options={})=>{calls.push({url:String(url),method:options.method||'GET',options});if(fail)throw Error('offline');if(String(url).endsWith('/analytics/views'))total++;return response()};
 w.medicalConsoleAccess={authenticated:()=>active,request:async()=>{calls.push({url:'/admin/overview',method:'GET'});return payload(total)}};
 w.eval(read('visitor-stats.js'));w.eval(read('console.js'));
 const source=read('app.js'),start=source.indexOf('(async function initViewCounter()');w.eval(source.slice(start,source.indexOf('\n})();',start)+6));
 w.renderAdminConsole();
 return {w,d,calls,setTotal:n=>{total=n},setFail:v=>{fail=v},setActive:v=>{active=v},numbers:()=>[d.getElementById('console-total').textContent,d.getElementById('visit-counter-value').textContent]};
}
test('console refresh and re-entry update both totals using GET only; logout preserves footer',async t=>{
 const x=setup(t);await pause();assert.deepEqual(x.numbers(),['12','12']);
 x.setTotal(13);x.d.getElementById('console-refresh').click();await pause();assert.deepEqual(x.numbers(),['13','13']);
 x.setTotal(14);x.w.renderAdminConsole();await pause();assert.deepEqual(x.numbers(),['14','14']);
 assert.equal(x.calls.filter(c=>c.url.endsWith('/analytics/views')).length,0);
 x.setActive(false);x.w.dispatchEvent(new x.w.Event('medical-admin-state'));assert.equal(x.d.getElementById('visit-counter-value').textContent,'14');
 x.setActive(true);x.w.dispatchEvent(new x.w.Event('medical-admin-state'));await pause();assert.deepEqual(x.numbers(),['14','14']);
});
test('late older GET cannot overwrite an accepted view; higher totals survive earlier request time',async t=>{
 const x=setup(t);await pause();let resolve;
 x.w.fetch=()=>new Promise(r=>{resolve=r});const pending=x.w.medicalRefreshAnalyticsTotal();
 x.w.medicalPublishAnalyticsTotal(payload(14,now+10));
 resolve({ok:true,json:async()=>payload(13,now+20)});await pending;assert.deepEqual(x.numbers(),['14','14']);
 x.w.medicalPublishAnalyticsTotal(payload(15,now+5));assert.deepEqual(x.numbers(),['15','15']);
 x.w.medicalPublishAnalyticsTotal({...payload(0,now+20),epochId:null,startedAt:null});assert.deepEqual(x.numbers(),['15','15']);
});
test('read failure is unavailable, never zero; recovery updates both and malformed total is rejected',async t=>{
 const x=setup(t);await pause();x.setFail(true);await assert.rejects(x.w.medicalRefreshAnalyticsTotal());
 assert.deepEqual(x.numbers(),['暫時無法取得','暫時無法取得']);
 x.setFail(false);x.setTotal(13);await x.w.medicalRefreshAnalyticsTotal();assert.deepEqual(x.numbers(),['13','13']);
 for(const value of [null,undefined,-1,'0',NaN])assert.throws(()=>x.w.medicalPublishAnalyticsTotal(payload(value)));
 assert.deepEqual(x.numbers(),['13','13']);
});
test('late failed read cannot hide a newer success; focus refresh does not ingest',async t=>{
 const x=setup(t);await pause();let reject;
 x.w.fetch=()=>new Promise((_,r)=>{reject=r});const p=x.w.medicalRefreshAnalyticsTotal();
 x.w.medicalPublishAnalyticsTotal(payload(16,now+1));reject(Error('offline'));await assert.rejects(p);assert.deepEqual(x.numbers(),['16','16']);
 const calls=[];x.w.fetch=async(u,o)=>{calls.push(o?.method||'GET');return {ok:true,json:async()=>payload(17,now+2)}};
 x.w.dispatchEvent(new x.w.Event('focus'));await pause();assert.deepEqual(x.numbers(),['17','17']);assert.deepEqual(calls,['GET']);
});
test('simultaneous tabs share lock/cooldown and broadcast total, without extra ingestion on refresh',async t=>{
 const peers=[];class Channel{constructor(){peers.push(this)}postMessage(data){for(const p of peers)if(p!==this)p.onmessage?.({data})}}
 let queue=Promise.resolve();const locks={request(_name,fn){const next=queue.then(fn);queue=next.catch(()=>{});return next}},storage=new Map();
 const a=setup(t,{storage,channel:Channel,locks,allowView:true}),b=setup(t,{storage,channel:Channel,locks,allowView:true});await pause();
 assert.equal([...a.calls,...b.calls].filter(c=>c.url.endsWith('/analytics/views')).length,1);
 assert.deepEqual(a.numbers(),['13','13']);assert.deepEqual(b.numbers(),['13','13']);
 await Promise.all([a.w.medicalRefreshAnalyticsTotal(),b.w.medicalRefreshAnalyticsTotal()]);
 assert.equal([...a.calls,...b.calls].filter(c=>c.url.endsWith('/analytics/views')).length,1);assert.deepEqual(b.numbers(),['13','13']);
});
test('mobile chart uses readable ticks, seven points and spaced dates; desktop geometry remains unchanged',async t=>{
 const x=setup(t);x.w.matchMedia=()=>({matches:true});Object.defineProperty(x.d.getElementById('console-daily-chart'),'clientWidth',{value:264,configurable:true});await pause();x.w.dispatchEvent(new x.w.Event('resize'));
 let svg=x.d.querySelector('#console-daily-chart svg');assert.equal(svg.getAttribute('viewBox'),'0 0 264 240');assert.equal(svg.querySelectorAll('circle').length,7);
 const dates=[...svg.querySelectorAll('text')].filter(e=>e.getAttribute('y')==='218');assert.equal(dates.length,4);assert.ok(dates.every(e=>e.getAttribute('font-size')==='13'));
 x.d.getElementById('console-chart-visitors').click();assert.match(x.d.querySelector('#console-daily-chart svg').getAttribute('aria-label'),/人數/);
 x.w.matchMedia=()=>({matches:false});x.w.dispatchEvent(new x.w.Event('resize'));svg=x.d.querySelector('#console-daily-chart svg');assert.equal(svg.getAttribute('viewBox'),'0 0 630 240');assert.equal([...svg.querySelectorAll('text')].filter(e=>e.getAttribute('y')==='218').length,7);
});
