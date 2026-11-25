/* ---------- Follow-up of patients who are IN treatment and patients who are OUT (finished), by field ----------
   Every follow-up is {id, date, type, fld, note, st:'Due'|'Done'|'Missed', by, ts, reminded?, done?} stored on the patient (p.d.fu).
   fld = the field it belongs to: endo, pros, ortho, perio, omfs, impl or gen (general dentistry). Each field has its own follow-up types with a usual
   interval and a "what to check" note (FUFLD). In treatment = patient not finished; Out = patient marked finished.
   A "next review" choice on a specialty record (and on an ortho visit) creates the follow-up by itself and closes the earlier due one of the same field.
   Pages: patient menu "Follow-up", the "Follow-ups" list (filter by status, in/out and field; call + WhatsApp reminder),
   and a small card on the dashboards of reception, manager and doctors. */
const FUFLD={
 endo:{n:'Endodontic',s:'Endo',i:'fa-syringe',c:'bg-rose-100 text-rose-700',rec:'Healing review - 6 months',T:[
  ['Temporary dressing recall',14,'Dressing intact? Pain, swelling or sinus tract? Continue cleaning and shaping, renew the medicament.'],
  ['Next canal visit (obturation)',14,'Symptoms settled? Canals dry and clean? Obturate if the tooth is comfortable.'],
  ['Pain / swelling check',2,'Pain, swelling, fever, mouth opening. Check drainage and the antibiotic or pain medicine.'],
  ['Post-obturation check',7,'Pain on biting? Temporary filling intact? Plan the final restoration or crown.'],
  ['Healing review - 6 months',180,'Periapical X-ray: is the lesion healing? Tooth comfortable? Restoration sound?'],
  ['Healing review - 12 months',365,'Periapical X-ray: complete healing? If not, consider retreatment or apicoectomy.']]},
 pros:{n:'Prosthodontic',s:'Prostho',i:'fa-tooth',c:'bg-indigo-100 text-indigo-700',rec:'Prosthesis check - 6 months',T:[
  ['Try-in / jaw relation',7,'Fit, bite, shade and looks. The patient agrees before the work is finished.'],
  ['Insertion / cementation',7,'Check fit and bite, cement or deliver, give care instructions.'],
  ['Denture adjustment (sore spots)',2,'Sore spots, retention, bite, speech. Adjust and polish.'],
  ['Back from lab',7,'Collect the work from the lab and check it before the patient comes.'],
  ['Splint / night guard check',30,'Fit, wear marks, comfort. Adjust the bite.'],
  ['Prosthesis check - 6 months',180,'Fit, bite, cement seal, gum health and cleaning habits.']]},
 ortho:{n:'Orthodontic',s:'Ortho',i:'fa-teeth',c:'bg-teal-100 text-teal-700',rec:'Retainer check',T:[
  ['Adjustment (monthly)',28,'Wire change, elastics, brackets, oral hygiene. Collect the monthly fee.'],
  ['Bracket / wire emergency',3,'Broken bracket or poking wire: repair and check comfort.'],
  ['Progress review (photos, X-ray)',180,'Progress photos and X-ray. Review the plan and the expected finish date.'],
  ['Retainer check',90,'Retainer fit and wear. Is the alignment stable?']]},
 perio:{n:'Periodontal',s:'Perio',i:'fa-teeth-open',c:'bg-pink-100 text-pink-700',rec:'Maintenance recall (3 months)',T:[
  ['Re-evaluation after scaling',35,'Probing depths, bleeding and plaque. Decide: maintenance or surgery.'],
  ['Surgical site check',7,'Healing, sutures, pain and swelling. Oral hygiene advice.'],
  ['Maintenance recall (3 months)',90,'Probing, bleeding, plaque score, scaling and polishing.'],
  ['Scaling recall (6 months)',180,'Check-up, scaling and polishing, oral hygiene advice.']]},
 omfs:{n:'Maxillofacial surgery',s:'Surgery',i:'fa-hand-holding-medical',c:'bg-orange-100 text-orange-700',rec:'Surgery review - 3 months',T:[
  ['Post-op check (48 hours)',2,'Bleeding, swelling, pain, fever, mouth opening, wound. Check the medicines.'],
  ['Suture removal',7,'Wound healing, remove non-resorbable sutures, check for infection.'],
  ['Wound / dry socket check',4,'Pain after day 3? Empty socket? Irrigate and dress if needed.'],
  ['Histopathology result',14,'Get the lab result, tell the patient and plan the next step.'],
  ['Fracture / fixation review',14,'Bite, mouth opening, wound, X-ray and diet.'],
  ['Surgery review - 3 months',90,'Healing, nerve symptoms, function. X-ray if needed.']]},
 impl:{n:'Implant',s:'Implant',i:'fa-screwdriver-wrench',c:'bg-sky-100 text-sky-700',rec:'Maintenance review (6 months)',T:[
  ['Healing check (2 weeks)',14,'Wound, sutures, swelling and pain. Check the cover screw and the graft site.'],
  ['Osseointegration check (ISQ)',90,'Stability (ISQ) and X-ray. Ready for the second stage or loading?'],
  ['Uncovering / second stage',120,'Uncover the implant, place the healing abutment, check the gum.'],
  ['Abutment / crown visit',14,'Impression or delivery of the abutment or crown. Check the bite.'],
  ['Maintenance review (6 months)',180,'Gum health, bone level (X-ray), bite, cleaning habits, smoking.']]},
 gen:{n:'General dentistry',s:'General',i:'fa-user-doctor',c:'bg-gray-100 text-gray-700',rec:'Recall',T:[
  ['Review',14,'Check how the treatment is going.'],
  ['Recall',180,'Routine check-up and cleaning.'],
  ['Post-op check',7,'Pain, swelling, bleeding and wound.'],
  ['Test result / lab',7,'Get the result and tell the patient.'],
  ['Payment reminder',7,'Remind the patient about the balance.'],
  ['Other',14,'']]}};
