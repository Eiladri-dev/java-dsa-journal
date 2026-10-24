const chapters = [
{n:"01",name:"Java Foundations",desc:"Syntax, variables, data types, operators, and input/output",slug:"ch-01-foundation",state:"empty",count:"—"},
{n:"02",name:"Conditionals & Loops",desc:"Decision-making, iteration, and flow control",slug:"ch-02-control",state:"empty",count:"—"},
{n:"03",name:"Pattern Problems",desc:"Grid logic, shapes, and coordinate-based printing",slug:"ch-03-patterns",state:"empty",count:"—"},
{n:"04",name:"Functions & Methods",desc:"Reusable logic, parameters, return values, and method design",slug:"ch-04-functions-methods",state:"active",count:"03 programs"},
{n:"05",name:"Arrays",desc:"Traversal, updates, subarrays, and array problem-solving",slug:"ch-05-arrays",state:"empty",count:"—"},
{n:"06",name:"Sorting",desc:"Elementary sorting, comparison sorts, and sorting patterns",slug:"ch-06-sorting",state:"empty",count:"—"},
{n:"07",name:"2D Arrays",desc:"Matrices, row/column traversal, and grid algorithms",slug:"ch-07-2d-arrays",state:"empty",count:"—"},
{n:"08",name:"Strings",desc:"String operations, character logic, and string problems",slug:"ch-08-strings",state:"empty",count:"—"},
{n:"09",name:"Bit Manipulation",desc:"Binary representation, bitwise operators, and bit tricks",slug:"ch-09-bits",state:"empty",count:"—"},
{n:"10",name:"Object-Oriented Programming",desc:"Classes, objects, constructors, inheritance, and polymorphism",slug:"ch-10-oop",state:"empty",count:"—"},
{n:"11",name:"Recursion",desc:"Base cases, recursive calls, and recursion trees",slug:"ch-11-recursion",state:"empty",count:"—"},
{n:"12",name:"Divide & Conquer",desc:"Problem decomposition, merge sort, and quick sort",slug:"ch-12-divide-conquer",state:"empty",count:"—"},
{n:"13",name:"Backtracking",desc:"State-space exploration, choices, and constraint solving",slug:"ch-13-backtracking",state:"empty",count:"—"},
{n:"14",name:"Time & Space Complexity",desc:"Asymptotic analysis and complexity estimation",slug:"ch-14-complexity",state:"empty",count:"—"},
{n:"15",name:"Linked Lists",desc:"Nodes, pointers, traversal, and linked-list operations",slug:"ch-15-linked-lists",state:"empty",count:"—"},
{n:"16",name:"Stacks",desc:"LIFO structures, monotonic stacks, and expression problems",slug:"ch-16-stacks",state:"empty",count:"—"},
{n:"17",name:"Queues & Deques",desc:"FIFO structures, circular queues, and deque patterns",slug:"ch-17-queues",state:"empty",count:"—"},
{n:"18",name:"Hashing",desc:"Hash maps, hash sets, frequency counting, and lookup patterns",slug:"ch-18-hashing",state:"empty",count:"—"},
{n:"19",name:"Trees",desc:"Tree traversals, recursion, height, and tree properties",slug:"ch-19-trees",state:"empty",count:"—"},
{n:"20",name:"Binary Search Trees",desc:"Ordered trees, search, insertion, and deletion",slug:"ch-20-bst",state:"empty",count:"—"},
{n:"21",name:"Heaps & Priority Queues",desc:"Heap properties, top-k problems, and priority ordering",slug:"ch-21-heaps",state:"empty",count:"—"},
{n:"22",name:"Greedy Algorithms",desc:"Local-choice strategies, scheduling, and optimization",slug:"ch-22-greedy",state:"empty",count:"—"},
{n:"23",name:"Tries",desc:"Prefix trees, word lookup, and string-prefix problems",slug:"ch-23-tries",state:"empty",count:"—"},
{n:"24",name:"Graphs",desc:"Representations, traversals, shortest paths, and connectivity",slug:"ch-24-graphs",state:"empty",count:"—"},
{n:"25",name:"Dynamic Programming",desc:"Memoization, tabulation, and state-transition design",slug:"ch-25-dp",state:"empty",count:"—"},
{n:"26",name:"Segment Trees & Range Queries",desc:"Range queries, updates, and tree-based structures",slug:"ch-26-segment-trees",state:"empty",count:"—"},
{n:"27",name:"Interview Patterns & Revision",desc:"Mixed practice, common patterns, and interview-ready review",slug:"ch-27-interview",state:"empty",count:"—"}
];
let programs = [];
let catalogReady = false;
let catalogSignature = '';
let catalogLoading = false;

