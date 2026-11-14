/* ---------- Who is in the clinic today: reception marks the doctors / nurses / therapists present, then assigns waiting patients to someone who is ready ---------- */
let DUTYL={c:'',l:[]};
const dutyOn=n=>{const d=(S.stock&&S.stock.duty)||{};return d.d==isoD(Date.now())&&(d.n||[]).includes(n)};
const dutyTag=n=>dutyOn(n)?' - in clinic':'';
const dutyCan=()=>!!U&&['reception','manager','admin'].includes(U.role);
const dutyLoad=()=>{if(DUTYL.c==C.id)return;DUTYL={c:C.id,l:[]};DB.staff(C.id).then(l=>{DUTYL={c:C.id,l};if(V=='dash')go('dash')}).catch(()=>{})};
function dutySet(n,on){const s=stockInit(),t=isoD(Date.now());if(!s.duty||s.duty.d!=t)s.duty={d:t,n:[]};s.duty.n=s.duty.n.filter(x=>x!=n);if(on)s.duty.n.push(n);sv();go('dash')}
const dutyLoadOf=n=>S.patients.filter(p=>!p.fin&&p.doc==n).length;
function dutyPanel(){if(!dutyCan())return '';dutyLoad();const L=DUTYL.l;if(!L.length)return '';
 const chip=x=>`<label class="inline-flex items-center gap-2 border rounded-full px-3 py-1.5 text-sm mr-2 mb-2 ${dutyOn(x.name)?'bg-green-50 border-green-400':'bg-white'}"><input type="checkbox" ${dutyOn(x.name)?'checked':''} onchange="dutySet(this.dataset.n,this.checked)" data-n="${H(x.name)}"> ${H(x.name)} <span class="text-xs text-gray-500">${x.role=='doctor'?(x.stype=='bds'?'BDS':x.stype=='specialist'?'Specialist':'Doctor')+' ('+dutyLoadOf(x.name)+' waiting/active)':x.stype=='therapist'?'Therapist':'Nurse'}</span></label>`;
 const wait=S.patients.filter(p=>!p.fin&&!p.doc).slice(0,6);
 return `<div class="bg-white rounded-xl shadow p-4 mb-4"><div class="font-bold mb-1"><i class="fa fa-user-check mr-2 text-green-600"></i>Staff in the clinic today</div><div class="text-xs text-gray-500 mb-2">Tick who is here now. Patients are assigned to the people who are ready; the list resets every day.</div>${L.map(chip).join('')}`+
 (wait.length?`<div class="mt-2 border-t pt-2"><div class="text-sm font-semibold text-amber-700 mb-1">Waiting for a doctor (${S.patients.filter(p=>!p.fin&&!p.doc).length})</div>${wait.map(p=>`<div class="flex justify-between items-center text-sm py-1"><span>${H(p.name)} <span class="text-xs text-gray-500">#${H(p.card)}</span></span><button class="px-3 py-1 rounded-md text-white text-xs" style="background:var(--c)" onclick="assignDoc('${p.id}')">Assign doctor</button></div>`).join('')}</div>`:'')+`</div>`}
const _dashDt=dash;dash=function(){const h=_dashDt.apply(this,arguments);return typeof h=='string'?dutyPanel()+h:h};
/* doctors who are in the clinic come first and show how many patients they already have */
assignDoc=async function(pid){if(!dutyCan())return;const p=S.patients.find(x=>x.id==pid);if(!p)return;const docs=await docEnsure();if(!docs.length)return alert('No doctors found for this clinic. Add a doctor in Users first.');
 const lab=n=>n+(dutyOn(n)?' - in clinic':' - not marked in today')+' ('+dutyLoadOf(n)+' active)',L=[...docs].sort((a,b)=>dutyOn(b)-dutyOn(a)||dutyLoadOf(a)-dutyLoadOf(b)||a.localeCompare(b));
 form('Assign Doctor',[['doctor','Doctor for '+p.name+' (those in the clinic are listed first)','sel',L.map(lab)]],{doctor:p.doc?lab(p.doc):''},v=>{const n=docs.find(d=>lab(d)==v.doctor)||v.doctor;p.doc=n;p.doctor=n;sv();go(V)})};
