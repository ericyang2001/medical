import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {JSDOM} from 'jsdom';
const read=f=>readFileSync(new URL('../'+f,import.meta.url),'utf8'),pause=()=>new Promise(r=>setTimeout(r,25));
test('date labels, dual metrics, shared total and chart mode switch use actual payload',async()=>{
 const dom=new JSDOM(read('index.html'),{url:'https://ericyang2001.github.io/medical/#console',runScripts:'outside-only'}),w=dom.window,d=w.document;
 const now=Date.parse('2026-12-31T16:01:00Z');
 w.medicalConsoleAccess={authenticated:()=>true,request:async()=>({today:1,week:2,month:1,updatedAt:new Date(now).toISOString(),serverNow:now,total:5,startedAt:now-86400000,periods:{day:{views:2},week:{views:5},month:{views:2}},dailyMetrics:[{date:'2026-12-31',visitors:2,views:3},{date:'2027-01-01',visitors:1,views:2}]})};
 w.eval(read('console.js'));w.renderAdminConsole();await pause();
 assert.equal(d.getElementById('console-date-today').textContent,'2027/01/01');assert.equal(d.getElementById('console-date-week').textContent,'12/28－01/03');assert.equal(d.getElementById('console-date-month').textContent,'2027/01');assert.equal(d.getElementById('console-total').textContent,'5');assert.equal(d.getElementById('console-views-week').textContent,'5');
 assert.match(d.querySelector('svg.console-line-chart').getAttribute('aria-label'),/人次/);d.getElementById('console-chart-visitors').click();assert.match(d.querySelector('svg.console-line-chart').getAttribute('aria-label'),/人數/);assert.equal(d.querySelectorAll('svg.console-line-chart circle').length,2);dom.window.close();
});
test('client retries preserve event ID, shared cooldown suppresses next page',async()=>{
 const storage=new Map();let fail=true;const posts=[];
 async function run(){const dom=new JSDOM('',{url:'https://ericyang2001.github.io/medical/',runScripts:'outside-only'}),w=dom.window;
 Object.defineProperty(w,'localStorage',{value:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}});
 w.fetch=async(url,opts={})=>{if(url.endsWith('/visits'))return {ok:true};if(url.endsWith('/total'))return {ok:true,json:async()=>({enabled:true,total:0,serverNow:Date.now()})};posts.push(JSON.parse(opts.body));if(fail){fail=false;throw Error('network')};return {ok:true,json:async()=>({enabled:true,total:1,startedAt:Date.now()})}};
 w.eval(read('visitor-stats.js'));await pause();return dom;}
 const first=await run();first.window.dispatchEvent(new first.window.Event('online'));await pause();assert.equal(posts.length,2);assert.equal(posts[0].eventId,posts[1].eventId);assert.equal(first.window.medicalAnalyticsTotal.total,1);first.window.close();const second=await run();assert.equal(posts.length,2);second.window.close();
});
test('disabled backend never sends v2 view',async()=>{const dom=new JSDOM('',{url:'https://ericyang2001.github.io/medical/',runScripts:'outside-only'}),w=dom.window;let views=0;w.fetch=async u=>{if(u.endsWith('/views'))views++;return {ok:true,json:async()=>({enabled:false})}};w.eval(read('visitor-stats.js'));await pause();assert.equal(views,0);w.close()});
test('footer uses shared D1 total, receives updates, no Hits.sh after enable',async()=>{
 const dom=new JSDOM('<span id="visit-counter-value"></span><span id="visit-counter-unit"></span>',{url:'https://ericyang2001.github.io/medical/',runScripts:'outside-only'}),w=dom.window;
 w.medicalAnalyticsReady=Promise.resolve({enabled:true,total:12});const source=read('app.js'),start=source.indexOf('(async function initViewCounter()');w.eval(source.slice(start,source.indexOf('\n})();',start)+6));await pause();assert.equal(w.document.getElementById('visit-counter-value').textContent,'12');assert.equal(w.document.querySelector('img'),null);w.dispatchEvent(new w.CustomEvent('medical-analytics-total',{detail:{total:13}}));assert.equal(w.document.getElementById('visit-counter-value').textContent,'13');w.close();
});
