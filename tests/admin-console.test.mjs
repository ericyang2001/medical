import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const base=new URL('../',import.meta.url).pathname;
const pause=()=>new Promise(r=>setTimeout(r,20));
function setup(){
 const dom=new JSDOM(readFileSync(base+'index.html','utf8'),{url:'https://ericyang2001.github.io/medical/#console',runScripts:'outside-only'}),w=dom.window,doc=w.document;
 let active=false;const requests=[];
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 w.firebaseAdminAuth={configured:true,signIn:async()=> 'synthetic-id-token',signOut:async()=>{}};
 w.fetch=async(url,opt={})=>{
  const path=new URL(url).pathname;requests.push({path,method:opt.method||'GET'});let status=200,data;
  if(path==='/api/versions')data={content:'preserved record',revision:2,updatedAt:'2026-11-07T00:00:00Z'};
  else if(path==='/api/auth/firebase'){active=true;data={token:'synthetic-session'}}
  else if(path==='/api/logout'){active=false;data={ok:true}}
  else if(!active){status=401;data={error:'請先登入管理者。'}}
  else if(path==='/api/admin/overview')data={today:2,week:5,month:8,updatedAt:'2026-11-07T04:00:00Z'};
  else if(path==='/api/admin/login-records')data={items:[{id:1,loggedAt:1794000000000,ip:'<img src=x onerror=alert(1)>'}],nextCursor:null,updatedAt:'2026-11-07T04:00:00Z'};
  else data={authenticated:true};return {ok:status===200,status,json:async()=>data};
 };
 w.eval(readFileSync(base+'management.js','utf8'));w.eval(readFileSync(base+'console.js','utf8'));w.renderAdminConsole();
 return {w,doc,requests,close:()=>w.close(),login:async()=>{doc.getElementById('admin-login').click();doc.getElementById('admin-google-login').click();await pause()}};
}
test('visitor cannot see console button or private content; direct hash makes no private API call',async()=>{const x=setup();await pause();assert.equal(x.doc.getElementById('console-link').hidden,true);assert.equal(x.doc.getElementById('console-content').hidden,true);assert.ok(!x.requests.some(r=>r.path.startsWith('/api/admin')));x.close()});
test('verified login reveals console in correct navigation order and counts',async()=>{const x=setup();await x.login();assert.equal(x.doc.getElementById('console-link').hidden,false);assert.equal(x.doc.querySelector('.version-link').nextElementSibling.id,'console-link');assert.equal(x.doc.getElementById('console-today').textContent,'2');assert.equal(x.doc.getElementById('console-week').textContent,'5');assert.equal(x.doc.getElementById('console-month').textContent,'8');assert.match(x.doc.getElementById('console-updated').textContent,/最後更新/);x.close()});
test('login-history tab escapes content and does not render server values as HTML',async()=>{const x=setup();await x.login();x.w.location.hash='#console/logins';x.w.renderAdminConsole();await pause();assert.equal(x.doc.getElementById('console-logins').hidden,false);assert.equal(x.doc.querySelector('#console-login-rows img'),null);assert.match(x.doc.getElementById('console-login-rows').textContent,/<img/);x.close()});
test('logout hides button and wipes all private rendered information',async()=>{const x=setup();await x.login();x.doc.getElementById('admin-logout').click();await pause();assert.equal(x.doc.getElementById('console-link').hidden,true);assert.equal(x.doc.getElementById('console-content').hidden,true);assert.equal(x.doc.getElementById('console-today').textContent,'—');assert.equal(x.doc.getElementById('console-login-rows').textContent,'');x.close()});
test('frontend does not write version history during console use',async()=>{const x=setup();await x.login();x.doc.getElementById('console-refresh').click();await pause();assert.ok(!x.requests.some(r=>r.method==='PUT'));x.close()});
