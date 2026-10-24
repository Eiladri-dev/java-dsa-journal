(async()=>{
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const style=document.createElement('style');style.textContent=`
 .journal-route-controls{display:flex;align-items:center;gap:7px;margin-left:8px;flex-shrink:0}
 .journal-route-controls a{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid rgba(167,155,255,.25);border-radius:999px;color:#d9d7ff;background:rgba(139,125,255,.09);font:600 11px/1.2 Inter,system-ui,sans-serif;white-space:nowrap;transition:transform .25s,border-color .25s,background .25s,box-shadow .25s}
 .journal-route-controls a:hover{transform:translateY(-2px);border-color:rgba(167,155,255,.7);background:rgba(139,125,255,.18);box-shadow:0 7px 25px rgba(115,95,255,.16)}
 .journal-route-controls .route-next{border-color:rgba(103,232,213,.27);color:#b7fff1;background:rgba(103,232,213,.07)}
 .journal-route-controls .route-next:hover{border-color:rgba(103,232,213,.65);box-shadow:0 7px 25px rgba(65,220,195,.12)}
 @media(max-width:1100px){.journal-route-controls{gap:4px;margin-left:3px}.journal-route-controls a{font-size:0;gap:0;width:32px;height:32px;justify-content:center;padding:0}.journal-route-controls a span{font-size:15px}.journal-route-controls .route-label{display:none}.nav-in{flex-wrap:wrap}}
 @media(max-width:560px){.journal-route-controls a{font-size:0;gap:0;width:32px;height:32px;justify-content:center;padding:0}.journal-route-controls a span{font-size:15px}.journal-route-controls .route-label{display:none}}
 body.journal-route-leaving main,body.journal-route-leaving .hero,body.journal-route-leaving .chapter-shell{opacity:0;transform:translateY(-8px);filter:blur(2px)}
 main,.hero,.chapter-shell{transition:opacity .2s ease,transform .2s ease,filter .2s ease}
 `;document.head.appendChild(style);
 let lastSignature='';
 async function refreshNavigation(){
  let data;try{const r=await fetch('/api/catalog',{cache:'no-store'});if(!r.ok)return;data=await r.json()}catch{return}
  const path=decodeURIComponent(location.pathname);
  const p=data.programs.find(x=>decodeURIComponent(x.url)===path || x.url.replace(/\/$/,'')===path.replace(/\/$/,''));
  if(!p)return;
  const list=data.programs.filter(x=>x.chapterSlug===p.chapterSlug);
  const signature=JSON.stringify(list.map(x=>x.url));if(signature===lastSignature)return;lastSignature=signature;
  const chapter=data.chapters.find(c=>c.slug===p.chapterSlug);if(!chapter)return;
  const index=list.findIndex(x=>x.url===p.url);
  const prev=index>0?{url:list[index-1].url,label:'Previous program',icon:'←'}:{url:`/chapters/${chapter.slug}/index.html`,label:'Chapter overview',icon:'↖'};
  const chapterIndex=data.chapters.findIndex(c=>c.slug===chapter.slug);
  const next=index<list.length-1?{url:list[index+1].url,label:'Next program',icon:'→'}:(data.chapters[chapterIndex+1]?{url:`/chapters/${data.chapters[chapterIndex+1].slug}/index.html`,label:'Next chapter',icon:'↗'}:null);
  const nav=document.querySelector('.nav-links, .nav-right');
  if(nav){
   nav.querySelector('.journal-route-controls')?.remove();
   const controls=document.createElement('div');controls.className='journal-route-controls';
   const make=(item,cls)=>{if(!item)return null;const a=document.createElement('a');a.href=item.url;a.className=cls||'';a.setAttribute('aria-label',item.label);a.innerHTML=`<span>${item.icon}</span><span class="route-label">${item.label}</span>`;a.addEventListener('click',e=>{if(reduce||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();document.body.classList.add('journal-route-leaving');setTimeout(()=>location.href=item.url,170)});return a};
   controls.appendChild(make(prev,'route-prev'));if(next)controls.appendChild(make(next,'route-next'));nav.appendChild(controls);
  }
  document.querySelector('.journal-bottom-route')?.remove();
  const main=document.querySelector('main');if(main){const rail=document.createElement('div');rail.className='journal-bottom-route';rail.style.cssText='display:flex;justify-content:space-between;gap:12px;max-width:1180px;margin:28px auto 44px;padding:0 24px;';
   const btn=(item)=>{if(!item)return null;const a=document.createElement('a');a.href=item.url;a.textContent=`${item.icon} ${item.label}`;a.style.cssText='display:inline-flex;align-items:center;gap:8px;padding:11px 15px;border-radius:12px;border:1px solid rgba(167,155,255,.23);background:rgba(139,125,255,.08);color:#dcd9ff;font:600 12px Inter,system-ui,sans-serif;transition:transform .25s,background .25s;';a.addEventListener('mouseenter',()=>a.style.transform='translateY(-2px)');a.addEventListener('mouseleave',()=>a.style.transform='');a.addEventListener('click',e=>{if(reduce||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;e.preventDefault();document.body.classList.add('journal-route-leaving');setTimeout(()=>location.href=item.url,170)});return a};
   const left=btn(prev),right=btn(next);if(left)rail.appendChild(left);if(right)rail.appendChild(right);main.after(rail);
  }
 }
 await refreshNavigation();window.setInterval(refreshNavigation,2500);
})();