const FUK=Object.keys(FUFLD);
/* older follow-ups were saved with these type names */
const FULEG={'Root canal review':'endo','Perio maintenance':'perio','Implant review':'impl','Denture / prosthesis adjustment':'pros','Ortho review':'ortho','Suture removal':'omfs'};
const FUN=['No follow-up','In 2 days','In 1 week','In 2 weeks','In 4 weeks','In 6 weeks','In 3 months','In 6 months','In 12 months'];
const FUND={'In 2 days':2,'In 1 week':7,'In 2 weeks':14,'In 4 weeks':28,'In 6 weeks':42,'In 3 months':90,'In 6 months':180,'In 12 months':365};
const FUF={g:'due',m:'all',f:'all',all:0,q:''};
const fuId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const fuToday=()=>isoD(Date.now());
const fuAfter=n=>isoD(Date.now()+n*864e5);
const fuDays=d=>Math.round((Date.parse(d+'T00:00:00')-Date.parse(fuToday()+'T00:00:00'))/864e5);
/* "Next review" choice -> date. Accepts a ready date too. Empty when there is no follow-up. */
const fuOpts=first=>[first,...FUN.filter(x=>x!=first)];
const fuNextDate=(l,pick)=>/^\d{4}-\d{2}-\d{2}$/.test(l||'')?l:l=='Pick a date below'?(pick||''):FUND[l]?fuAfter(FUND[l]):'';
/* the field of a follow-up (new ones store it; older ones are worked out from the source or the type name) */
const fuFld=f=>f&&FUFLD[f.fld]?f.fld:f&&FUFLD[f.src]?f.src:(f&&FULEG[f.type])||'gen';
const fuTypeList=k=>FUFLD[k].T.map(x=>x[0]);
const fuDef=(k,t)=>{const x=(FUFLD[k]||FUFLD.gen).T.find(y=>y[0]==t);return x?{days:x[1],note:x[2]}:{days:14,note:''}};
const fuFldOfType=t=>FUK.find(k=>fuTypeList(k).includes(t))||FULEG[t]||'gen';
const fuFldBadge=f=>{const d=FUFLD[fuFld(f)];return `<span class="text-xs rounded-full px-2 py-0.5 whitespace-nowrap ${d.c}"><i class="fa ${d.i} mr-1"></i>${d.s}</span>`};
const fuOut=p=>!!p.fin;
const fuMineP=p=>!!U&&(p.doc==U.name||(p.spec||[]).includes(U.name));
const fuScope=()=>U&&U.role=='doctor'&&!FUF.all?S.patients.filter(fuMineP):S.patients;
/* the field to suggest for a patient: the doctor's own specialty, else the field of the latest specialty record, else general */
function fuGuess(p){const sp=typeof spMy=='function'?spMy():null;if(sp&&FUFLD[sp.k])return sp.k;let b='',t=-1;['endo','pros','ortho','perio','omfs','impl'].forEach(k=>{const a=(p&&p.d[k])||[],x=a[a.length-1];if(x&&(x.ts||0)>t){t=x.ts||0;b=k}});return b||'gen'}
function fuAdd(p,o){p.d.fu=p.d.fu||[];const fld=FUFLD[o.fld]?o.fld:fuFld(o);if(p.d.fu.some(f=>f.st=='Due'&&f.date==o.date&&f.type==o.type&&fuFld(f)==fld))return null;const f={id:fuId(),date:o.date,type:o.type||'Review',fld,note:o.note||'',st:'Due',by:(U&&U.name)||'',ts:Date.now(),...(o.src?{src:o.src}:{})};p.d.fu.push(f);return f}
/* a visit of a field was recorded: its earlier due follow-ups (due now or within 3 days) are closed */
function fuCloseFld(p,k,how){const lim=fuAfter(3);let n=0;(p.d.fu||[]).forEach(f=>{if(f.st=='Due'&&fuFld(f)==k&&f.date<=lim){f.st='Done';f.done={by:(U&&U.name)||'',at:Date.now(),note:how||'Visit recorded'};n++}});return n}
function fuRows(L){const out=[];L.forEach(p=>(p.d.fu||[]).forEach(f=>out.push({p,f})));return out}
/* number of follow-ups due today or overdue (mine = only my patients, fld = one field) */
function fuDueCount(mine,fld){const t=fuToday();return fuRows(mine?S.patients.filter(fuMineP):S.patients).filter(r=>r.f.st=='Due'&&r.f.date<=t&&(!fld||fuFld(r.f)==fld)).length}
function fuRefresh(){if(V=='patient')go('patient');else go(V)}
function fuFind(pid,id){const p=S.patients.find(x=>String(x.id)==String(pid));const f=p&&(p.d.fu||[]).find(x=>x.id==id);return f?{p,f}:null}
function fuSetDate(id,iso){const y=$(id+'_y');if(y){const e=toEC(toDate(iso));$(id+'_d').value=e.d;$(id+'_m').value=e.m;y.value=e.y;ecSync(id)}else{const el=$(id);if(el){el.value=iso;if(typeof ecHint=='function')ecHint(id)}}}
/* New follow-up: pick the field, then the type; the usual date and the "what to check" note are filled in and can be changed. */
function fuNew(pid,type,fld){const p=S.patients.find(x=>String(x.id)==String(pid));if(!p)return;
 fld=FUFLD[fld]?fld:type?fuFldOfType(type):fuGuess(p);type=type||FUFLD[fld].T[0][0];const d0=fuDef(fld,type),nm=k=>FUFLD[k].n,kOf=v=>FUK.find(k=>nm(k)==v)||'gen';
 form('New follow-up - '+p.name,[['fld','Field','sel',FUK.map(nm)],['type','Type','sel',[...new Set([type,...fuTypeList(fld)])]],['date','Follow-up date','date'],['note','What to check','area']],{fld:nm(fld),type,date:fuAfter(d0.days),note:d0.note},v=>{if(!v.date)return bad('Please choose the date.');if(!fuAdd(p,{date:v.date,type:v.type,fld:kOf(v.fld),note:v.note}))return bad('This follow-up already exists.');sv();cl();toast('Follow-up added.',1);fuRefresh()});
 const fl=$('f_fld'),ty=$('f_type'),fill=()=>{const d=fuDef(kOf(fl.value),ty.value);fuSetDate('f_date',fuAfter(d.days));$('f_note').value=d.note};
 if(fl&&ty){fl.onchange=()=>{ty.innerHTML=fuTypeList(kOf(fl.value)).map(o=>`<option>${H(o)}</option>`).join('');fill()};ty.onchange=fill}}
