/* ---------- Recent Patients: search + filters, sorting, exports and a visual summary of the filtered patients ---------- */
let PF={sex:'',amin:'',amax:'',st:'',pay:'',doc:'',cs:'',dx:'',reg:'all',from:'',to:'',sort:'new',chart:0};
const PF_REG=[['all','Any time'],['today','Today'],['w7','Last 7 days'],['m30','Last 30 days'],['m90','Last 90 days'],['yr','This year']];
const PF_ST=[['','Any status'],['open','Not finished'],['fin','Finished'],['due','Has unpaid balance'],['norec','No dental record yet']];
const PF_PAY=[['','Any payment'],['paid','Fully paid'],['cash','Paid in cash'],['rem','Has remaining balance'],['part','Part-paid (remaining)'],['credit','On credit (nothing paid yet)']];
const PF_SORT=[['new','Newest first'],['old','Oldest first'],['name','Name A - Z'],['card','Card number'],['age','Age (youngest)'],['bal','Highest balance']];
const pfDigits=s=>String(s||'').replace(/\D/g,'');
const pfBal=()=>{const m={};allInv().forEach(r=>{m[r.p.id]=(m[r.p.id]||0)+r.bal});return m};
const pfPayM=()=>{const m={};allInv().forEach(r=>{const o=m[r.p.id]||(m[r.p.id]={t:0,paid:0,bal:0,cash:0,n:0});o.n++;o.t+=r.t;o.paid+=r.paid;o.bal+=r.bal;payEvents(r).forEach(y=>{if(/^cash$/i.test(y.method))o.cash+=y.amt})});return m};
const pfPayOk=(k,o)=>{if(!k)return true;if(!o||!o.n)return false;return k=='paid'?o.bal<=.005:k=='cash'?o.cash>.005:k=='rem'?o.bal>.005:k=='part'?(o.bal>.005&&o.paid>.005):o.bal>.005&&o.paid<=.005};
const pfDx=p=>[...new Set((p.d.rec||[]).map(r=>r.finding).filter(Boolean))];
const pfCs=p=>[...new Set((p.d.rec||[]).map(r=>r.plancat).filter(Boolean))];
const pfLim=k=>({all:0,today:sod(NOW()),w7:NOW()-7*DAY,m30:NOW()-30*DAY,m90:NOW()-90*DAY,yr:new Date(new Date().getFullYear(),0,1).getTime()})[k]||0;
const pfActive=()=>(Q.trim()?1:0)+['sex','amin','amax','st','pay','doc','cs','dx'].filter(k=>PF[k]!=='').length+(PF.reg!='all'?1:0)+(PF.from?1:0)+(PF.to?1:0);
function pfList(bal){bal=bal||pfBal();const q=Q.trim().toLowerCase(),qd=pfDigits(Q),lim=pfLim(PF.reg),t0=PF.from?new Date(PF.from+'T00:00:00').getTime():0,t1=PF.to?new Date(PF.to+'T00:00:00').getTime()+DAY:0;
 const pm=PF.pay?pfPayM():null;
 const l=S.patients.filter(p=>{
  if(PF.pay&&!pfPayOk(PF.pay,pm[p.id]))return false;
  if(q){const hay=(p.name+' '+p.card+' '+p.phone+' '+(p.doc||'')+' '+(p.branch||'')).toLowerCase();if(!hay.includes(q)&&!(qd.length>=4&&pfDigits(p.phone).includes(qd.slice(-9))))return false}
  if(PF.sex&&p.sex!=PF.sex)return false;const a=+p.age;
  if(PF.amin!==''&&!(a>=+PF.amin))return false;if(PF.amax!==''&&!(a<=+PF.amax))return false;
  if(PF.doc&&p.doc!=PF.doc)return false;
  if(PF.st=='open'&&p.fin)return false;if(PF.st=='fin'&&!p.fin)return false;
  if(PF.st=='due'&&!(bal[p.id]>.005))return false;if(PF.st=='norec'&&(p.d.rec||[]).length)return false;
  if(PF.cs&&!pfCs(p).includes(PF.cs))return false;if(PF.dx&&!pfDx(p).includes(PF.dx))return false;
  if(t0&&p.date<t0)return false;if(t1&&p.date>=t1)return false;
  return !(lim&&p.date<lim)});
 const s=PF.sort,by={new:(a,b)=>b.date-a.date,old:(a,b)=>a.date-b.date,name:(a,b)=>String(a.name).localeCompare(String(b.name)),card:(a,b)=>(+a.card||0)-(+b.card||0),age:(a,b)=>(+a.age||0)-(+b.age||0),bal:(a,b)=>(bal[b.id]||0)-(bal[a.id]||0)};
 return l.sort(by[s]||by.new)}
