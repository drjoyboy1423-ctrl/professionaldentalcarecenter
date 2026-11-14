/* ---------- Lab staff and support staff: roles with NO access to patient records ----------
   Lab staff see only a masked list of prosthodontic lab orders (case number, initials, age, sex, prescribing doctor, order, notes) and update its status.
   Support staff (security, cleaners, drivers, marketing) only see their own pay and profile. */
const LAB_ST=['RECEIVED','IN_PRODUCTION','QUALITY_CHECK','DISPATCHED'],LAB_NM={RECEIVED:'Received',IN_PRODUCTION:'In production',QUALITY_CHECK:'Quality check',DISPATCHED:'Dispatched'};
const labRole=()=>!!U&&(U.role=='lab'||U.role=='support');
RN.lab=['labq','profile','settings'];RN.support=['mypay','profile','settings'];
let LQ={l:null,f:'open'};
async function labLoad(){try{LQ.l=await DB.labOrders()}catch(e){LQ.l=LQ.l||[];if(!isNet(e))alert(e.message)}if(V=='labq')go('labq')}
function labQPage(){if(!U||U.role!='lab')return '';if(LQ.l===null)labLoad();const all=LQ.l||[],L=all.filter(o=>LQ.f=='all'||(LQ.f=='open'?o.st!='DISPATCHED':o.st=='DISPATCHED')),
 chip=(k,t)=>`<button onclick="LQ.f='${k}';go('labq')" class="px-3 py-1.5 rounded-md text-sm border ${LQ.f==k?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${t}</button>`;
 const row=o=>`<div class="bg-white rounded-xl shadow p-3 mb-3 text-sm"><div class="flex justify-between gap-2 flex-wrap"><div><b>${H(o.type||'')}</b> ${o.urg&&o.urg!='Routine'?`<span class="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5 ml-1">${H(o.urg)}</span>`:''}<div class="text-xs text-gray-500">Case ${H(o.case)} &middot; ${H(o.initials)} &middot; ${H(o.age||'')} ${H(o.sex||'')} &middot; Dr ${H(o.doctor||'')}</div></div><span class="text-xs px-2 py-1 rounded-full h-fit ${o.st=='DISPATCHED'?'bg-green-100 text-green-800':'bg-amber-100 text-amber-800'}">${LAB_NM[o.st]||H(o.st)}</span></div>${o.note?`<div class="mt-1 text-gray-700">${H(o.note)}</div>`:''}<div class="text-xs text-gray-400 mt-1">${o.at?new Date(+o.at).toLocaleString():''}</div><div class="flex flex-wrap gap-1 mt-2">${LAB_ST.filter(s=>s!=o.st).map(s=>`<button onclick="labSet('${H(o.pid)}',${o.idx},'${s}')" class="px-2 py-1 rounded text-xs text-white ${s=='DISPATCHED'?'bg-green-600':'bg-gray-600'}">${LAB_NM[s]}</button>`).join('')}</div></div>`;
 return hd('Lab orders')+`<p class="text-sm text-gray-500 mb-3">Patient names and contact details are hidden. Update the status as work moves along; "Dispatched" tells the clinic it is ready.</p><div class="flex gap-2 mb-3">${chip('open','In progress ('+all.filter(o=>o.st!='DISPATCHED').length+')')}${chip('done','Dispatched')}${chip('all','All')}</div>`+(L.length?L.map(row).join(''):'<p class="text-sm text-gray-500">No orders here.</p>')}
async function labSet(pid,idx,st){try{await DB.labSet(pid,idx,st);await labLoad()}catch(e){alert(isNet(e)?'No internet. Try again when it is back.':(e.message||'Failed'))}}
/* these roles never read or write clinic data, so nothing is synced and they land on their own page */
{const _s=syncNow;syncNow=async function(){if(labRole())return;return _s.apply(this,arguments)}}
{const _g=go;go=function(v){if(labRole()){const ok=RN[U.role];if(!ok.includes(v))v=ok[0]}return _g.apply(this,arguments)}}