function fuNewPick(){const L=fuScope();if(!L.length)return alert('No patient yet.');form('New follow-up',[['pt','Patient','sel',L.map(plabel)]],{pt:plabel(L[0])},v=>{const p=L.find(x=>plabel(x)==v.pt);if(!p)return bad('Choose a patient.');cl();fuNew(p.id)})}
function fuDone(pid,id){const r=fuFind(pid,id);if(!r)return;const k=fuFld(r.f);
 form('Follow-up done - '+r.p.name,[['note','What was found / done','area'],['nx','Next follow-up','sel',[...FUN,'Pick a date below']],['next','Date (only if you chose "Pick a date below")','date'],['ntype','Type of next follow-up','sel',[...new Set([r.f.type,...fuTypeList(k)])]]],{note:'',nx:'No follow-up',next:fuAfter(14),ntype:r.f.type},v=>{if(v.nx=='Pick a date below'&&!v.next)return bad('Please choose the date.');r.f.st='Done';r.f.done={by:U.name,at:Date.now(),note:(v.note||'').trim()};const d=fuNextDate(v.nx,v.next);if(d)fuAdd(r.p,{date:d,type:v.ntype,fld:k,note:fuDef(k,v.ntype).note});sv();cl();toast('Follow-up done.',1);fuRefresh()})}
