/* ---------- Short side menu: related pages are grouped into one row each (Patients, Appointments, Orders & Lab ...).
   Every page is still there: the other pages of a group are small tabs at the top of the page. Each role sees only the groups it can open (RN).
   "Full list" at the bottom of the menu brings back the long list (with Arrange menu and Settings > Side menu). ---------- */
const NAVG=[
 ['g_dash','Dashboard','fa-table-columns',['dash']],
 ['g_pat','Patients','fa-address-book',['recent','dir','drd','done','card','patient']],
 ['g_appt','Appointments','fa-calendar-check',['appt','queue','chairs']],
 ['g_ortho','Ortho Follow-up','fa-teeth',['ortho']],
 ['g_ord','Orders & Lab','fa-flask',['ord','tra','labq','lab','labmsg']],
 ['g_stock','Stock & Sterilization','fa-boxes-stacked',['mat','ster']],
 ['g_fin','Finance & Cash','fa-sack-dollar',['cash','fin','rinv','rpr','plans','rep','ran','crep','earn','pay','prules','ptrack','mypay']],
 ['g_staff','Procedures & Staff','fa-user-doctor',['proc','dis','users','clinics','perm','activity','jobs','cv','comply']],
 ['g_msg','Messages','fa-comments',['chat','bc','ads','devnote']],
 ['g_set','Settings','fa-gear',['settings','sys','bkd','mydata','profile']]
];
const NAVG_MODE_KEY='dental_navmode';
const navGMode=()=>{try{return localStorage.getItem(NAVG_MODE_KEY)=='f'?'f':'g'}catch(e){return 'g'}};
const navGOrdKey=()=>'dental_navg:'+(U?U.id:'');
const navGOrd=()=>{try{return JSON.parse(localStorage.getItem(navGOrdKey())||'[]')}catch(e){return[]}};
/* pages this person may open, grouped; pages that belong to no group go to the Settings group so nothing is ever lost */
function navGroups(){const all=navAll(),known=new Set(NAVG.flatMap(g=>g[3])),extra=all.filter(n=>!known.has(n[0])).map(n=>n[0]);
 return NAVG.map(g=>{const ids=g[3].concat(g[0]=='g_set'?extra:[]),pages=ids.map(id=>all.find(n=>n[0]==id)).filter(Boolean);return{id:g[0],n:g[1],ic:g[2],pages}}).filter(g=>g.pages.length)}
function navGOf(v){const gs=navGroups();if(v=='patient')return gs.find(g=>g.id=='g_pat')||null;return gs.find(g=>g.pages.some(p=>p[0]==v))||null}
function navGCount(g){let c=0;try{g.pages.forEach(p=>{const id=p[0];
 if(id=='dir')c+=S.patients.filter(x=>!x.fin).length;
 else if(id=='appt'){const t=sod(NOW());c+=allAppts().filter(a=>sod(a.ts)==t).length}
 else if(id=='ord')c+=ordList().filter(r=>r.o.st=='pending').length;
 else if(id=='ortho')c+=orCases().filter(x=>x.st=='behind').length;
 else if(id=='mat')c+=stockInit().items.filter(m=>{const s=mState(m);return s=='out'||s=='low'}).length})}catch(e){c=0}return c>0?`<span class="nvb">${c>99?'99+':c}</span>`:''}
function navGList(){const gs=navGroups(),o=navGOrd(),k=(g,i)=>{if(g.id=='g_set')return 1e5;const x=o.indexOf(g.id);return x>=0?x:1e3+i};return gs.map((g,i)=>[k(g,i),g]).sort((a,b)=>a[0]-b[0]).map(x=>x[1])}
function navGOpen(id){const g=navGroups().find(x=>x.id==id);if(!g||!g.pages.length)return;let last=null;try{last=sessionStorage.getItem('dental_navlast:'+id)}catch(e){}
 const t=g.pages.find(p=>p[0]==last&&p[0]!='patient')||g.pages.find(p=>p[0]!='patient')||g.pages[0];go(t[0])}
