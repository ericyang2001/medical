'use strict';
const data=window.MEDICAL_LIBRARY;
const appScript=document.currentScript;
const assetVersion=appScript?.src || data.updated;
const $=id=>document.getElementById(id);
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shelfBooks=data.books.filter(b=>b.category!=='使用指南');
// Build the full-text index only when the first non-empty search needs it.
const normalizeSearch=value=>value.replace(/\s+/g,' ').trim().toLocaleLowerCase();
let searchIndex;
function getSearchIndex(){
 if(searchIndex)return searchIndex;
 searchIndex=shelfBooks.flatMap(book=>book.sections.map(section=>{
 const container=document.createElement('div');container.innerHTML=section.html;
 container.querySelectorAll('script,style').forEach(node=>node.remove());
 container.querySelectorAll('br').forEach(node=>node.replaceWith(' '));
 container.querySelectorAll('td,th,p,li,h3,h4').forEach(node=>node.append(' '));
 const text=container.textContent.replace(/\s+/g,' ').trim();
 return {book,section,text,searchable:normalizeSearch(section.title+' '+text)};
}));
 return searchIndex;
}
function searchMatches(query){return getSearchIndex().filter(entry=>entry.searchable.includes(query));}
function searchSnippet(text,query){
 const index=text.toLocaleLowerCase().indexOf(query);
 const start=Math.max(0,index-42),end=Math.min(text.length,(index<0?0:index)+query.length+100);
 const excerpt=text.slice(start,end);const at=excerpt.toLocaleLowerCase().indexOf(query);
 return (start?'…':'')+(at<0?escapeHTML(excerpt):escapeHTML(excerpt.slice(0,at))+'<mark>'+escapeHTML(excerpt.slice(at,at+query.length))+'</mark>'+escapeHTML(excerpt.slice(at+query.length)))+(end<text.length?'…':'');
}
// Coalesce rapid typing and wait for Chinese IME composition to finish.
let searchTimer,composing=false,lastRenderedQuery;
let renderedShelfKey;
const bookSearchText=new Map(shelfBooks.map(b=>[b.id,normalizeSearch([b.title,b.subtitle,b.category,...b.tags].join(' '))]));
function scheduleSearch(){
 clearTimeout(searchTimer);
 if(!composing)searchTimer=setTimeout(renderBooks,150);
}
$('search').addEventListener('compositionstart',()=>{composing=true;clearTimeout(searchTimer)});
$('search').addEventListener('compositionend',()=>{composing=false;scheduleSearch()});
$('search').addEventListener('input',event=>{if(!event.isComposing)scheduleSearch()});
$('search').addEventListener('keydown',event=>{if(event.key==='Enter'&&!composing&&!event.isComposing){clearTimeout(searchTimer);renderBooks()}});