function fuMiss(pid,id){const r=fuFind(pid,id);if(!r||!confirm('Mark as missed (the patient did not come or could not be reached)? You can set a new date afterwards.'))return;r.f.st='Missed';r.f.miss={by:U.name,at:Date.now()};sv();fuRefresh()}
function fuMove(pid,id){const r=fuFind(pid,id);if(!r)return;form('New date - '+r.p.name,[['date','New follow-up date','date']],{date:isoD(Date.now()+7*864e5)},v=>{if(!v.date)return bad('Please choose the date.');(r.f.moved=r.f.moved||[]).push({from:r.f.date,by:U.name,at:Date.now()});r.f.date=v.date;r.f.st='Due';sv();cl();fuRefresh()})}
function fuDel(pid,id){const r=fuFind(pid,id);if(!r||!confirm('Delete this follow-up?'))return;r.p.d.fu=r.p.d.fu.filter(x=>x.id!=id);sv();fuRefresh()}
function fuWa(pid,id){const r=fuFind(pid,id);if(!r)return;const t='Hello '+r.p.name+', this is '+((C&&C.name)||'the clinic')+'. A reminder for your '+r.f.type.toLowerCase()+(r.f.date?' on '+r.f.date:'')+'. Please call us or reply to confirm. Thank you.';r.f.reminded=Date.now();sv();window.open(cvWaTo(r.p.phone)+'?text='+encodeURIComponent(t),'_blank','noopener')}
const fuCall=(pid,id)=>{const r=fuFind(pid,id);if(r){r.f.reminded=Date.now();sv()}};
function fuBadge(f){const t=fuToday();if(f.st=='Done')return ['Done','bg-green-100 text-green-700'];if(f.st=='Missed')return ['Missed','bg-gray-200 text-gray-700'];const d=fuDays(f.date);return d<0?['Overdue '+(-d)+' d','bg-red-100 text-red-700']:d==0?['Today','bg-amber-100 text-amber-800']:d<=7?['In '+d+' d','bg-sky-100 text-sky-700']:['Later','bg-gray-100 text-gray-600']}
function fuActs(p,f,withOpen){const ph=String(p.phone||'').replace(/[^\d+]/g,'');return `<div class="flex flex-wrap gap-x-3 gap-y-1 text-xs mt-2">${f.st=='Due'?`<span class="cursor-pointer text-green-700" onclick="fuDone('${p.id}','${f.id}')"><i class="fa fa-check"></i> Done</span>`:''}${ph&&f.st!='Done'?`<a class="text-sky-700" href="tel:${H(ph)}" onclick="fuCall('${p.id}','${f.id}')"><i class="fa fa-phone"></i> Call</a><span class="cursor-pointer text-green-700" onclick="fuWa('${p.id}','${f.id}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</span>`:''}${f.st!='Done'?`<span class="cursor-pointer text-gray-700" onclick="fuMove('${p.id}','${f.id}')"><i class="fa fa-calendar-day"></i> New date</span>`:''}${f.st=='Due'?`<span class="cursor-pointer text-gray-600" onclick="fuMiss('${p.id}','${f.id}')"><i class="fa fa-user-xmark"></i> Missed</span>`:''}${withOpen?`<span class="cursor-pointer text-gray-700" onclick="go('patient','${p.id}')"><i class="fa fa-folder-open"></i> Open</span>`:''}<span class="cursor-pointer text-rose-600" onclick="fuDel('${p.id}','${f.id}')"><i class="fa fa-trash"></i></span></div>`}
const fuInfo=f=>`${f.note?H(f.note)+' &middot; ':''}${f.reminded?'<span class="text-gray-500">Reminded '+H(isoD(f.reminded))+'</span>':''}${f.done?'<span class="text-green-700"> Done by '+H(f.done.by)+' on '+H(isoD(f.done.at))+(f.done.note?': '+H(f.done.note):'')+'</span>':''}`;

/* Patient menu: Follow-up */
SIDE.push(['fu','Follow-up']);RA.push('fu');
function fuSection(p){const L=(p.d.fu||[]).slice().sort((a,b)=>a.st==b.st?(a.date<b.date?-1:1):(a.st=='Due'?-1:1)),out=fuOut(p),g=fuGuess(p),ord=[g,...FUK.filter(k=>k!=g)];
 return hd('Follow-up',gb('New follow-up +',`fuNew('${p.id}')`))+`<p class="mb-2 text-sm"><span class="px-2 py-1 rounded-full ${out?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}">${out?'Out (treatment finished)':'In treatment'}</span><span class="text-gray-500"> ${out?'Set a recall so the patient is checked after treatment.':'Follow-ups are called or messaged before the date.'}</span></p>
 <div class="flex flex-wrap items-center gap-1 mb-3 text-xs"><span class="text-gray-500">Add for:</span>${ord.map(k=>`<button type="button" class="rounded-full px-2.5 py-1 ${FUFLD[k].c}" onclick="fuNew('${p.id}','','${k}')"><i class="fa ${FUFLD[k].i} mr-1"></i>${FUFLD[k].s}</button>`).join('')}</div>`+
 (L.length?L.map(f=>{const b=fuBadge(f);return `<div class="bg-gray-50 rounded-lg shadow p-3 mb-2 text-sm"><div class="flex justify-between gap-2"><div>${fuFldBadge(f)} <b>${H(f.type)}</b> &middot; ${H(f.date)}</div><span class="px-2 rounded-full text-xs h-fit ${b[1]}">${b[0]}</span></div><div class="text-gray-600 mt-1">${fuInfo(f)||'<span class="text-gray-400">No note</span>'}</div>${fuActs(p,f,false)}</div>`}).join(''):'<p class="text-gray-500">No follow-up yet. Add one, or choose "Next review" on a specialty record.</p>')}
{const _s=sec;sec=function(p){return SK=='fu'?fuSection(p):_s.apply(this,arguments)}}

/* Follow-ups page */
NAV.push(['fu','Follow-ups','fa-calendar-check']);
Object.keys(RN).forEach(r=>{if(['admin','manager','doctor','nurse','reception'].includes(r)&&!RN[r].includes('fu'))RN[r].splice(Math.min(3,RN[r].length),0,'fu')});
/* does the patient belong to a field (has a record of it)? general = no specialty record at all */
const fuHasFld=(p,k)=>k=='gen'?!FUK.some(x=>x!='gen'&&(p.d[x]||[]).length):!!(p.d[k]||[]).length;
function fuPage(){const t=fuToday(),all0=fuRows(fuScope()),q=FUF.q.trim().toLowerCase(),inM=r=>FUF.m=='all'||(FUF.m=='in'?!fuOut(r.p):fuOut(r.p)),fM=r=>FUF.f=='all'||fuFld(r.f)==FUF.f,all=all0.filter(fM);
 const due=r=>r.f.st=='Due',cnt={over:all.filter(r=>due(r)&&r.f.date<t).length,today:all.filter(r=>due(r)&&r.f.date==t).length,week:all.filter(r=>due(r)&&r.f.date>t&&fuDays(r.f.date)<=7).length,outDue:all.filter(r=>due(r)&&r.f.date<=t&&fuOut(r.p)).length};
 const G={due:['Overdue + today',r=>due(r)&&r.f.date<=t],over:['Overdue',r=>due(r)&&r.f.date<t],today:['Today',r=>due(r)&&r.f.date==t],week:['Next 7 days',r=>due(r)&&r.f.date>t&&fuDays(r.f.date)<=7],later:['Later',r=>due(r)&&fuDays(r.f.date)>7],done:['Done',r=>r.f.st=='Done'],miss:['Missed',r=>r.f.st=='Missed'],none:['Out - none planned',null]};
 let rows=[],none=[];
 if(FUF.g=='none'){none=fuScope().filter(p=>fuOut(p)&&(FUF.f=='all'||fuHasFld(p,FUF.f))&&!(p.d.fu||[]).some(f=>f.st=='Due'&&(FUF.f=='all'||fuFld(f)==FUF.f))&&(!q||[p.name,p.card,p.phone].some(x=>String(x||'').toLowerCase().includes(q)))).slice(0,80)}
 else rows=all.filter(r=>G[FUF.g][1](r)&&inM(r)&&(!q||[r.p.name,r.p.card,r.p.phone,r.f.type].some(x=>String(x||'').toLowerCase().includes(q)))).sort((a,b)=>FUF.g=='done'||FUF.g=='miss'?((b.f.done||b.f.miss||{}).at||0)-((a.f.done||a.f.miss||{}).at||0):(a.f.date<b.f.date?-1:1));
 const chip=(k,l,v,c)=>`<button onclick="FUF.${k}='${v}';go('fu')" class="px-3 py-1.5 rounded-md text-sm border ${FUF[k]==v?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${l}${c!=null?' ('+c+')':''}</button>`;
 const fch=(v,l,ic,c)=>`<button onclick="FUF.f='${v}';go('fu')" class="px-3 py-1.5 rounded-md text-sm border ${FUF.f==v?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${ic?`<i class="fa ${ic} mr-1"></i>`:''}${l}${c?` <b class="ml-1 rounded-full bg-red-600 text-white px-1.5 text-xs">${c}</b>`:''}</button>`;
 const fdue=k=>all0.filter(r=>due(r)&&r.f.date<=t&&(k=='all'||fuFld(r.f)==k)).length;
 const body=FUF.g=='none'?(none.length?none.map(p=>`<div class="p-3 border-b flex justify-between gap-2 items-center text-sm"><span class="min-w-0"><b class="cursor-pointer hover:underline" onclick="go('patient','${p.id}')">${H(p.name)}</b><span class="text-gray-500"> Card ${H(p.card)} &middot; Dr ${H(p.doc||'-')}</span></span><button class="px-3 py-1 rounded text-white text-xs whitespace-nowrap" style="background:var(--c)" onclick="fuNew('${p.id}','${FUF.f=='all'?'Recall':FUFLD[FUF.f].rec}','${FUF.f=='all'?'':FUF.f}')">Set follow-up</button></div>`).join(''):'<p class="p-6 text-sm text-gray-500">Every finished patient has a follow-up planned.</p>'):
  (rows.length?rows.map(r=>{const b=fuBadge(r.f);return `<div class="p-3 border-b text-sm"><div class="flex justify-between gap-2"><div class="min-w-0"><b class="cursor-pointer hover:underline break-words" onclick="go('patient','${r.p.id}')">${H(r.p.name)}</b> <span class="text-xs rounded-full px-2 py-0.5 ${fuOut(r.p)?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}">${fuOut(r.p)?'Out':'In treatment'}</span><div class="text-gray-600">${fuFldBadge(r.f)} ${H(r.f.type)} &middot; ${H(r.f.date)} &middot; Dr ${H(r.p.doc||'-')} &middot; ${H(r.p.phone||'no phone')}</div></div><span class="px-2 rounded-full text-xs h-fit whitespace-nowrap ${b[1]}">${b[0]}</span></div><div class="text-gray-600 text-xs mt-1">${fuInfo(r.f)}</div>${fuActs(r.p,r.f,true)}</div>`}).join(''):'<p class="p-6 text-sm text-gray-500">Nothing here.</p>');
 return hd('Follow-ups',gb('New follow-up +','fuNewPick()'))+`<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">${ordTile('Overdue',cnt.over,'border-red-400','fa-triangle-exclamation')}${ordTile('Today',cnt.today,'border-amber-400','fa-calendar-day')}${ordTile('Next 7 days',cnt.week,'border-sky-400','fa-calendar-week')}${ordTile('Out patients due',cnt.outDue,'border-green-500','fa-user-check')}</div>
 <div class="bg-white rounded-lg p-3 mb-4"><div class="flex flex-wrap gap-2 mb-2">${fch('all','All fields','',fdue('all'))}${FUK.map(k=>fch(k,FUFLD[k].s,FUFLD[k].i,fdue(k))).join('')}</div><div class="flex flex-wrap gap-2 mb-2">${Object.keys(G).map(k=>chip('g',G[k][0],k)).join('')}</div><div class="flex flex-wrap gap-2 items-center">${chip('m','All patients','all')}${chip('m','In treatment','in')}${chip('m','Out (finished)','out')}${U.role=='doctor'?`<label class="text-sm ml-2"><input type="checkbox" ${FUF.all?'checked':''} onchange="FUF.all=this.checked?1:0;go('fu')"> Show all clinic patients</label>`:''}<input class="inp ml-auto" style="margin:0;max-width:16rem" placeholder="Search name, card or phone" value="${H(FUF.q)}" oninput="FUF.q=this.value;clearTimeout(FUF.t);FUF.t=setTimeout(()=>{go('fu');const e=document.getElementById('fuq');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length)}},250)" id="fuq"></div></div><div class="bg-white rounded-xl shadow">${body}</div>`}

/* Dashboard card: follow-ups to call today (reception, manager, administrator, doctors for their own patients), with a count per field */
function fuDashCard(){if(!U||!['reception','manager','admin','doctor'].includes(U.role))return '';const t=fuToday(),L=fuRows(U.role=='doctor'?S.patients.filter(fuMineP):S.patients).filter(r=>r.f.st=='Due'&&r.f.date<=t).sort((a,b)=>a.f.date<b.f.date?-1:1);
 if(!L.length)return '';
 const fc=FUK.map(k=>[k,L.filter(r=>fuFld(r.f)==k).length]).filter(x=>x[1]);
 return `<div class="bg-white rounded-xl shadow p-4 mb-4 border-l-4 border-amber-400"><div class="flex justify-between items-center gap-2 mb-1"><h3 class="font-bold"><i class="fa fa-calendar-check mr-2 text-amber-600"></i>Follow-ups to contact (${L.length})</h3><button class="px-3 py-1.5 rounded border text-sm" onclick="FUF.g='due';FUF.f='all';go('fu')">Open all</button></div>
 <div class="flex flex-wrap gap-1 mb-2 text-xs">${fc.map(x=>`<button type="button" class="rounded-full px-2.5 py-1 ${FUFLD[x[0]].c}" onclick="FUF.g='due';FUF.f='${x[0]}';go('fu')"><i class="fa ${FUFLD[x[0]].i} mr-1"></i>${FUFLD[x[0]].s} <b>${x[1]}</b></button>`).join('')}</div>${L.slice(0,5).map(r=>{const b=fuBadge(r.f);return `<div class="py-2 border-b text-sm"><div class="flex justify-between gap-2"><span class="min-w-0"><b class="cursor-pointer hover:underline" onclick="go('patient','${r.p.id}')">${H(r.p.name)}</b> <span class="text-gray-500">${fuFldBadge(r.f)} ${H(r.f.type)} &middot; ${fuOut(r.p)?'Out':'In treatment'}</span></span><span class="px-2 rounded-full text-xs h-fit whitespace-nowrap ${b[1]}">${b[0]}</span></div>${fuActs(r.p,r.f,false)}</div>`}).join('')}${L.length>5?`<p class="text-xs text-gray-500 mt-2">+ ${L.length-5} more</p>`:''}</div>`}
/* When a doctor finishes a patient, offer a recall of the patient's field (for example a 6-month healing review after a root canal). */
{const _f=fin;fin=function(){_f.apply(this,arguments);const p=gp();if(p&&p.fin&&U&&U.role=='doctor'&&!(p.d.fu||[]).some(f=>f.st=='Due')){const g=fuGuess(p);setTimeout(()=>fuNew(p.id,FUFLD[g].rec,g),80)}}}