function navGMove(id,d){const ids=navGList().filter(g=>g.id!='g_set').map(g=>g.id),i=ids.indexOf(id),j=i+d;if(i<0||j<0||j>=ids.length)return;[ids[i],ids[j]]=[ids[j],ids[i]];try{localStorage.setItem(navGOrdKey(),JSON.stringify(ids))}catch(e){}navDraw()}
function navGReset(){try{localStorage.removeItem(navGOrdKey())}catch(e){}navDraw()}
function navGToggle(){try{localStorage.setItem(NAVG_MODE_KEY,navGMode()=='g'?'f':'g')}catch(e){}NAVED=0;navDraw()}
const _navDrawFull=navDraw;
navDraw=function(){if(!U||navGMode()=='f'){_navDrawFull.apply(this,arguments);try{navGFoot()}catch(e){}return}
 const L=navGList(),cur=navGOf(V),mv=(id,d,on,ic)=>`<button type="button" ${on?'':'disabled'} onclick="event.stopPropagation();navGMove('${id}',${d})" style="width:34px;min-height:34px;height:34px;border-radius:8px;border:1px solid rgba(148,163,184,.5);background:rgba(148,163,184,.15);color:inherit;opacity:${on?1:.3}"><i class="fa ${ic}"></i></button>`,mvL=L.filter(g=>g.id!='g_set');
 const btn=(t,a,extra)=>`<button type="button" onclick="${a}" style="font-size:12px;min-height:34px;padding:4px 12px;border-radius:999px;border:1px solid rgba(148,163,184,.5);${extra||'background:transparent;color:inherit'}">${t}</button>`;
 $('nav').innerHTML=L.map(g=>{const i=mvL.findIndex(x=>x.id==g.id),mvb=NAVED&&i>=0?`<span style="display:flex;gap:6px">${mv(g.id,-1,i>0,'fa-chevron-up')}${mv(g.id,1,i<mvL.length-1,'fa-chevron-down')}</span>`:'';
  return `<div class="nv ${cur&&cur.id==g.id?'on':''}" onclick="${NAVED?'':"navGOpen('"+g.id+"')"}"><i class="fa ${g.ic} w-5"></i><span style="flex:1">${g.n}</span>${NAVED?'':navGCount(g)}${mvb}</div>`}).join('')+
 `<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin:10px 8px 4px">${btn(`<i class="fa ${NAVED?'fa-check':'fa-arrows-up-down'}" style="margin-right:6px"></i>${NAVED?'Done':'Arrange menu'}`,'navEdit()',NAVED?'background:#16a34a;color:#fff':'')}${NAVED?btn('Reset order','navGReset()'):btn('<i class="fa fa-layer-group" style="margin-right:6px"></i>All pages','navGAll()')+btn('<i class="fa fa-list" style="margin-right:6px"></i>Full list','navGToggle()')}</div>`}
function navGFoot(){const n=$('nav');if(n&&!NAVED)n.insertAdjacentHTML('beforeend',`<div style="display:flex;justify-content:center;margin:2px 8px 8px"><button type="button" onclick="navGToggle()" style="font-size:12px;min-height:34px;padding:4px 12px;border-radius:999px;border:1px solid rgba(148,163,184,.5);background:transparent;color:inherit"><i class="fa fa-layer-group" style="margin-right:6px"></i>Grouped menu</button></div>`)}
/* small tabs at the top of a page to reach the other pages of the same group */
function navGTabs(){const v=$('v');if(!v||!U)return;const old=$('gtabs');if(old)old.remove();if(navGMode()!='g'||V=='patient')return;const g=navGOf(V);if(!g)return;try{sessionStorage.setItem('dental_navlast:'+g.id,V)}catch(e){}
 const P=g.pages.filter(p=>p[0]!='patient');if(P.length<2)return;
 v.insertAdjacentHTML('afterbegin',`<div id="gtabs" class="gtabs" role="tablist" aria-label="${H(g.n)}">${P.map(p=>`<button type="button" role="tab" class="gtab ${p[0]==V?'on':''}" onclick="go('${p[0]}')"><i class="fa ${p[2]}"></i><span>${H(p[1])}</span></button>`).join('')}</div>`)}
{const _g=go;go=function(){const r=_g.apply(this,arguments);try{navGTabs()}catch(e){}return r}}

/* "All pages": every page this person may open, by group, in one small window (also in Settings > Side menu and all pages, and Ctrl+K search) */
function navGAll(){const gs=navGList();$('mb').innerHTML=`<div class="flex items-center justify-between mb-3"><h3 class="font-bold text-lg"><i class="fa fa-layer-group mr-2"></i>All pages</h3><button onclick="cl()" class="px-3 py-1 rounded bg-gray-200 text-sm">Close</button></div>`+gs.map(g=>`<div class="mb-3"><div class="text-xs font-bold uppercase text-gray-500 mb-1"><i class="fa ${g.ic} mr-1"></i>${H(g.n)}</div><div class="flex flex-wrap gap-2">${g.pages.filter(p=>p[0]!='patient').map(p=>`<button type="button" class="gtab ${p[0]==V?'on':''}" onclick="cl();go('${p[0]}')"><i class="fa ${p[2]}"></i><span>${H(p[1])}</span></button>`).join('')}</div></div>`).join('');md.classList.replace('hidden','flex')}