// Motion layer: cursor-reactive ambient light, staggered reveal, card tilt, and short page transitions.
const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reducedMotion){
 document.addEventListener('pointermove',e=>{
  document.documentElement.style.setProperty('--mx',e.clientX+'px');
  document.documentElement.style.setProperty('--my',e.clientY+'px');
  const card=e.target.closest?.('.chapter-card');
  if(card){const r=card.getBoundingClientRect();card.style.setProperty('--card-x',(e.clientX-r.left)+'px');card.style.setProperty('--card-y',(e.clientY-r.top)+'px');}
 },{passive:true});
}
const topbar=document.querySelector('.topbar');
const updateTopbar=()=>topbar?.classList.toggle('scrolled',window.scrollY>16);
window.addEventListener('scroll',updateTopbar,{passive:true});updateTopbar();
document.body.classList.add('page-entering');
window.addEventListener('pageshow',()=>{document.body.classList.remove('page-leaving');document.body.classList.add('page-entering');setTimeout(()=>document.body.classList.remove('page-entering'),650);});
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href]');
 if(!link||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||link.target==='_blank')return;
 const href=link.getAttribute('href');
 if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||/^https?:\/\//i.test(href))return;
 if(reducedMotion)return;
 const target=new URL(href,location.href);
 if(target.origin!==location.origin||target.pathname===location.pathname&&target.hash)return;
 e.preventDefault();document.body.classList.add('page-leaving');
 window.setTimeout(()=>{location.href=target.href;},180);
});
const revealObserver = !reducedMotion && 'IntersectionObserver' in window ? new IntersectionObserver(entries=>{
 entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}});
},{threshold:.12,rootMargin:'0px 0px -30px 0px'}):null;

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
const chapterGrid=$("#chapterGrid");
let chapterFilter="all", chapterLimit=9, programFilter="all";
function renderChapters(){
 if(!chapterGrid)return;
 chapters.forEach(c=>{const count=programs.filter(p=>p.chapterSlug===c.slug).length;c.count=count?`${String(count).padStart(2,"0")} program${count===1?"":"s"}`:"—";c.state=count?"active":"empty";});
 const q=($("#chapterSearch")?.value||"").trim().toLowerCase();
 const filtered=chapters.filter(c=>(chapterFilter==="all"||c.state===chapterFilter)&&`${c.name} ${c.desc} ${c.n}`.toLowerCase().includes(q));
 const shown=filtered.slice(0,chapterLimit);
 chapterGrid.innerHTML=shown.map((c,i)=>`<a style="animation-delay:${Math.min(i,8)*45}ms" class="chapter-card ${c.state==="active"?"active-chapter":""}" href="chapters/${c.slug}/index.html"><div class="chapter-card-top"><span class="chapter-num">CH. ${c.n}</span><span class="chapter-state ${c.state==="active"?"active":""}">${c.state==="active"?"IN PROGRESS":"NOT STARTED"}</span></div><h3>${c.name}</h3><p>${c.desc}</p><div class="chapter-card-bottom"><span>${c.count}</span><span class="chapter-arrow">↗</span></div></a>`).join("");
 if(revealObserver) $$(".chapter-card",chapterGrid).forEach(el=>revealObserver.observe(el));
 const showAll=$("#showAllChapters");
 if(showAll){showAll.hidden=filtered.length<=chapterLimit;showAll.innerHTML=chapterLimit>=chapters.length?'All chapters shown <span>✓</span>':'Show all '+filtered.length+' chapters <span>↓</span>';}
}
function updateDashboardMetrics(){
 const total=programs.length, active=chapters.filter(c=>programs.some(p=>p.chapterSlug===c.slug)).length;
 const libraryCount=$('.library-count strong');if(libraryCount)libraryCount.textContent=String(total).padStart(2,'0');
 const metricPrograms=$$('.metric strong')[1];if(metricPrograms)metricPrograms.textContent=String(total).padStart(2,'0');
 const metricChapters=$$('.metric strong')[2];if(metricChapters)metricChapters.textContent=String(active).padStart(2,'0');
 const filterAll=$('#chapterFilters [data-filter="all"] span');if(filterAll)filterAll.textContent=String(chapters.length);
 const filterActive=$('#chapterFilters [data-filter="active"] span');if(filterActive)filterActive.textContent=String(active);
 const filterEmpty=$('#chapterFilters [data-filter="empty"] span');if(filterEmpty)filterEmpty.textContent=String(chapters.length-active);
}
function renderPrograms(){
 const list=$("#programList");if(!list)return;
 const q=($("#programSearch")?.value||"").trim().toLowerCase();
 const filtered=programs.filter(p=>{
  const matchText=`${p.name} ${p.desc} ${p.topic} ${p.chapter} ${p.keywords}`.toLowerCase().includes(q);
  const matchFilter=programFilter==="all"||(programFilter==="functions"&&p.chapter==="Functions & Methods")||(programFilter==="number"&&/number|binary|decimal|prime/i.test(`${p.topic} ${p.name} ${p.keywords}`));
  return matchText&&matchFilter;
 });
 list.innerHTML=filtered.map((p,i)=>`<a style="animation-delay:${i*70}ms" class="library-program" href="${p.url}"><div class="program-symbol ${p.tone}">${p.symbol}</div><div><h3>${p.name}</h3><p>${p.desc}</p></div><div class="program-meta"><span class="tag">${p.topic.toUpperCase()}</span><span class="arrow">↗</span></div></a>`).join("");
 const empty=$("#noResults");if(empty)empty.hidden=filtered.length>0;
}
if(chapterGrid){
 renderChapters();renderPrograms();
 $("#chapterSearch")?.addEventListener("input",()=>{chapterLimit=chapters.length;renderChapters()});
 $$("#chapterFilters [data-filter]").forEach(btn=>btn.addEventListener("click",()=>{$$("#chapterFilters .filter-chip").forEach(b=>b.classList.remove("active"));btn.classList.add("active");chapterFilter=btn.dataset.filter;chapterLimit=9;renderChapters()}));
 $("#showAllChapters")?.addEventListener("click",()=>{chapterLimit=chapterLimit>=chapters.length?9:chapters.length;renderChapters()});
 $("#programSearch")?.addEventListener("input",renderPrograms);
 $$("[data-program-filter]").forEach(btn=>btn.addEventListener("click",()=>{$$("[data-program-filter]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");programFilter=btn.dataset.programFilter;renderPrograms()}));
 $("#clearSearch")?.addEventListener("click",()=>{$("#programSearch").value="";programFilter="all";$$("[data-program-filter]").forEach(b=>b.classList.toggle("active",b.dataset.programFilter==="all"));renderPrograms()});
 document.addEventListener("keydown",e=>{if(e.key==="/"&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();$("#programSearch")?.focus()}if(e.key==="Escape"){document.activeElement.blur()}});
}

