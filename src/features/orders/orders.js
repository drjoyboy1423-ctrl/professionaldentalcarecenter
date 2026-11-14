/* ---------- Doctor orders workflow: assign doctor, place order, orders inbox, tracker, directory, finished list ---------- */
const ORD={
 xr:{t:'Dental X-Rays',i:'fa-x-ray',o:['IOPA (periapical)','Bitewing','Occlusal','CBCT','Panoramic (OPG)','Lateral Cephalometric','Posterior-Anterior (PA) Skull']},
 cl:{t:'Clinical Lab Tests',i:'fa-vial',o:['INR','RFT (Renal Function Test)','LFT (Liver Function Test)','CBC','Blood glucose (FBS / RBS)','HbA1c','Bleeding / Clotting time','HBsAg / HCV / HIV','Other (write in note)']},
 pl:{t:'Prosthodontic Lab',i:'fa-tooth',o:['Crown (PFM)','Crown (Zirconia)','Bridge','Complete denture','Partial denture','Veneer','Inlay / Onlay','Post & core','Night guard','Implant crown','Other (write in note)']},
 rx:{t:'Drug Prescriptions',i:'fa-pills',o:[...MEDS,'Other (write in note)']},
 bl:{t:'Invoices / Billing',i:'fa-file-invoice-dollar',o:['Treatment invoice','Proforma / estimate','Payment plan','Letter / insurance form']}
};
const canOrder=()=>!!U&&['doctor','admin'].includes(U.role),canDone=()=>!!U&&['reception','manager','admin'].includes(U.role);
const ordList=P=>{const L=[];(P||S.patients).forEach(p=>((p.d||{}).ord||[]).forEach((o,i)=>L.push({p,o,i})));return L.sort((a,b)=>b.o.at-a.o.at)};
const ordBadge=o=>o.st=='done'?'<span class="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Completed</span>':'<span class="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span>';
const ordUrg=o=>o.urg=='Urgent'?'<span class="px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">Urgent</span>':'<span class="text-xs text-gray-500">Routine</span>';
const ordTag=n=>`<span class="inline-block bg-red-600 text-white rounded-full text-[11px] leading-none px-1.5 py-1 ml-1">${n}</span>`;
let OD={pid:null,cat:'xr'},OF={t:'all',s:'pending'},OT='pending',DT='act',DQ='';

/* --- place an order --- */
function ordNew(pid){if(!canOrder())return;const p=S.patients.find(x=>x.id==pid);if(!p)return;if(!ptW(p,'rec'))return alert(ptMsg(p));if(p.fin)return alert('This patient is finished. Reactivate the patient first.');OD={pid,cat:'xr'};ordPaint()}
function ordCat(k){OD.cat=k;ordPaint()}
function ordPaint(){const p=S.patients.find(x=>x.id==OD.pid),c=ORD[OD.cat];if(!p)return;
 $('mb').innerHTML=`<h3 class="font-bold text-xl mb-1">Place Order</h3><p class="text-sm text-gray-600 mb-3">${H(p.name)} &middot; Card ${H(p.card)}</p>
 <div class="grid grid-cols-2 gap-2 mb-3">${Object.keys(ORD).map(k=>`<button onclick="ordCat('${k}')" class="border rounded-lg p-2 text-sm text-left ${k==OD.cat?'bg-red-50 border-red-400 text-red-700 font-semibold':'bg-white'}"><i class="fa ${ORD[k].i} mr-1"></i>${ORD[k].t}</button>`).join('')}</div>
 <label class="block text-sm font-medium mb-1">${c.t} - type</label><select id="o_t" class="inp mb-3">${c.o.map(o=>`<option>${H(o)}</option>`).join('')}</select>
 <label class="block text-sm font-medium mb-1">Priority</label><select id="o_u" class="inp mb-3"><option>Routine</option><option>Urgent</option></select>
 <label class="block text-sm font-medium mb-1">Instructions / tooth numbers / dose</label><textarea id="o_n" rows="3" class="inp mb-3"></textarea>
 <div class="flex justify-end gap-2"><button onclick="cl()" class="px-4 py-2 rounded bg-gray-200">Cancel</button><button onclick="ordSave()" class="px-4 py-2 rounded bg-red-600 text-white">Send order</button></div>`;md.classList.replace('hidden','flex')}
