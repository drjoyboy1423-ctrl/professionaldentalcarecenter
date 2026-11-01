/* ---------- Comprehensive Dental Record: on-screen form (add / edit), record cards, dental chart ---------- */
let REC=null,RFCH={};
const rfOf=(fs,out)=>{out=out||[];(fs||[]).forEach(f=>{out.push(f);if(f.fs)rfOf(f.fs,out);if(f.subs)rfOf(f.subs,out)});return out};
const rfAll=()=>RSEC.flatMap(s=>rfOf(s.fs));
const rfEmpty=v=>v==null||v===''||v===false||(Array.isArray(v)&&!v.length);
function rfLegacy(r){const f={};if(r.cc)f.complaint=r.cc;if(r.assess)f.assess=r.assess;if(r.invest)f.invest=r.invest;if(r.finding)f.dx1=r.finding;if(r.note)f.fu=r.note;
 const rows={};if(r.treat||r.done||r.tooth)rows.plan=[{tooth:r.tooth||'',cat:r.plancat||'',proc:r.done||r.treat||'',status:r.done?'Done':'Planned'}];return {f,rows,chart:{}}}
function recNew(pre){const p=gp();if(!p)return;REC={pid:p.id,i:-1,v:{f:{},rows:pre?{crows:[{tooth:String(pre)}]}:{},chart:{}}};SK='rec';go('patient')}
function recEdit(i){const p=gp(),r=p.d.rec[i];if(!r)return;REC={pid:p.id,i,v:r.f?{f:r.f,rows:r.rows||{},chart:r.chart||{}}:rfLegacy(r)};SK='rec';go('patient')}
function recCancel(){REC=null;go('patient')}

/* ---- controls ---- */
const rfChip=(k,o,on,type,name)=>`<label class="rf-chip"><input type="${type}" ${name?`name="${name}"`:''} data-k="${k}" data-v="${H(o)}" ${on?'checked':''} ${type=='radio'?`${on?'data-w="1" ':''}onclick="rfRad(this)"`:''}> ${H(o)}</label>`;
function rfRad(e){if(e.dataset.w=='1'){e.checked=false;e.dataset.w=''}else{document.getElementsByName(e.name).forEach(x=>x.dataset.w='');e.dataset.w='1'}}
function rfCond(e){const s=e.closest('.rf-c').querySelector('.rf-sub');if(s)s.style.display=e.checked?'':'none'}
function rfField(f,v){const F=v.f,k=f.k,val=F[k],lab=f.l?`<div class="rf-lb">${H(f.l)}</div>`:'';
 switch(f.t){
 case 'h':return `<h4 class="rf-h">${H(f.l)}</h4>`;
 case 'text':return `<label class="rf-x">${lab}<input data-k="${k}" class="inp" value="${H(val||'')}"></label>`;
 case 'area':return `<label class="rf-x">${lab}<textarea data-k="${k}" rows="${f.rows||2}" class="inp">${H(val||'')}</textarea></label>`;
 case 'date':return `<div class="rf-x rf-dt" data-un="${val?'':'1'}" onchange="this.dataset.un=''">${lab}<span class="rf-un">not set - choose a date to set it</span><a class="rf-clr" onclick="this.closest('.rf-dt').dataset.un='1'">clear date</a>${dateField('rf_'+k,val)}</div>`;
 case 'radio':return `<div class="rf-x">${lab}<div class="rf-o">${f.o.map(o=>rfChip(k,o,val==o,'radio','rr_'+k)).join('')}</div></div>`;
 case 'multi':return `<div class="rf-x">${lab}<div class="rf-o">${f.o.map(o=>o=='Other'?`<span class="rf-chip">${rfChipIn(k,o,(val||[]).includes(o))} <input data-k="${k}_other" class="inp rf-oth" placeholder="Other..." value="${H(F[k+'_other']||'')}"></span>`:rfChip(k,o,(val||[]).includes(o),'checkbox')).join('')}</div></div>`;
 case 'yn':return `<div class="rf-x">${lab}<div class="rf-o">${['No','Yes'].map(o=>rfChip(k,o,val==o,'radio','rr_'+k)).join('')}<input data-k="${k}_s" class="inp rf-oth" placeholder="If yes, specify" value="${H(F[k+'_s']||'')}"></div></div>`;
 case 'cond':return `<div class="rf-c"><label class="rf-cb"><input type="checkbox" data-k="${k}" ${val?'checked':''} onchange="rfCond(this)"> <b>${H(f.l)}</b></label>${f.subs.length?`<div class="rf-sub" style="${val?'':'display:none'}">${f.subs.map(s=>rfField(s,v)).join('')}</div>`:''}</div>`;
 case 'line':return `<div class="rf-ln">${f.fs.map(s=>rfField(s,v)).join('')}</div>`;
 case 'grp':{const open=rfOf(f.fs).some(x=>x.k&&!rfEmpty(F[x.k]));return `<details class="rf-g" ${open?'open':''}><summary>${H(f.l)}</summary>${f.fs.map(s=>rfField(s,v)).join('')}</details>`}
 case 'rows':return rfRows(f,v);
 case 'chart':return rfChartHtml(v)}
 return ''}