function renderChapterPage(){
 const body=document.body;if(!body.classList.contains('chapter-page'))return;
 const slug=body.dataset.chapterSlug || location.pathname.split('/').filter(Boolean).slice(-2,-1)[0];
 const chapter=chapters.find(c=>c.slug===slug);if(!chapter)return;
 const chapterPosition=chapters.findIndex(c=>c.slug===slug);
 const topbar=$('.topbar');
 if(topbar&&!topbar.querySelector('[data-chapter-previous]')){const previous=chapterPosition>0?chapters[chapterPosition-1]:null;const a=document.createElement('a');a.className='back-link';a.dataset.chapterPrevious='true';a.href=previous?`../${previous.slug}/index.html`:'../../index.html';a.textContent=previous?'← Previous chapter':'← Dashboard';topbar.appendChild(a);}
 const items=programs.filter(p=>p.chapterSlug===slug);
 const grid=$('[data-program-grid]')||$('.program-grid');
 const empty=$('.empty-state');
 if(items.length){
  if(empty)empty.remove();
  const shell=$('.chapter-shell');
  if(shell&&!$('.section-heading')){const heading=document.createElement('div');heading.className='section-heading';heading.innerHTML='<div><div class="eyebrow">YOUR PROGRAMS</div><h2>Chapter library</h2></div><a class="back-link" href="../../index.html#library">Search all programs ↗</a>';shell.appendChild(heading);}
  let mount=grid;
  if(!mount){mount=document.createElement('div');mount.className='program-grid';mount.id='chapterProgramGrid';if(shell)shell.appendChild(mount);}
  if(mount){mount.innerHTML=items.map((p,i)=>`<a style="animation-delay:${Math.min(i,8)*65}ms" class="program-card ${['accent-blue','accent-teal','accent-orange'][i%3]}" href="${p.url}"><div class="program-top"><span class="program-number">${String(i+1).padStart(2,'0')}</span><span class="program-type">${(p.topic||'PROGRAM').toUpperCase()}</span></div><h3>${p.name}</h3><p>${p.desc}</p><div class="program-footer"><span>Guided dissection</span><span class="arrow">↗</span></div></a>`).join('');}
 } else if(grid){grid.remove();}
 const stats=$$('.chapter-stats strong');if(stats[0])stats[0].textContent=String(items.length).padStart(2,'0');
 const note=$('#chapterNote');if(note){note.querySelector('p').innerHTML='Drop each finished HTML landing page into this chapter’s <code>programs</code> folder. The journal discovers it and builds the library and navigation automatically.';}
}
async function loadJournalCatalog(){
 if(catalogLoading)return;catalogLoading=true;
 try{
  const response=await fetch('/api/catalog',{cache:'no-store'});if(!response.ok)throw new Error('Catalog unavailable');
  const data=await response.json();
  const signature=JSON.stringify((data.programs||[]).map(p=>[p.url,p.name,p.chapterSlug]));
  if(signature===catalogSignature)return;
  catalogSignature=signature;programs=data.programs||[];catalogReady=true;
  if(chapterGrid){renderChapters();renderPrograms();updateDashboardMetrics();}
  renderChapterPage();
 }catch(err){
  // Direct file:// opening cannot discover directory contents; the launcher/server is required.
  const mount=$('#programList');if(mount&&!mount.children.length)mount.innerHTML='<p class="catalog-warning">Automatic discovery is unavailable in file-open mode. Launch the journal with <code>./start-journal.sh</code> so it can scan your chapter folders.</p>';
 } finally {catalogLoading=false;}
}
loadJournalCatalog();
// Poll the filesystem-backed catalog so newly added HTML files appear without a manual refresh.
window.setInterval(loadJournalCatalog,2500);
$("#mobileMenu")?.addEventListener("click",()=>$(".topnav")?.classList.toggle("open"));