function ordSave(){const p=S.patients.find(x=>x.id==OD.pid),c=ORD[OD.cat];if(!p)return;const type=$('o_t').value,note=$('o_n').value.trim(),urg=$('o_u').value;
 if(/^Other/.test(type)&&!note)return bad('Please write the details in the instructions box.');
 const o={id:'o'+Date.now()+Math.floor(Math.random()*99),cat:OD.cat,type,note,urg,by:U.name,at:Date.now(),st:'pending'};
 (p.d.ord=p.d.ord||[]).push(o);
 mkItem('note',{title:'Order: '+c.t+' - '+type,note:(urg=='Urgent'?'URGENT. ':'')+(note||'No extra instructions.')},p);
 if(['xr','cl','pl'].includes(OD.cat)){const x=mkItem('lab',{req:type+(note?' - '+note:''),lab:c.t,done:'No'},p);x.ord=o.id}
 sv();cl();toast('Order sent to reception',1);go(V)}
function ordDone(pid,id){if(!canDone())return;const p=S.patients.find(x=>x.id==pid),o=p&&(p.d.ord||[]).find(x=>x.id==id);if(!o)return;o.st='done';o.doneAt=Date.now();o.doneBy=U.name;(p.d.lab||[]).forEach(x=>{if(x.ord==id)x.done='Yes'});sv();go(V)}
function ordUndo(pid,id){if(!canDone())return;const p=S.patients.find(x=>x.id==pid),o=p&&(p.d.ord||[]).find(x=>x.id==id);if(!o||!confirm('Mark this order as pending again?'))return;o.st='pending';delete o.doneAt;delete o.doneBy;(p.d.lab||[]).forEach(x=>{if(x.ord==id)x.done='No'});sv();go(V)}

/* --- assign doctor / finish --- */
async function assignDoc(pid){if(!['reception','manager','admin'].includes(U.role))return;const p=S.patients.find(x=>x.id==pid);if(!p)return;const docs=await docEnsure();if(!docs.length)return alert('No doctors found for this clinic. Add a doctor in Users first.');
 form('Assign Doctor',[['doctor','Doctor for '+p.name,'sel',docs]],{doctor:p.doc},v=>{p.doc=v.doctor;p.doctor=v.doctor;sv();go(V)})}
function ordFin(pid){const p=S.patients.find(x=>x.id==pid);if(!p||!ptW(p,'rec'))return;
 if(!p.fin&&!confirm('Mark '+p.name+' as finished / inactive? The patient moves to the Finished list.'))return;p.fin=!p.fin;sv();go(V)}

/* --- dashboards --- */
const ordTile=(l,v,c,i)=>`<div class="bg-white rounded-xl shadow p-3 border-l-4 ${c}"><div class="text-xs text-gray-500"><i class="fa ${i} mr-1"></i>${l}</div><div class="text-2xl font-bold">${v}</div></div>`;
function ordStats(){const L=ordList(),pend=L.filter(r=>r.o.st=='pending').length,t0=sod(NOW()),dn=L.filter(r=>r.o.st=='done'&&r.o.doneAt>=t0).length;
 return `<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">${ordTile('Total New Orders',pend,'border-amber-400','fa-clipboard-list')}${ordTile('Completed today',dn,'border-green-500','fa-check')}${ordTile('Active patients',S.patients.filter(p=>!p.fin).length,'border-sky-400','fa-user-injured')}${ordTile('Not assigned to a doctor',S.patients.filter(p=>!p.fin&&!p.doc).length,'border-red-400','fa-user-slash')}</div>`}