const rfChipIn=(k,o,on)=>`<input type="checkbox" data-k="${k}" data-v="${H(o)}" ${on?'checked':''}> ${H(o)}`;
function rfCell(f,c,x){const [ck,,ty,op]=c,val=x[ck]==null?'':x[ck];
 if(ty=='sel')return `<select data-c="${ck}" class="inp">${op.map(o=>`<option ${val==o?'selected':''}>${H(o)}</option>`).join('')}</select>`;
 return `<input data-c="${ck}" ${ty=='number'?'type="number" min="0" step="any" inputmode="decimal"':''} ${ty=='text'&&op?`list="rf_dl_${op}" onchange="rfProc(this)"`:''} class="inp" value="${H(val)}">`}
function rfRow(f,x){return `<tr>${f.cols.map(c=>`<td>${rfCell(f,c,x)}</td>`).join('')}<td><i class="fa fa-xmark text-rose-600 cursor-pointer" onclick="this.closest('tr').remove();rfUpd()"></i></td></tr>`}
function rfRows(f,v){const a=(v.rows[f.k]&&v.rows[f.k].length?v.rows[f.k]:Array.from({length:f.n},()=>({})));
 return `<div class="rf-x"><div class="rf-lb">${H(f.l)}</div><div class="overflow-x-auto"><table class="rf-t"><thead><tr>${f.cols.map(c=>`<th>${H(c[1])}</th>`).join('')}<th></th></tr></thead><tbody data-rows="${f.k}">${a.map(x=>rfRow(f,x)).join('')}</tbody></table></div><button type="button" class="text-sm text-red-600 mt-1" onclick="rfAddRow('${f.k}')">+ Add row</button></div>`}
function rfAddRow(k){const f=rfAll().find(x=>x.k==k),b=document.querySelector(`tbody[data-rows="${k}"]`);b.insertAdjacentHTML('beforeend',rfRow(f,{}))}
function rfProc(e){const q=S.proc.find(x=>x.n==e.value),tr=e.closest('tr'),fee=tr&&tr.querySelector('[data-c="fee"]');if(q&&fee&&!fee.value)fee.value=q.p;rfUpd()}
function rfChartHtml(v){RFCH={...(v.chart||{})};const b=n=>`<button type="button" class="rf-th" data-t="${n}" onclick="rfTooth(this)">${n}<small></small></button>`;
 const h=`<div class="rf-x"><div class="rf-lb">Dental chart (FDI) - tap a tooth to cycle its status</div><div class="rf-ch"><div class="rf-q">${FDI_U.slice(0,8).map(b).join('')}</div><div class="rf-q">${FDI_U.slice(8).map(b).join('')}</div><div class="rf-q">${FDI_L.slice(0,8).map(b).join('')}</div><div class="rf-q">${FDI_L.slice(8).map(b).join('')}</div></div><div class="text-xs text-gray-500 mt-1">UR | UL (top) &middot; LR | LL (bottom). ${RF_LEG}. Tap again to cycle, last tap clears.</div></div>`;
 setTimeout(rfPaint,0);return h}
function rfPaint(){document.querySelectorAll('.rf-th').forEach(e=>{const s=RFCH[e.dataset.t]||'';e.className='rf-th'+(s?' st-'+s:'');e.querySelector('small').textContent=s})}
function rfTooth(e){const t=e.dataset.t,i=RF_STAT.indexOf(RFCH[t]||''),n=RF_STAT[(i+1)%RF_STAT.length];if(n)RFCH[t]=n;else delete RFCH[t];rfPaint();rfUpd()}