function renderBooks(){
 const query=normalizeSearch($('search').value);
 if(query===lastRenderedQuery)return;
 lastRenderedQuery=query;
 const matches=query?searchMatches(query):[];
 const matchedBookIds=new Set(matches.map(entry=>entry.book.id));
 const books=shelfBooks.filter(b=>!query||bookSearchText.get(b.id).includes(query)||matchedBookIds.has(b.id));
 $('count').textContent=`${books.length} 本館藏`;$('shelf-label').textContent=query?'符合搜尋的館藏':'全部館藏';
 const shelfKey=JSON.stringify(books.map(b=>b.id));
 if(shelfKey!==renderedShelfKey){
 renderedShelfKey=shelfKey;
 const bookCovers=books.map(b=>`<a class="book" href="#book/${encodeURIComponent(b.id)}" style="--book:${b.color}" aria-label="閱讀${escapeHTML(b.title)}"><span class="number">VOL. ${String(shelfBooks.indexOf(b)+1).padStart(2,'0')}</span><div><h3>${escapeHTML(b.title)}</h3><small>${escapeHTML(b.subtitle)}</small></div><div class="book-bottom"><span>${escapeHTML(b.category)}</span></div></a>`);
 $('books').innerHTML=Array.from({length:Math.ceil(bookCovers.length/10)},(_,row)=>
  '<div class="shelf-row" role="group" aria-label="第 '+(row+1)+' 排書架">'+bookCovers.slice(row*10,row*10+10).join('')+'</div>'
 ).join('');
 }

 $('empty').hidden=books.length!==0||shelfBooks.length===0;$('empty').textContent='找不到符合的內容，試試其他關鍵字。';
 $('search-results').hidden=!query;
 $('search-status').textContent=query?`找到 ${matches.length} 個符合的段落`:'';
 $('search-result-list').innerHTML=matches.map(({book,section,text})=>`<li><a class="search-result" href="#book/${encodeURIComponent(book.id)}/${encodeURIComponent(section.id)}?q=${encodeURIComponent(query)}"><span class="search-result-book">${escapeHTML(book.title)}</span><strong>${escapeHTML(section.title)}</strong><p>${searchSnippet(text,query)}</p><span class="search-result-go">前往段落 →</span></a></li>`).join('');
}
function revealSearchTarget(sectionId,query){
 const section=$('section-'+sectionId);if(!section)return;
 $('chapter-select').value=sectionId;
 let first=null;
 if(query){
  const walker=document.createTreeWalker(section,NodeFilter.SHOW_TEXT);const nodes=[];
  while(walker.nextNode())if(!walker.currentNode.parentElement.closest('script,style,input,textarea,select,button'))nodes.push(walker.currentNode);
  nodes.forEach(node=>{
   const text=node.textContent,lower=text.toLocaleLowerCase();let offset=0,at=lower.indexOf(query);if(at<0)return;
   const fragment=document.createDocumentFragment();
   while(at>=0){
    fragment.append(text.slice(offset,at));const hit=document.createElement('span');hit.className='search-hit';hit.textContent=text.slice(at,at+query.length);fragment.append(hit);if(!first)first=hit;
    offset=at+query.length;at=lower.indexOf(query,offset);
   }
   fragment.append(text.slice(offset));node.replaceWith(fragment);
  });
 }
 const target=first||section.querySelector('h2')||section;
 for(let node=target.parentElement;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
 requestAnimationFrame(()=>{target.scrollIntoView({block:'center',inline:'center',behavior:'instant'});target.setAttribute('tabindex','-1');target.focus({preventScroll:true});});
}

// Fetch and execute calculator code only for its actual reader page.
let calculatorLoad;
function mountCalculatorWhenNeeded(){
 const host=$('lab-calculator');
 if(!host)return;
 if(window.mountLabCalculator){window.mountLabCalculator();return}
 host.textContent='公式計算器載入中…';
 if(!calculatorLoad){
  calculatorLoad=new Promise((resolve,reject)=>{
   const script=document.createElement('script');
   script.src=appScript?.dataset.calculators || 'calculators.js?v=20261029-views';
   script.onload=resolve;
   script.onerror=()=>{script.remove();calculatorLoad=null;reject(new Error('Calculator unavailable'))};
   document.head.appendChild(script);
  });
 }
 calculatorLoad.then(()=>{
  if($('lab-calculator')===host&&!$('reader').hidden&&!host.querySelector('form'))window.mountLabCalculator?.();
 }).catch(()=>{
  if($('lab-calculator')!==host)return;
  host.textContent='計算器暫時無法載入。';
  const retry=document.createElement('button');retry.type='button';retry.textContent='重試';
  retry.addEventListener('click',mountCalculatorWhenNeeded);host.append(retry);
 });
}

function route(){const [path,params='']=location.hash.split('?');const match=path.match(/^#book\/([^/]+)(?:\/([^/]+))?$/);let book;if(match){try{book=data.books.find(b=>b.id===decodeURIComponent(match[1]))}catch{book=null}}if(match){$('library').hidden=true;$('reader').hidden=false;if(!book){$('reader-title').textContent='找不到這本書';$('reader-category').textContent='';$('toc').replaceChildren();$('chapter-select').innerHTML='<option value="">沒有可選章節</option>';$('chapter-select').disabled=true;$('article').innerHTML='<h1>這本書尚未上架</h1><p>請返回書架，選擇現有館藏。</p>';document.title='醫學加油站'}else{$('reader-title').textContent=book.title;$('reader-category').textContent=book.category;$('chapter-select').disabled=false;$('chapter-select').innerHTML='<option value="">選擇要閱讀的段落</option>'+book.sections.map(s=>`<option value="${escapeHTML(s.id)}">${escapeHTML(s.title)}</option>`).join('');$('toc').innerHTML=book.sections.map(s=>`<a href="#section-${escapeHTML(s.id)}" data-section="${escapeHTML(s.id)}">${escapeHTML(s.title)}</a>`).join('');$('article').innerHTML=`<div class="label">${escapeHTML(book.subtitle)}</div><h1>${escapeHTML(book.title)}</h1>`+book.sections.map(s=>`<section id="section-${escapeHTML(s.id)}"><h2>${escapeHTML(s.title)}</h2>${s.html}</section>`).join('');if(book.category==='使用指南')$('article').insertAdjacentHTML('beforeend','<nav class="guide-links" aria-label="其他使用指南">'+data.books.filter(b=>b.category==='使用指南'&&b.id!==book.id).map(b=>'<a href="#book/'+encodeURIComponent(b.id)+'">'+escapeHTML(b.title)+' ↗</a>').join('')+'</nav>');document.title='醫學加油站'}mountCalculatorWhenNeeded();window.scrollTo(0,0);$('article').focus({preventScroll:true});if(book&&match[2]){try{revealSearchTarget(decodeURIComponent(match[2]),normalizeSearch(new URLSearchParams(params).get('q')||''))}catch{}}}else{$('library').hidden=false;$('reader').hidden=true;document.title='醫學加油站';if(location.hash==='#collection')requestAnimationFrame(()=>$('collection').scrollIntoView());else window.scrollTo(0,0)}}
$('toc').addEventListener('click',event=>{const link=event.target.closest('[data-section]');if(!link)return;event.preventDefault();$('section-'+link.dataset.section)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})});
$('chapter-select').addEventListener('change',event=>{const id=event.target.value;if(!id)return;const section=$('section-'+id);if(!section)return;section.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});const heading=section.querySelector('h2');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true})}});
window.addEventListener('hashchange',route);
document.addEventListener('keydown',event=>{if(event.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&!$('library').hidden){event.preventDefault();$('search').focus()}});
function showDate(value){const date=new Date(value);if(Number.isNaN(date.getTime()))return;$('updated').dateTime=date.toISOString();$('updated').textContent=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(date).replaceAll('-','/');}
showDate(data.updated);
// Cache public update metadata for six hours; a new app version invalidates it.
(async function updateDate(){
 if(location.hostname!=='ericyang2001.github.io')return;
 const key='medical-bookshelf:updated-date:v1';
 let cached;
 try{cached=JSON.parse(localStorage.getItem(key)||'null')}catch{}
 if(cached?.date)showDate(cached.date);
 const now=Date.now(),age=now-cached?.checkedAt;
 if(cached?.version===assetVersion&&age>=0&&age<6*60*60*1000)return;
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),8000);
 let date=cached?.date || data.updated;
 try{
  const response=await fetch('https://api.github.com/repos/ericyang2001/medical/commits?sha=main&per_page=1',{headers:{Accept:'application/vnd.github+json'},signal:controller.signal});
  if(!response.ok)throw new Error('Date unavailable');
  const commits=await response.json();
  const latest=commits?.[0]?.commit?.committer?.date;
  if(latest&&!Number.isNaN(new Date(latest).getTime()))date=latest;
 }catch{}finally{clearTimeout(timeout)}
 showDate(date);
 try{localStorage.setItem(key,JSON.stringify({version:assetVersion,checkedAt:now,date}))}catch{}
})();
renderBooks();route();