function pfMonth(t){const d=new Date(t);if(typeof CALM_!='undefined'&&CALM_=='ec'){const e=toEC(d);return EC_M[e.m-1]+' '+e.y}return d.toLocaleString('en',{month:'short',year:'numeric'})}
function pfSummary(l,bal){const cnt=(a,f)=>{const m={};a.forEach(x=>{const k=f(x);if(k!=null&&k!=='')m[k]=(m[k]||0)+1});return m},top=(m,n)=>Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,n);
 const sex=cnt(l,p=>p.sex),age=cnt(l,p=>{const a=+p.age;return p.age===''||p.age==null||isNaN(a)?'Unknown':a<13?'Child (0-12)':a<18?'Teen (13-17)':a<36?'Adult (18-35)':a<56?'Adult (36-55)':'Senior (56+)'}),
  dx={},cs={};l.forEach(p=>{pfDx(p).forEach(k=>dx[k]=(dx[k]||0)+1);pfCs(p).forEach(k=>cs[k]=(cs[k]||0)+1)});
 const mo=[],now=new Date();for(let i=5;i>=0;i--){const a=new Date(now.getFullYear(),now.getMonth()-i,1).getTime(),b=new Date(now.getFullYear(),now.getMonth()-i+1,1).getTime();mo.push([pfMonth(a),l.filter(p=>p.date>=a&&p.date<b).length])}
 return {sex:top(sex,5),age:['Child (0-12)','Teen (13-17)','Adult (18-35)','Adult (36-55)','Senior (56+)','Unknown'].filter(k=>age[k]).map(k=>[k,age[k]]),dx:top(dx,8),cs:top(cs,7),mo,due:sum(l,p=>bal[p.id]||0),dueN:l.filter(p=>bal[p.id]>.005).length}}
function pfSummaryHtml(l,bal){const d=pfSummary(l,bal),blk=(t,items)=>`<div class="bg-white rounded-lg shadow p-4"><h4 class="font-bold mb-2 text-sm">${t}</h4>${items.length?hbar(items):'<p class="text-xs text-gray-500">No data.</p>'}</div>`;
 return `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-center"><div class="bg-white rounded-lg shadow p-3"><div class="text-2xl font-bold">${l.length}</div><div class="text-xs text-gray-500">Patients</div></div><div class="bg-white rounded-lg shadow p-3"><div class="text-2xl font-bold">${d.dueN}</div><div class="text-xs text-gray-500">With unpaid balance</div></div><div class="bg-white rounded-lg shadow p-3 col-span-2"><div class="text-xl font-bold">${ETB(d.due)}</div><div class="text-xs text-gray-500">Total outstanding</div></div></div>
 <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">${blk('Sex',d.sex)}${blk('Age groups',d.age)}${blk('Top diagnoses',d.dx)}${blk('Case types (Rx plan)',d.cs)}${blk('New patients, last 6 months',d.mo)}</div>`}