/* ---- collect / derive / save ---- */
function rfCollect(){const root=$('rfroot'),f={},rows={};
 root.querySelectorAll('[data-k]').forEach(e=>{const k=e.dataset.k;if(e.type=='checkbox'){if(e.dataset.v!==undefined){if(e.checked)(f[k]=f[k]||[]).push(e.dataset.v)}else if(e.checked)f[k]=true}else if(e.type=='radio'){if(e.checked)f[k]=e.dataset.v}else{const t=e.value.trim();if(t)f[k]=t}});
 rfAll().filter(x=>x.t=='date').forEach(x=>{const e=$('rf_'+x.k),w=e&&e.closest('.rf-dt');if(e&&e.value&&w&&w.dataset.un!='1'&&!(e.closest('.rf-sub')&&e.closest('.rf-sub').style.display=='none'))f[x.k]=e.value});
 root.querySelectorAll('tbody[data-rows]').forEach(b=>{const a=[];b.querySelectorAll('tr').forEach(tr=>{const o={};tr.querySelectorAll('[data-c]').forEach(e=>{const t=e.value.trim();if(t)o[e.dataset.c]=t});const ks=Object.keys(o).filter(k=>!(k=='status'&&o[k]=='Planned'&&Object.keys(o).length==1));if(ks.length)a.push(o)});if(a.length)rows[b.dataset.rows]=a});
 // drop sub-field values of conditions that are not ticked
 rfAll().filter(x=>x.t=='cond').forEach(c=>{if(!f[c.k])c.subs.forEach(s=>{delete f[s.k];delete f[s.k+'_other']})});
 return {f,rows,chart:{...RFCH}}}
const FDI_RE=/\b[1-8][1-8]\b/g;
function rfDerive(c){const f=c.f,pl=c.rows.plan||[],teeth=new Set(Object.keys(c.chart).filter(t=>c.chart[t]&&c.chart[t]!='H'));
 [...(c.rows.crows||[]).map(x=>x.tooth),...pl.map(x=>x.tooth)].forEach(t=>(String(t||'').match(FDI_RE)||[]).forEach(n=>teeth.add(n)));
 const T=[...teeth].sort((a,b)=>a-b),pn=x=>x.proc||'';
 return {cc:f.complaint||'',assess:f.assess||'',invest:f.invest||'',finding:f.dx1||'',plancat:(pl.find(x=>x.cat)||{}).cat||'',treat:pl.filter(x=>x.status!='Done').map(pn).filter(Boolean).join(', '),done:pl.filter(x=>x.status=='Done').map(pn).filter(Boolean).join(', '),note:f.fu||'',teeth:T,tooth:T[0]||''}}
function rfSave(){const c=rfCollect();if(!Object.keys(c.f).length&&!Object.keys(c.rows).length&&!Object.keys(c.chart).length)return bad('Please fill in at least one part of the record.');
 const p=gp(),d=rfDerive(c),a=p.d.rec=p.d.rec||[];
 if(REC.i<0){const t=Date.now();a.push({...c,...d,no:a.reduce((m,x)=>Math.max(m,+x.no||0),a.length)+1,date:isoD(t),ts:t,by:U.name})}else Object.assign(a[REC.i],c,d);
 REC=null;sv();go('patient')}
function rfUpd(){const e=$('rfal');if(!e||!$('rfroot'))return;const c=rfCollect(),al=rfAlerts(c.f);e.innerHTML=al.length?`<b class="text-red-700"><i class="fa fa-triangle-exclamation"></i> Clinical alerts for this patient</b>${al.map(g=>`<div class="mt-1"><b>${H(g[0])}:</b> ${H(g[1])}</div>`).join('')}<div class="mt-1 text-xs italic">${H(RGUIDE_RULE)}</div>`:''}

