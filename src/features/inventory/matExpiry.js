/* ---------- Dental materials: expiry dates, warnings and reorder suggestions ---------- */
const EXPD=60; /* warn this many days before a material expires */
const expDays=m=>{if(!m.exp||!/^\d{4}-\d{2}-\d{2}/.test(m.exp))return null;return Math.floor((new Date(m.exp.slice(0,10)+'T23:59:59').getTime()-NOW())/DAY)};
const expState=m=>{if(m.q<=0)return '';const d=expDays(m);return d==null?'':d<0?'exp':d<=EXPD?'soon':''};
const expLabel=m=>{const d=expDays(m);if(d==null)return '';const s=expState(m),t='Expires '+fdate(m.exp.slice(0,10));return `<span class="${s=='exp'?'text-red-600 font-semibold':s=='soon'?'text-amber-700 font-semibold':'text-gray-500'}">${t}${s=='exp'?' (EXPIRED)':s=='soon'?' ('+d+' day'+(d==1?'':'s')+' left)':''}</span> &middot; `};
const expList=()=>stockInit().items.filter(m=>expState(m));
const sugQty=m=>Math.max(m.min*2-m.q,m.min,1);
function expBanner(){if(!S.stock)return '';const L=expList();if(!L.length)return '';return `<div class="bg-red-50 border border-red-400 rounded-lg p-3 text-sm mb-4 cursor-pointer" onclick="go('mat')"><b><i class="fa fa-hourglass-end mr-1"></i>Materials expiring:</b> ${L.map(m=>H(m.n)+(expState(m)=='exp'?' (EXPIRED)':' ('+expDays(m)+' d)')).join('; ')}</div>`}
const _sbExp=sterBanner;sterBanner=function(){return _sbExp.apply(this,arguments)+expBanner()};
/* new / edit forms get an expiry date */
const EXPF=['exp','Expiry date (optional - leave empty if none)','date'];
function matNew(){if(!canMat())return;form('New material',[['n','Name'],['u','Unit (box, pack, bottle...)'],['q','Quantity in stock','number'],['min','Reorder level (alert when at or below)','number'],EXPF],{u:'box',q:0,min:3,exp:''},v=>{if(!v.n)return bad('Enter a name.');stockInit().items.push({id:'m'+Date.now(),n:v.n,u:v.u||'unit',q:Math.max(0,Math.floor(+v.q||0)),min:Math.max(0,Math.floor(+v.min||0)),st:'ok',po:null,exp:v.exp||''});matSave()})}
function matEdit(id){if(!canMat())return;const m=mById(id);if(!m)return;form('Edit material',[['n','Name'],['u','Unit'],['q','Quantity in stock','number'],['min','Reorder level','number'],EXPF],m,v=>{if(!v.n)return bad('Enter a name.');m.n=v.n;m.u=v.u||'unit';m.q=Math.max(0,Math.floor(+v.q||0));m.min=Math.max(0,Math.floor(+v.min||0));m.exp=v.exp||'';matSave()})}
/* receiving stock asks for the batch expiry; the nearest date still in stock is kept */
function matAdd(id){if(!canMat())return;const m=mById(id);if(!m)return;form('Add stock - '+m.n,[['q','Quantity received ('+m.u+')','number'],EXPF],{q:1,exp:''},v=>{const q=Math.floor(+v.q);if(!(q>0))return bad('Enter a quantity above 0.');const had=m.q>0&&expDays(m)!=null&&expDays(m)>=0;m.q+=q;
  if(v.exp){m.exp=(had&&m.exp&&m.exp<v.exp)?m.exp:v.exp}
  if(m.st=='ordered'){m.st='ok';if(m.po)m.po.done=1;m.po=null}S.stock.log.push({t:Date.now(),id:m.id,n:m.n,q,by:U.name,k:'in'});matSave()})}
/* page: expiry shown under each material + a "suggested to buy" box */
const _matPageE=matPage;matPage=function(){let h=_matPageE.apply(this,arguments);if(!h)return h;const s=stockInit();
 s.items.forEach(m=>{if(m.exp){const k='<b>'+H(m.n)+'</b><div class="text-xs text-gray-500">';h=h.replace(k,()=>k+expLabel(m))}});
 const need=s.items.filter(m=>m.st!='ordered'&&(m.q<=m.min||expState(m)=='exp'||expState(m)=='soon')&&!matOpenReq(m.id));
 if(need.length){const W=canMat(),P=canPo(),box=`<div class="bg-white rounded-lg shadow p-4 mb-4"><h3 class="font-bold mb-2"><i class="fa fa-lightbulb mr-1 text-amber-500"></i>Suggested to buy (${need.length})</h3>${need.map(m=>{const why=m.q<=0?'Out of stock':m.q<=m.min?'Low ('+m.q+' left)':expState(m)=='exp'?'Expired - replace':'Expires soon - replace';return `<div class="flex flex-wrap justify-between gap-2 border-b py-2 text-sm"><div><b>${sugQty(m)} ${H(m.u)} &times; ${H(m.n)}</b><div class="text-xs text-gray-500">${why}</div></div>${W?(P?`<button onclick="matOrder('${m.id}')" class="bg-red-600 text-white rounded px-2 py-1 text-xs self-center">Order Now</button>`:`<button onclick="matReq('${m.id}')" class="bg-amber-500 text-white rounded px-2 py-1 text-xs self-center">Request</button>`):''}</div>`}).join('')}</div>`;
  h=h.replace('<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">',()=>box+'<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">')}
 const ex=expList();if(ex.length){const bn=expBanner().replace(' cursor-pointer" onclick="go(\'mat\')"','"');h=h.replace('<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">',()=>bn+'<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">')}return h};
/* the reorder / request forms suggest a sensible quantity */