// Reload the current page, preserving its route.
document.getElementById("refresh-page")?.addEventListener("click", () => window.location.reload());


// Shared total stored by Hits.sh. Repeated loads only READ the shared total.
(async function initViewCounter() {
 const count = document.getElementById('visit-counter-value');
 const unit = document.getElementById('visit-counter-unit');
 if (!count || !unit) return;
 if (location.hostname !== 'ericyang2001.github.io') {
  count.textContent = '預覽不計數';
  return;
 }
 const key = 'medical-bookshelf:page-view:hits:v2';
 const cooldown = 5 * 60 * 1000;
 let storage;
 for (const name of ['localStorage', 'sessionStorage']) {
  try {
   const candidate = window[name];
   candidate.setItem(key + ':probe', '1');
   candidate.removeItem(key + ':probe');
   storage = candidate;
   break;
  } catch {}
 }
 function read() {
  try { return JSON.parse(storage?.getItem(key) || '{}') || {}; }
  catch { return {}; }
 }
 function claimVisit() {
  const previous = read();
  const now = Date.now();
  const elapsed = now - Number(previous.lastVisit);
  const repeated = Number.isFinite(elapsed) && elapsed >= 0 && elapsed < cooldown;
  // Reserve before requesting, protecting simultaneous tabs and rapid reloads.
  // Read requests are never suppressed, even after a failed network request.
  try { storage?.setItem(key, JSON.stringify({lastVisit: now})); } catch {}
  return repeated;
 }
 let repeated;
 try {
  repeated = navigator.locks
   ? await navigator.locks.request(key, claimVisit)
   : claimVisit();
 } catch { repeated = claimVisit(); }

 const counter = 'ericyang2001.github.io/medical';
 const style = '&label=%20&color=254d43&labelColor=254d43&style=flat-square';
 const incrementURL = 'https://hits.sh/' + counter + '.svg?view=total' + style;
 // The statistics endpoint is read-only; Shields renders its JSON as an image
 // without cross-origin JSON restrictions. Read displays may lag by five minutes.
 const readURL = 'https://img.shields.io/badge/dynamic/json?url=' +
  encodeURIComponent('https://hits.sh/api/urns/' + counter) +
  '&query=%24.total&cacheSeconds=300' + style;
 function showCounter(url, canFallback) {
  const badge = document.createElement('img');
  badge.alt = '累計瀏覽次數';
  badge.className = 'visit-counter-number';
  badge.referrerPolicy = 'no-referrer';
  let finished = false;
  const timeout = setTimeout(fail, 20000);
  function fail() {
   if (finished) return;
   finished = true;
   clearTimeout(timeout);
   badge.onload = badge.onerror = null;
   if (canFallback) showCounter(readURL, false);
   else {
    count.textContent = '暫時無法取得';
    unit.hidden = true;
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'visit-counter-retry';
    retry.textContent = '重試';
    retry.addEventListener('click', () => {
     count.textContent = '載入中…';
     showCounter(readURL, false);
    });
    count.append(' ', retry);
   }
  }
  badge.onload = () => {
   if (finished) return;
   finished = true;
   clearTimeout(timeout);
   count.replaceChildren(badge);
   unit.hidden = false;
  };
  badge.onerror = fail;
  badge.src = url;
 }
 showCounter(repeated ? readURL : incrementURL, !repeated);
})();