/* ---- editor page ---- */
function rfEditor(p){const v=REC.v,nm=REC.i<0?'New Dental Record':'Edit Dental Record';
 const btns=`<div class="flex gap-2"><button class="px-4 py-2 rounded bg-gray-200" onclick="recCancel()">Cancel</button><button class="px-4 py-2 rounded bg-red-600 text-white" onclick="rfSave()">Save record</button></div>`;
 setTimeout(rfUpd,0);
 return `<datalist id="rf_dl_proc">${S.proc.map(x=>`<option value="${H(x.n)}">`).join('')}</datalist><datalist id="rf_dl_dx">${S.dis.map(x=>`<option value="${H(x.name)}">`).join('')}</datalist>
 <div class="flex justify-between items-center gap-2 mb-1"><h2 class="text-xl font-bold">COMPREHENSIVE DENTAL RECORD</h2>${btns}</div><p class="text-sm text-gray-500 mb-3">${nm} &middot; ${H(p.name)} &middot; Card ${H(p.card)} &middot; Dentist: ${H(U.name)}</p>
 <div id="rfal" class="bg-red-50 border border-red-200 rounded p-3 text-sm mb-3 empty:hidden"></div>
 <div id="rfroot" oninput="rfUpd()" onchange="rfUpd()">${RSEC.map(s=>`<section class="rf-s"><h3>${s.n}. ${H(s.t)}</h3>${s.fs.map(f=>rfField(f,v)).join('')}</section>`).join('').replace(/data-k="(dx1|dx2|dx3)" class="inp"/g,'data-k="$1" list="rf_dl_dx" class="inp"')}
 <section class="rf-s"><h3>9. SIGNATURES</h3><p class="text-sm text-gray-500">Patient / Guardian and Dentist signature lines are printed at the end of the printed record.</p></section>
 <section class="rf-s"><h3>10. CLINICAL ACTION GUIDE FOR CHRONIC &amp; INFECTIOUS DISEASES</h3><div class="overflow-x-auto"><table class="rf-t"><thead><tr><th>Condition</th><th>Important dental action</th></tr></thead><tbody>${RGUIDE.map(g=>`<tr><td><b>${H(g[0])}</b></td><td>${H(g[1])}</td></tr>`).join('')}</tbody></table></div><p class="text-sm font-medium mt-2">${H(RGUIDE_RULE)}</p></section></div>
 <div class="flex justify-end mt-4">${btns}</div>`}

/* ---- record card in the list ---- */
function recCard(x,i){const ic=(cl,t,a)=>`<i class="fa ${t} ${cl} cursor-pointer" onclick="${a}"></i>`,al=rfAlerts(x.f||{}),T=(x.teeth&&x.teeth.length?x.teeth:x.tooth?[x.tooth]:[]).join(', '),row=(l,v)=>v?`<div><b>${l}:</b> ${H(v)}</div>`:'',plan=[x.plancat,x.treat].filter(Boolean).join(': ');
 return `<div class="bg-gray-50 rounded-lg shadow p-4 mb-3 text-sm"><div class="flex justify-between items-start gap-3"><div class="font-bold">Record ${H(x.no||i+1)} <span class="font-normal text-gray-500">&middot; ${H(dsp(x))} &middot; ${H(x.by||'')}</span></div><div class="space-x-3 whitespace-nowrap">${ic('text-purple-600','fa-print',`recPrint(${i})`)}${ic('text-red-600','fa-pen',`recEdit(${i})`)}${ic('text-rose-600','fa-trash',`delI('rec',${i})`)}</div></div>
 <div class="mt-2">${row('Chief complaint',x.cc)}${row('Assessment',x.assess)}${row('Teeth',T)}${row('Investigation',x.invest)}${row('Finding / Diagnosis',x.finding)}${row('Rx plan',plan)}${row('Rx done',x.done)}${row('Follow-up',x.note)}</div>
 ${al.length?`<div class="mt-2 flex flex-wrap gap-1">${al.slice(0,6).map(g=>`<span class="px-2 rounded bg-red-100 text-red-700 text-xs">${H(g[0])}</span>`).join('')}</div>`:''}</div>`}

/* ---- dental chart overview (tap a tooth to start a record for it) ---- */
function chart(){const p=gp(),h={};(p.d.rec||[]).forEach(r=>(r.teeth&&r.teeth.length?r.teeth:[r.tooth]).forEach(t=>{if(t)h[t]=(h[t]||0)+1}));
 const t=n=>`<button onclick="cl();recNew(${n})" class="w-9 h-11 text-xs rounded border ${h[n]?'bg-red-500 text-white':'bg-white'}">${n}</button>`;
 $('mb').innerHTML=`<h3 class="font-bold text-lg mb-1">Dental chart (FDI)</h3><p class="text-xs text-gray-500 mb-3">Red teeth already have records. Tap a tooth to start a new record for it.</p><div class="text-xs text-gray-400 mb-1">Upper (right | left)</div><div class="grid grid-cols-8 gap-1 mb-1">${FDI_U.slice(0,8).map(t).join('')}</div><div class="grid grid-cols-8 gap-1 mb-3">${FDI_U.slice(8).map(t).join('')}</div><div class="text-xs text-gray-400 mb-1">Lower (right | left)</div><div class="grid grid-cols-8 gap-1 mb-1">${FDI_L.slice(0,8).map(t).join('')}</div><div class="grid grid-cols-8 gap-1">${FDI_L.slice(8).map(t).join('')}</div><button onclick="cl()" class="mt-4 bg-gray-600 text-white px-4 py-2 rounded">Close</button>`;md.classList.replace('hidden','flex')}