function pfRows(l,bal){return l.map(p=>[p.card,p.name,p.sex,p.age,p.phone,p.doc||'',fd(p.date),pfDx(p).join('; '),bal[p.id]||0])}
const PF_HEAD=['Card','Name','Sex','Age','Phone','Doctor','Registered','Diagnosis','Balance'];
function pfCsv(){const b=pfBal();csvDl('patients',PF_HEAD,pfRows(pfList(b),b))}
function pfPrint(){const b=pfBal(),l=pfList(b),f=[Q.trim()&&'search "'+Q.trim()+'"',PF.from&&'from '+fdate(PF.from),PF.to&&'to '+fdate(PF.to),PF.sex,PF.st&&(PF_ST.find(x=>x[0]==PF.st)||[])[1],PF.pay&&(PF_PAY.find(x=>x[0]==PF.pay)||[])[1],PF.doc,PF.cs,PF.dx].filter(Boolean).join(', ');
 printHtml('Patients',docHead('Patient List',H(l.length+' patients'+(f?' - '+f:'')))+tbl2(PF_HEAD,pfRows(l,b).map(r=>r.map((v,i)=>i==8?ETB(v):H(v))),null,[8])+(PF.chart?'<h2>Summary</h2>'+pfSummaryPrint(l,b):''))}
function pfSummaryPrint(l,b){const d=pfSummary(l,b),t=(n,a)=>a.length?`<div class="blk"><b>${n}</b>${tbl2(['Item','Patients'],a.map(x=>[H(x[0]),x[1]]),null,[1])}</div>`:'';return t('Sex',d.sex)+t('Age groups',d.age)+t('Top diagnoses',d.dx)+t('Case types',d.cs)+t('New patients, last 6 months',d.mo)}
function pfSet(k,v){PF[k]=v;pfUp()}
function pfDt(k){const e=$('pf_'+k),w=e&&e.closest('.rf-dt');if(w)w.dataset.un='';PF[k]=e?e.value:'';pfUp()}
function pfDtClr(k){const w=$('pf_'+k+'w');if(w)w.dataset.un='1';PF[k]='';pfUp()}
const pfDtF=(k,t)=>`<div id="pf_${k}w" class="rf-dt" data-un="${PF[k]?'':'1'}"><label class="block text-xs font-medium text-gray-600 mb-1">${t}<span class="rf-un">any date</span><a class="rf-clr" onclick="pfDtClr('${k}')">clear</a></label>${dateField('pf_'+k,PF[k]||undefined,"pfDt('"+k+"')")}</div>`;
function pfClear(){PF={sex:'',amin:'',amax:'',st:'',pay:'',doc:'',cs:'',dx:'',reg:'all',from:'',to:'',sort:PF.sort,chart:PF.chart};Q='';const q=$('q');if(q)q.value='';go('recent')}
function pfRes(){const bal=pfBal(),b=bal,l=pfList(bal),n=pfActive(),can=canDel();
 const rows=l.map(p=>`<tr class="border-b hover:bg-gray-50 cursor-pointer" onclick="go('patient','${p.id}')"><td class="p-2">${H(p.card)}</td><td><div class="flex items-center gap-2">${ph(p,'w-7 h-7')}<span>${H(p.name)}</span></div></td><td class="hidden sm:table-cell">${H(p.sex||'')} ${H(p.age||'')}</td><td>${telA(p.phone)}</td><td class="hidden md:table-cell">${H(p.doc||'')}</td><td>${ds(p.date)}</td><td class="hidden sm:table-cell text-right">${bal[p.id]>.005?`<span class="text-rose-600">${ETB(bal[p.id])}</span>`:''}</td><td class="text-rose-600" ${can?`onclick="event.stopPropagation();delPat('${p.id}')"`:''}>${can?'<i class="fa fa-trash"></i>':''}</td></tr>`).join('');
 return `<div class="flex flex-wrap items-center justify-between gap-2 mb-2"><div class="text-sm text-gray-600"><b>${l.length}</b> of ${S.patients.length} patients${n?` <span class="text-xs">(${n} filter${n>1?'s':''} on)</span>`:''}</div><div class="flex flex-wrap gap-2"><button onclick="PF.chart=!PF.chart;pfUp()" class="px-3 py-1.5 rounded-md text-sm ${PF.chart?'bg-red-600 text-white':'bg-gray-200'}"><i class="fa fa-chart-pie mr-1"></i>Summary charts</button><button onclick="pfCsv()" class="bg-gray-200 px-3 py-1.5 rounded-md text-sm"><i class="fa fa-file-csv mr-1"></i>CSV</button><button onclick="asPdf('patients',pfPrint)" class="bg-gray-200 px-3 py-1.5 rounded-md text-sm"><i class="fa fa-file-pdf mr-1"></i>PDF</button><button onclick="pfPrint()" class="bg-gray-200 px-3 py-1.5 rounded-md text-sm"><i class="fa fa-print mr-1"></i>Print</button></div></div>
 ${PF.chart?pfSummaryHtml(l,b):''}<div class="bg-white rounded-lg shadow p-3"><div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left border-b"><th class="p-2">Card</th><th>Name</th><th class="hidden sm:table-cell">Sex / Age</th><th>Phone</th><th class="hidden md:table-cell">Doctor</th><th>Registered</th><th class="hidden sm:table-cell text-right">Balance</th><th></th></tr>${rows||'<tr><td colspan="8" class="p-4 text-center text-gray-500">No patients match. Try clearing some filters.</td></tr>'}</table></div></div>`}
