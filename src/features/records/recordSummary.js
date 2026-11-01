/* ---------- Printable Dental Record summary (patient screen + print center) ---------- */
function recSummaryHtml(p){
 const R=[...(p.d.rec||[])].sort((a,b)=>tsOf(a,p)-tsOf(b,p)),Pr=p.d.presc||[],cnt={};
 R.forEach(r=>(r.teeth&&r.teeth.length?r.teeth:[r.tooth]).forEach(t=>{if(t)cnt[t]=(cnt[t]||0)+1}));
 const cell=n=>`<td style="width:6.25%;text-align:center;padding:5px 0;border:1px solid #999;${cnt[n]?'background:'+C.color+';color:#fff;font-weight:bold':''}">${n}${cnt[n]?`<div style="font-size:9px;font-weight:normal">x${cnt[n]}</div>`:''}</td>`,
 up=FDI_U,lo=FDI_L,
 chartT=`<table style="table-layout:fixed;margin:4px 0"><tr>${up.map(cell).join('')}</tr><tr>${lo.map(cell).join('')}</tr></table><div class="muted" style="font-size:10px">FDI numbering: upper 18-11 | 21-28 (top row) &middot; lower 48-41 | 31-38 (bottom row) &middot; coloured = has record, xN = number of records${cnt['Full mouth']?' &middot; <b>Full mouth: '+cnt['Full mouth']+' record(s)</b>':''}</div>`,
 last=R.length?dsp(R[R.length-1]):'-',first=R.length?dsp(R[0]):'-',
 kp=`<div class="kpi">Records<b>${R.length}</b></div><div class="kpi">Teeth with records<b>${Object.keys(cnt).filter(k=>k!='Full mouth').length}</b></div><div class="kpi">First visit<b>${H(first)}</b></div><div class="kpi">Last visit<b>${H(last)}</b></div>`;
 return docHead('Dental Record Summary',fd(NOW()))+pInfo(p)+kp+'<h2>Tooth chart</h2>'+chartT+
  '<h2>Dental findings and treatment</h2>'+(R.length?tbl2(['Date','Tooth','Chief complaint','Assessment','Investigation','Finding','Rx plan','Rx done'],R.map(x=>[H(dsp(x)),H((x.teeth&&x.teeth.length?x.teeth.join(', '):x.tooth)||''),H(x.cc),H(x.assess),H(x.invest),H(x.finding),H([x.plancat,x.treat].filter(Boolean).join(': ')+(x.note?' ('+x.note+')':'')),H(x.done)])):'<p class="muted">No dental records yet.</p>')+
  (Pr.length?'<h2>Prescriptions</h2>'+tbl2(['Date','Diagnosis','Medication','Instructions'],Pr.map(x=>[H(dsp(x)),H(x.dx),H((x.meds||[]).join(', ')),H(x.txt)])):'')+
  '<div class="sig"><div>Doctor / ሐኪም</div><div>Patient / ታካሚ</div></div>'}
function recSummaryPrint(id){const p=id!=null?S.patients.find(x=>x.id==id):gp();if(!p)return;printHtml('Dental record summary - '+p.name,recSummaryHtml(p))}
