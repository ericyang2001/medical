import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
test('seven-day SVG line: real points only, gaps retained, older and future excluded',async()=>{
 const dom=new JSDOM(readFileSync(new URL('../index.html',import.meta.url),'utf8'),{url:'https://ericyang2001.github.io/medical/#console',runScripts:'outside-only'});
 const w=dom.window;
 const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const day=n=>new Date(Date.parse(today+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
 w.medicalConsoleAccess={authenticated:()=>true,request:async()=>({today:4,week:5,month:6,updatedAt:new Date().toISOString(),dailyMetrics:[{date:day(-7),views:999},{date:day(-6),views:2},{date:day(-5),views:3},{date:day(-4),views:null},{date:day(0),views:4},{date:day(1),views:999}]})};
 w.eval(readFileSync(new URL('../console.js',import.meta.url),'utf8'));w.renderAdminConsole();await new Promise(r=>setTimeout(r,20));
 const svg=w.document.querySelector('#console-daily-chart svg');assert.ok(svg);assert.equal(svg.querySelectorAll('circle').length,3);assert.equal(svg.querySelectorAll('line[stroke-width="3"]').length,1);assert.ok(!svg.textContent.includes('999'));assert.match(w.document.getElementById('console-chart-note').textContent,/無資料/);
 w.document.getElementById('console-chart-visitors').click();assert.equal(w.document.querySelectorAll('#console-daily-chart circle').length,1);
 w.medicalConsoleAccess.authenticated=()=>false;w.dispatchEvent(new w.Event('medical-admin-state'));assert.equal(w.document.querySelector('#console-daily-chart svg'),null);dom.window.close();
});