function pfUp(){const e=$('pfres');if(e)e.innerHTML=pfRes();const c=$('pfcount');if(c){const n=pfActive();c.textContent=n?n+' on':''}}
function recent(){const sel=(k,opts)=>`<select onchange="pfSet('${k}',this.value)" class="inp" aria-label="${k}">${opts.map(o=>`<option value="${H(o[0])}" ${PF[k]==o[0]?'selected':''}>${H(o[1])}</option>`).join('')}</select>`,
  docs=[...new Set(S.patients.map(p=>p.doc).filter(Boolean))].sort(),dxs=[...new Set(S.patients.flatMap(pfDx))].sort(),n=pfActive(),lbl=t=>`<label class="block text-xs font-medium text-gray-600 mb-1">${t}</label>`;
 return hd('Recent Patients',canAdd()?gb('New Patient +','newPat()'):'')+
 `<details class="bg-white rounded-lg shadow mb-3" ${n?'open':''}><summary class="p-3 cursor-pointer font-medium"><i class="fa fa-filter mr-2 text-red-600"></i>Search filters <span id="pfcount" class="text-xs text-red-600 ml-1">${n?n+' on':''}</span></summary><div class="p-3 pt-0"><p class="text-xs text-gray-500 mb-3">The search box above finds name, card number, phone (any format) or doctor. Use these filters to narrow further.</p>
 <div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div>${lbl('Sex')}${sel('sex',[['','Any'],['Female','Female'],['Male','Male']])}</div><div>${lbl('Age from')}<input type="number" min="0" inputmode="numeric" class="inp" value="${H(PF.amin)}" oninput="pfSet('amin',this.value)"></div><div>${lbl('Age to')}<input type="number" min="0" inputmode="numeric" class="inp" value="${H(PF.amax)}" oninput="pfSet('amax',this.value)"></div><div>${lbl('Status')}${sel('st',PF_ST)}</div><div>${lbl('Payment')}${sel('pay',PF_PAY)}</div>
 <div>${lbl('Doctor')}${sel('doc',[['','Any doctor'],...docs.map(d=>[d,d])])}</div><div>${lbl('Case type (Rx plan)')}${sel('cs',[['','Any case type'],...RXCAT.filter(Boolean).map(c=>[c,c])])}</div><div>${lbl('Diagnosis')}${sel('dx',[['','Any diagnosis'],...dxs.map(d=>[d,d])])}</div><div>${lbl('Registered')}${sel('reg',PF_REG)}</div>
 <div>${pfDtF('from','Registered from')}</div><div>${pfDtF('to','Registered to')}</div><div>${lbl('Sort by')}${sel('sort',PF_SORT)}</div><div class="flex items-end"><button onclick="pfClear()" class="px-3 py-2 rounded-md bg-gray-200 text-sm w-full"><i class="fa fa-xmark mr-1"></i>Clear all</button></div></div></div></details><div id="pfres">${pfRes()}</div>`}