function docDash(){const me=U.name,mine=S.patients.filter(p=>p.doc==me||(p.spec||[]).includes(me)),act=mine.filter(p=>!p.fin),fn=mine.filter(p=>p.fin),mo=ordList().filter(r=>r.o.by==me),pend=mo.filter(r=>r.o.st=='pending').length,dn=mo.length-pend;
 const L=dsort(DT=='fin'?fn:act,p=>p.arr),N={new:'New',doctor:'Seen by Doctor',nurse:'Seen by Nurse'};
 const T=[['act','My Active Patients ('+act.length+')'],['fin','My Finished Patients ('+fn.length+')']];
 return quick()+`<h2 class="text-2xl font-bold">My Patients</h2><p class="text-gray-600 mb-4">Only patients assigned to you by reception are shown here.</p>
 <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">${ordTile('Active patients',act.length,'border-sky-400','fa-user-injured')}${ordTile('Finished',fn.length,'border-gray-400','fa-user-check')}${ordTile('My orders pending',pend,'border-amber-400','fa-hourglass-half')}${ordTile('My orders completed',dn,'border-green-500','fa-check')}</div>
 <div class="bg-white rounded-lg p-4 mb-4 flex flex-wrap gap-2">${T.map(t=>`<button onclick="DT='${t[0]}';go('dash')" class="px-3 py-2 rounded-md text-sm border ${DT==t[0]?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${t[1]}</button>`).join('')}</div>
 <div class="bg-white rounded-lg shadow">${L.map(p=>{const po=(p.d.ord||[]).filter(o=>o.st=='pending').length;return `<div class="p-4 border-l-4 border-b ${p.fin?'border-gray-300':'border-red-400'}"><div class="flex justify-between gap-2"><b class="cursor-pointer hover:underline" onclick="go('patient','${p.id}')">${orBadge(p)}${H(p.name)}</b><span class="text-xs bg-gray-100 rounded-full px-3 py-1 h-fit">${p.fin?'Finished':N[p.st]||'New'}</span></div>
 <div class="grid grid-cols-2 text-sm mt-2 gap-y-1"><span>Sex: ${H(p.sex)} ${p.age?'&middot; '+H(p.age)+' yrs':''}</span><span>Card: ${H(p.card)}</span><span>Arrived: ${ago(p.arr)}</span>${po?`<span class="text-amber-700">${po} order${po>1?'s':''} pending</span>`:''}</div>
 <div class="text-right text-sm mt-2 flex flex-wrap gap-4 justify-end"><span class="cursor-pointer text-gray-600" onclick="go('patient','${p.id}')"><i class="fa fa-folder-open"></i> History</span>${p.fin?'':`<span class="cursor-pointer text-red-600" onclick="ordNew('${p.id}')"><i class="fa fa-file-circle-plus"></i> Place Order</span>`}<span class="cursor-pointer text-green-700" onclick="ordFin('${p.id}')"><i class="fa fa-${p.fin?'rotate-left':'user-check'}"></i> ${p.fin?'Reactivate':'Mark finished'}</span></div></div>`}).join('')||'<p class="p-6 text-gray-500">No patients here yet.</p>'}</div>`}

/* --- Orders inbox (reception / manager / admin) --- */
function ordersPage(){const L=ordList(),cnt=k=>L.filter(r=>r.o.st=='pending'&&(k=='all'||r.o.cat==k)).length,f=dsort(L,r=>r.o.at).filter(r=>(OF.t=='all'||r.o.cat==OF.t)&&(OF.s=='all'||r.o.st==OF.s));
 const tb=(k,l)=>`<button onclick="OF.t='${k}';go('ord')" class="px-3 py-2 rounded-md text-sm border ${OF.t==k?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${l}${cnt(k)?ordTag(cnt(k)):''}</button>`,sb=(k,l)=>`<button onclick="OF.s='${k}';go('ord')" class="px-3 py-2 rounded-md text-sm border ${OF.s==k?'bg-gray-700 text-white':'bg-gray-100'}">${l}</button>`;
 return hd('Orders Inbox')+ordStats()+`<div class="bg-white rounded-lg p-3 mb-3 flex flex-wrap gap-2">${tb('all','All types')}${Object.keys(ORD).map(k=>tb(k,ORD[k].t)).join('')}</div><div class="bg-white rounded-lg p-3 mb-4 flex flex-wrap gap-2">${sb('pending','Pending')}${sb('done','Completed')}${sb('all','All')}</div>`+
 card('',f.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left border-b"><th class="p-2">Ordered</th><th>Patient</th><th>Doctor</th><th>Category</th><th>Order</th><th>Priority</th><th>Status</th><th></th></tr>${f.map(r=>`<tr class="border-b align-top"><td class="p-2 whitespace-nowrap">${fd(r.o.at)}<div class="text-xs text-gray-500">${ft(r.o.at)}</div></td><td><b class="cursor-pointer hover:underline" onclick="go('patient','${r.p.id}')">${H(r.p.name)}</b><div class="text-xs text-gray-500">Card ${H(r.p.card)}</div></td><td>${H(r.o.by)}</td><td><i class="fa ${ORD[r.o.cat].i} text-red-600 mr-1"></i>${ORD[r.o.cat].t}</td><td><b>${H(r.o.type)}</b>${r.o.note?`<div class="text-xs text-gray-600">${H(r.o.note)}</div>`:''}</td><td>${ordUrg(r.o)}</td><td>${ordBadge(r.o)}${r.o.doneBy?`<div class="text-xs text-gray-500">${H(r.o.doneBy)}</div>`:''}</td><td class="text-right pr-2 whitespace-nowrap">${r.o.st=='pending'?(canDone()?`<button onclick="ordDone('${r.p.id}','${r.o.id}')" class="bg-green-600 text-white px-3 py-1 rounded text-xs">Mark Completed</button>`:''):(canDone()?`<span class="text-xs text-gray-500 cursor-pointer" onclick="ordUndo('${r.p.id}','${r.o.id}')"><i class="fa fa-rotate-left"></i> Undo</span>`:'')}</td></tr>`).join('')}</table></div>`:'<p class="text-gray-500 p-4">No orders match.</p>')}

/* --- Doctor's order tracker --- */
function ordTracker(){const mine=ordList().filter(r=>r.o.by==U.name),f=dsort(mine,r=>r.o.at).filter(r=>r.o.st==OT),n=s=>mine.filter(r=>r.o.st==s).length;
 const tb=(k,l)=>`<button onclick="OT='${k}';go('tra')" class="px-3 py-2 rounded-md text-sm border ${OT==k?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${l} (${n(k)})</button>`;
 return hd('My Order Tracker')+`<div class="bg-white rounded-lg p-3 mb-4 flex flex-wrap gap-2">${tb('pending','Pending')}${tb('done','Completed')}</div>`+
 card('',f.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left border-b"><th class="p-2">Ordered</th><th>Patient</th><th>Category</th><th>Order</th><th>Priority</th><th>Status</th></tr>${f.map(r=>`<tr class="border-b align-top"><td class="p-2 whitespace-nowrap">${fd(r.o.at)}<div class="text-xs text-gray-500">${ft(r.o.at)}</div></td><td><b class="cursor-pointer hover:underline" onclick="go('patient','${r.p.id}')">${H(r.p.name)}</b></td><td><i class="fa ${ORD[r.o.cat].i} text-red-600 mr-1"></i>${ORD[r.o.cat].t}</td><td><b>${H(r.o.type)}</b>${r.o.note?`<div class="text-xs text-gray-600">${H(r.o.note)}</div>`:''}</td><td>${ordUrg(r.o)}</td><td>${ordBadge(r.o)}${r.o.doneAt?`<div class="text-xs text-gray-500">${fd(r.o.doneAt)}</div>`:''}</td></tr>`).join('')}</table></div>`:'<p class="text-gray-500 p-4">Nothing here.</p>')}

/* --- All Patients (Directory): read-only, newest registration first --- */
function dirRows(){const q=DQ.toLowerCase().trim(),L=dsort(S.patients,p=>p.date).filter(p=>!q||[p.name,p.card,p.phone,p.doc].join(' ').toLowerCase().includes(q));
 return L.map((p,i)=>`<tr class="border-b"><td class="p-2">${i+1}</td><td>${H(p.card)}</td><td><b>${H(p.name)}</b></td><td>${H(p.sex)}</td><td>${H(p.age||'-')}</td><td>${H(p.phone)}</td><td>${p.doc?H(p.doc):'<span class="text-xs text-gray-400">Not assigned</span>'}</td><td class="whitespace-nowrap">${fd(p.date)}<div class="text-xs text-gray-500">${ft(p.date)}</div></td><td>${p.fin?'<span class="px-2 py-0.5 rounded-full text-xs bg-gray-100">Finished</span>':'<span class="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Active</span>'}</td></tr>`).join('')||'<tr><td colspan="9" class="p-4 text-gray-500">No patients.</td></tr>'}
function dirQ(v){DQ=v;$('dirb').innerHTML=dirRows()}
function dirPage(){return hd('All Patients (Directory)')+`<p class="text-gray-600 mb-3 text-sm">Read-only list of every patient in this clinic, newest registration first. Open records from your own patient list.</p><input class="inp mb-3" placeholder="Search name, card, phone or doctor" value="${H(DQ)}" oninput="dirQ(this.value)">`+card('',`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left border-b"><th class="p-2">#</th><th>Card</th><th>Name</th><th>Sex</th><th>Age</th><th>Phone</th><th>Doctor</th><th>Registered</th><th>Status</th></tr><tbody id="dirb">${dirRows()}</tbody></table></div>`)}

/* --- Finished / Inactive --- */
function donePage(){const L=dsort(S.patients.filter(p=>p.fin&&(U.role!='doctor'||p.doc==U.name)),p=>p.date),can=p=>ptW(p,'rec');
 return hd('Finished / Inactive Patients')+card('',L.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left border-b"><th class="p-2">Card</th><th>Name</th><th>Doctor</th><th>Registered</th><th>Orders</th><th></th></tr>${L.map(p=>`<tr class="border-b"><td class="p-2">${H(p.card)}</td><td><b class="cursor-pointer hover:underline" onclick="go('patient','${p.id}')">${H(p.name)}</b></td><td>${H(p.doc||'-')}</td><td>${fd(p.date)}</td><td>${(p.d.ord||[]).length}</td><td class="text-right pr-2">${can(p)?`<span class="text-green-700 cursor-pointer text-xs" onclick="ordFin('${p.id}')"><i class="fa fa-rotate-left"></i> Reactivate</span>`:''}</td></tr>`).join('')}</table></div>`:'<p class="text-gray-500 p-4">No finished patients.</p>')}

/* --- notifications: order arrived / ready -> reception, manager, nurse; own order ready -> doctor; patient assigned -> doctor; item request -> manager and doctors --- */
function ordNf(){if(!U||!C||typeof nfLoad!='function')return;const key='on:'+(U.id||U.username)+':'+C.id,me=U.name,role=U.role,st0=(()=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}})(),os={},asg={},rq={};
 ordList().forEach(r=>{os[r.o.id]=r.o.st});S.patients.forEach(p=>{asg[p.id]=p.doc||''});((S.stock&&S.stock.req)||[]).forEach(x=>{rq[x.id]=1});
 const save=()=>{try{localStorage.setItem(key,JSON.stringify({os,asg,rq}))}catch(e){}};if(!st0){save();return}
 const add=[],watch=['reception','manager','admin','nurse'].includes(role);
 ordList().forEach(r=>{const was=st0.os[r.o.id];
  if(was===undefined&&watch&&r.o.by!=me)add.push({t:'New order',m:r.o.type+' - '+r.p.name+' ('+r.o.by+')',pid:r.p.id,sk:'note'});
  if(was=='pending'&&r.o.st=='done'&&((role=='doctor'&&r.o.by==me)||(watch&&r.o.doneBy!=me)))add.push({t:'Order ready',m:r.o.type+' - '+r.p.name,pid:r.p.id,sk:'note'})});
 if(role=='doctor')S.patients.forEach(p=>{if(p.doc==me&&st0.asg[p.id]!==undefined&&st0.asg[p.id]!=me)add.push({t:'Patient assigned to you',m:p.name,pid:p.id,sk:'rec'})});
 if(['manager','doctor','admin'].includes(role)&&S.stock)(S.stock.req||[]).forEach(x=>{if(st0.rq&&!st0.rq[x.id]&&x.by!=me)add.push({t:'Item request',m:x.q+' x '+x.n+' ('+x.by+')',pid:0,sk:'rec'})});
 save();if(!add.length)return;const n=nfLoad()||{pts:{},lab:{},ap:{},list:[]};n.list=add.map(a=>({...a,ts:Date.now(),r:0})).concat(n.list||[]).slice(0,50);nfSave(n);nfBadge();toast(add.length==1?add[0].t+': '+add[0].m:add.length+' new notifications')}
const _apo=applyData;applyData=function(){const r=_apo.apply(this,arguments);try{ordNf()}catch(e){}return r};
