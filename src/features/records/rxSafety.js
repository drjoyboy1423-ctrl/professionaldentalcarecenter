/* ---------- Drug safety check for prescriptions ----------
   Reads what is already recorded about the patient (dental record medical history, health information, consent tick boxes, age, sex)
   and compares it with the medicines in the prescription (the chips, the description and the diagnosis box).
   Two levels: "Avoid" (risk of serious harm - a reason is required to continue) and "Caution" (monitor, change dose or choose another medicine).
   It is a help for the doctor, not a replacement for clinical judgement. It only knows what is written in the patient file.
   An alert that was overridden is stored on the prescription (x.ovr). */
const RXT={pen:'Penicillin allergy',nsaid:'NSAID / aspirin allergy',sulfa:'Sulfa allergy',preg:'Pregnant',lact:'Breastfeeding',renal:'Kidney disease',liver:'Liver disease',alc:'Alcohol use',ulcer:'Stomach ulcer',gerd:'Reflux / GERD',ibd:'Bowel disease (IBD)',htn:'High blood pressure',hf:'Heart failure',cvs:'Heart disease',warf:'Takes warfarin',doac:'Takes a DOAC blood thinner',apl:'Takes aspirin / clopidogrel',bleed:'Bleeding disorder',asthma:'Asthma / COPD',diab:'Diabetes',epil:'Epilepsy / seizures',immuno:'Weak immunity',ssri:'Takes an antidepressant',acei:'Takes ACE inhibitor / ARB',lith:'Takes lithium / methotrexate',latex:'Latex allergy',la:'Local anesthetic allergy',dial:'On dialysis',antires:'Bisphosphonate / denosumab',cancer:'Cancer / radiotherapy',pace:'Pacemaker / ICD',prophy:'Heart valve / endocarditis risk',mi:'Heart attack, angina or stroke history',inf:'Hepatitis B / C or HIV',tb:'Active TB',child:'Child under 12',young:'Child under 8',elderly:'Age 65 or more',anemia:'Anemia'};
const RXT_AGE=['child','young','elderly'];

/* All tags that apply to the patient, from every place the file keeps medical history. */
function rxProf(p){const T=new Set();if(!p)return T;
 const R=(p.d.rec||[]).map(r=>r.f).filter(Boolean),c=p.d.consent||{ck:[],o:''},ck=new Set(c.ck||[]),HL=p.d.health||[];
 const any=g=>R.some(f=>{try{return !!g(f)}catch(e){return false}}),o=(f,k,v)=>!!f[k]&&(f[k+'_o']||[]).includes(v);
 const al=[].concat(...R.map(f=>f.allergy||[])),
  txt=[c.o,...HL.map(x=>(x.allergy||'')+' '+(x.note||'')),...R.map(f=>[f.allergyd,f.allergy_other,f.meds,f.htn_meds,f.diab_meds_o&&f.diab_meds_o.join(' '),f.ochr_d,f.autoimm_d].filter(Boolean).join(' '))].join(' ').toLowerCase(),
  alTxt=[...HL.map(x=>x.allergy||''),...R.map(f=>(f.allergyd||'')+' '+(f.allergy_other||''))].join(' ').toLowerCase();
 const add=(k,c)=>{if(c)T.add(k)};
 add('pen',al.includes('Penicillin')||/penicil|amoxi|ampicil|augmentin/.test(alTxt));
 add('nsaid',al.includes('NSAID')||/nsaid|ibuprofen|diclofenac|aspirin|brufen|voltaren/.test(alTxt));
 add('sulfa',/sulfa|sulpha|cotrimox|bactrim|septrin/.test(alTxt));
 add('preg',p.sex!='Male'&&(any(f=>f.preg)||ck.has('Pregnancy')));
 add('lact',p.sex!='Male'&&any(f=>o(f,'preg','Lactation')));
 add('renal',any(f=>f.renal));
 add('liver',any(f=>f.liver||f.hbv||f.hcv)||ck.has('Organopathy')&&!any(f=>f.renal));
 add('alc',any(f=>o(f,'subst','Alcohol')||o(f,'liver','Alcohol use')));
 add('ulcer',any(f=>o(f,'gi','Peptic ulcer')));
 add('gerd',any(f=>o(f,'gi','GERD')));
 add('ibd',any(f=>o(f,'gi','IBD')));
 add('htn',any(f=>f.htn)||ck.has('Hypertension'));
 add('hf',any(f=>o(f,'cvs','Heart failure')));
 add('cvs',any(f=>f.cvs)||ck.has('Heart Disease'));
 add('warf',any(f=>o(f,'antico','Warfarin'))||/warfarin|acenocoumarol|sintrom/.test(txt));
 add('doac',any(f=>o(f,'antico','DOAC'))||/rivaroxaban|apixaban|dabigatran|edoxaban|xarelto|eliquis/.test(txt));
 add('apl',any(f=>o(f,'antico','Aspirin')||o(f,'antico','Clopidogrel'))||/clopidogrel|plavix|aspirin/.test(txt));
 add('bleed',any(f=>f.bleed)||ck.has('Bleeding Disorder')||ck.has('Coagulopathy'));
 add('asthma',any(f=>f.resp&&((f.resp_o||[]).some(x=>/asthma|copd|emphysema|bronchitis/i.test(x))||!(f.resp_o||[]).length))||ck.has('Asthma'));
 add('diab',any(f=>f.diab)||ck.has('Diabetes Mellitus'));
 add('epil',any(f=>o(f,'neuro','Epilepsy')||o(f,'neuro','Seizures'))||ck.has('Epilepsy'));
 add('immuno',any(f=>f.immuno||f.hiv)||ck.has('Immune Deficiency'));
 add('anemia',ck.has('Anemia'));
 add('ssri',/fluoxetine|sertraline|citalopram|escitalopram|paroxetine|amitriptyline|ssri|antidepress/.test(txt));
 add('acei',/enalapril|captopril|lisinopril|ramipril|losartan|valsartan|telmisartan|ace inhib/.test(txt));
 add('lith',/lithium|methotrexate/.test(txt));
 const a=+p.age;if(a>0){add('child',a<12);add('young',a<8);add('elderly',a>=65)}
 add('latex',al.includes('Latex')||/latex/.test(alTxt));
 add('la',al.includes('Local anesthetic')||/lidocaine|lignocaine|articaine|local an(a)?esth/.test(alTxt));
 add('dial',any(f=>o(f,'renal','Dialysis')));
 add('antires',any(f=>f.antires));
 add('cancer',any(f=>f.cancer));
 add('pace',any(f=>o(f,'cvs','Pacemaker/ICD')));
 add('prophy',any(f=>['Valve disease','Previous infective endocarditis','Congenital heart disease'].some(v=>o(f,'cvs',v))));
 add('mi',any(f=>['MI','Angina','Stroke'].some(v=>o(f,'cvs',v))));
 add('inf',any(f=>f.hbv||f.hcv||f.hiv||o(f,'immuno','HIV')));
 add('tb',any(f=>o(f,'tb','Active')));
 add('anyac',T.has('warf')||T.has('doac')||T.has('apl'));
 return T}
const rxHasHx=p=>!!p&&((p.d.rec||[]).some(r=>r.f&&Object.keys(r.f).length)||(p.d.health||[]).length>0||!!(p.d.consent&&((p.d.consent.ck||[]).length||p.d.consent.o)));
/* Tags to show as "medically compromised" (age alone does not count) */
const rxFlags=p=>[...rxProf(p)].filter(k=>RXT[k]&&!RXT_AGE.includes(k));

/* Medicine rules. m = how the medicine is recognised (brand and generic names). r = [tag, level, why]. */
const RXD=[
 {n:'Penicillin (amoxicillin, ampicillin, Augmentin)',m:/amoxi\w*|ampicil\w*|augmentin|co-?amoxi\w*|penicillin\w*|flucloxa\w*|cloxacil\w*/i,r:[['pen','avoid','Penicillin allergy - risk of anaphylaxis. Choose another class (for example clindamycin or a macrolide) if your protocol allows.'],['renal','caution','Kidney disease - the dose may need to be lower.'],['warf','caution','Warfarin - the INR can rise. Tell the physician and check the INR.'],['liver','caution','Liver disease - Augmentin can harm the liver; use with care.']]},
 {n:'Cephalosporin',m:/cef\w+|ceph\w+|ceftriaxone/i,r:[['pen','caution','Penicillin allergy - some patients also react to cephalosporins. Avoid if the reaction was severe.'],['renal','caution','Kidney disease - adjust the dose.'],['warf','caution','Warfarin - can raise the INR.']]},
 {n:'Macrolide (azithromycin, erythromycin, clarithromycin)',m:/azithro\w*|erythro\w*|clarithro\w*|zithromax/i,r:[['liver','caution','Liver disease - use with care.'],['warf','caution','Warfarin - erythromycin and clarithromycin raise the INR.'],['cvs','caution','Heart disease - macrolides can affect the heart rhythm (QT).'],['preg','caution','Pregnancy - clarithromycin is best avoided; azithromycin is usually preferred.']]},
 {n:'Clindamycin',m:/clindamycin\w*|dalacin/i,r:[['ibd','caution','Bowel disease - risk of severe colitis (C. difficile).'],['liver','caution','Liver disease - use with care.'],['elderly','caution','Older patient - higher risk of antibiotic colitis.']]},
 {n:'Metronidazole / tinidazole',m:/metronidazole|tinidazole|flagyl/i,r:[['alc','avoid','Alcohol - serious reaction (vomiting, flushing). The patient must not drink alcohol during and for 48 hours after.'],['warf','avoid','Warfarin - strong rise of the INR and bleeding risk. Avoid or check the INR closely with the physician.'],['preg','caution','Pregnancy - avoid in the first trimester.'],['lact','caution','Breastfeeding - the baby gets the medicine; a single dose is safer.'],['liver','caution','Liver disease - lower the dose.'],['epil','caution','Epilepsy - can cause seizures or nerve problems in high doses.']]},
 {n:'Tetracycline / doxycycline',m:/tetracycl\w*|doxy\w*|minocycl\w*/i,r:[['preg','avoid','Pregnancy - harms the baby\'s teeth and bones.'],['young','avoid','Child under 8 - stains and damages developing teeth.'],['lact','caution','Breastfeeding - avoid if possible.'],['renal','caution','Kidney disease - use with care.'],['liver','caution','Liver disease - use with care.'],['warf','caution','Warfarin - can raise the INR.']]},
 {n:'Fluoroquinolone (ciprofloxacin, levofloxacin)',m:/cipro\w*|levoflox\w*|oflox\w*|moxiflox\w*/i,r:[['preg','avoid','Pregnancy - avoid.'],['child','avoid','Child - avoid unless no other choice.'],['epil','caution','Epilepsy - can cause seizures.'],['elderly','caution','Older patient - risk of tendon rupture and confusion.'],['diab','caution','Diabetes - can cause low or high blood sugar.'],['renal','caution','Kidney disease - lower the dose.'],['warf','caution','Warfarin - can raise the INR.']]},
 {n:'Sulfonamide (cotrimoxazole)',m:/co-?trimox\w*|bactrim|septrin|sulfameth\w*|sulpha\w*/i,r:[['sulfa','avoid','Sulfa allergy.'],['preg','avoid','Pregnancy - avoid.'],['renal','caution','Kidney disease - lower the dose.'],['warf','caution','Warfarin - raises the INR.']]},
 {n:'NSAID pain killer (ibuprofen, diclofenac, naproxen, ketorolac)',m:/ibuprofen|brufen|diclofenac|voltaren|naproxen|ketorolac|mefenamic\w*|ponstan|piroxicam|indometh\w*|celecoxib|etoricoxib|aceclofenac|nimesulide|ketoprofen|meloxicam/i,r:[['nsaid','avoid','Allergic to NSAIDs / aspirin.'],['ulcer','avoid','Stomach ulcer - risk of bleeding.'],['renal','avoid','Kidney disease - can damage the kidneys further. Paracetamol is safer.'],['hf','avoid','Heart failure - makes it worse.'],['anyac','avoid','Blood thinner (warfarin, DOAC, aspirin or clopidogrel) - high bleeding risk.'],['bleed','avoid','Bleeding disorder - increases bleeding.'],['preg','avoid','Pregnancy - avoid, especially after week 28. Paracetamol is preferred.'],['asthma','caution','Asthma - can trigger an attack in aspirin-sensitive patients. Avoid if an NSAID ever caused wheezing.'],['gerd','caution','Reflux - can irritate the stomach; take with food or add a stomach protector.'],['htn','caution','High blood pressure - can raise the pressure and weaken blood-pressure medicines.'],['cvs','caution','Heart disease - raises the risk of heart attack and fluid retention.'],['liver','caution','Liver disease - use with care.'],['acei','caution','ACE inhibitor / ARB - with an NSAID can harm the kidneys.'],['lith','caution','Lithium / methotrexate - an NSAID raises the level and the risk of poisoning.'],['elderly','caution','Older patient - higher risk of stomach bleeding and kidney injury. Use the lowest dose for the shortest time.']]},
 {n:'Aspirin',m:/aspirin|acetylsalicyl\w*|disprin/i,r:[['child','avoid','Child under 12 - risk of Reye syndrome. Use paracetamol.'],['nsaid','avoid','Allergic to aspirin / NSAIDs.'],['preg','avoid','Pregnancy - avoid.'],['bleed','avoid','Bleeding disorder.'],['warf','avoid','Warfarin - high bleeding risk.'],['ulcer','avoid','Stomach ulcer.'],['asthma','caution','Asthma - can trigger an attack.']]},
 {n:'Paracetamol',m:/paracetamol|acetaminophen|panadol|tylenol/i,r:[['liver','caution','Liver disease - keep to a low dose (not more than 2 g a day).'],['alc','caution','Regular alcohol use - liver risk. Keep the dose low (not more than 2 g a day).'],['warf','caution','Warfarin - regular high doses can raise the INR.']]},
 {n:'Tramadol',m:/tramadol/i,r:[['epil','avoid','Epilepsy - lowers the seizure threshold.'],['child','avoid','Child under 12 - avoid.'],['ssri','caution','Antidepressant - risk of serotonin syndrome and seizures.'],['renal','caution','Kidney disease - lower the dose.'],['liver','caution','Liver disease - lower the dose.'],['preg','caution','Pregnancy - avoid if possible.'],['elderly','caution','Older patient - confusion and falls; use a lower dose.'],['asthma','caution','Breathing disease - can slow breathing.'],['alc','caution','Alcohol - more drowsiness and breathing risk.']]},
 {n:'Codeine / dihydrocodeine',m:/codeine\w*|co-?codamol|dihydrocodeine/i,r:[['child','avoid','Child under 12 - avoid (risk of serious breathing problems).'],['lact','avoid','Breastfeeding - the baby can be harmed. Avoid.'],['preg','caution','Pregnancy - avoid if possible.'],['asthma','caution','Breathing disease - can slow breathing.'],['renal','caution','Kidney disease - lower the dose.'],['liver','caution','Liver disease - lower the dose.'],['elderly','caution','Older patient - confusion and constipation; use a lower dose.'],['alc','caution','Alcohol - more drowsiness and breathing risk.']]},
 {n:'Steroid (prednisolone, dexamethasone)',m:/prednis\w*|dexameth\w*|hydrocortis\w*|betameth\w*|methylpred\w*|steroid/i,r:[['diab','caution','Diabetes - raises blood sugar. Monitor.'],['htn','caution','High blood pressure - can raise the pressure.'],['ulcer','caution','Stomach ulcer - can make it worse.'],['immuno','caution','Weak immunity - higher infection risk.'],['preg','caution','Pregnancy - use only if clearly needed.'],['hf','caution','Heart failure - fluid retention.']]},
 {n:'Fluconazole / miconazole',m:/flucona\w*|miconazole|daktarin|ketoconaz\w*/i,r:[['warf','avoid','Warfarin - strong rise of the INR (miconazole gel too). Avoid.'],['doac','caution','DOAC - can raise the drug level.'],['preg','avoid','Pregnancy - avoid.'],['liver','caution','Liver disease - can harm the liver.'],['renal','caution','Kidney disease - lower the dose.']]},
 {n:'Benzodiazepine (diazepam, midazolam)',m:/diazepam|valium|midazolam|lorazepam|alprazolam|clonazepam/i,r:[['asthma','caution','Breathing disease - can slow breathing.'],['alc','caution','Alcohol - more drowsiness and breathing risk.'],['elderly','caution','Older patient - confusion and falls; use a lower dose.'],['preg','caution','Pregnancy - avoid if possible.'],['lact','caution','Breastfeeding - can make the baby sleepy.'],['liver','caution','Liver disease - lower the dose.'],['child','caution','Child - use only the right dose for weight.']]}
];

/* The check: patient file + medicine text -> list of {drug, sev, why} (Avoid first). */
function rxCheck(p,text){const T=rxProf(p),t=String(text||''),out=[],seen={},alTxt=((p.d.health||[]).map(x=>x.allergy||'').join(' ')+' '+(p.d.rec||[]).map(r=>r.f?((r.f.allergyd||'')+' '+(r.f.allergy_other||'')):'').join(' ')).toLowerCase();
 RXD.forEach(d=>{const m=t.match(d.m);if(!m)return;const drug=(m[0].charAt(0).toUpperCase()+m[0].slice(1).toLowerCase())+' - '+d.n.replace(/\s*\(.*\)/,'');
  if(m[0].length>=4&&alTxt.includes(m[0].toLowerCase()))push(drug,'avoid','The file says the patient is allergic to this medicine.');
  d.r.forEach(r=>{if(T.has(r[0]))push(drug,r[1],r[2])})});
 function push(drug,sev,why){const k=drug+'|'+why;if(seen[k])return;seen[k]=1;out.push({drug,sev,why})}
 return out.sort((a,b)=>(a.sev=='avoid'?0:1)-(b.sev=='avoid'?0:1))}
const rxText=()=>RXM.join(' ; ')+' ; '+(($('rx_txt')||{}).value||'')+' ; '+(($('rx_dx')||{}).value||'')+' ; '+(($('rx_ms')||{}).value||'');
const rxAlHtml=L=>L.map(a=>`<div class="rounded-lg border p-2 mb-2 text-sm ${a.sev=='avoid'?'bg-red-50 border-red-400 text-red-900':'bg-amber-50 border-amber-400 text-amber-900'}"><b><i class="fa fa-triangle-exclamation mr-1"></i>${a.sev=='avoid'?'AVOID':'Caution'}: ${H(a.drug)}</b><div>${H(a.why)}</div></div>`).join('');

/* Patient risk box (top of the prescription page) and the live alert list (under the medicines) */
function rxSafeBox(p){const T=rxProf(p),tags=[...T].filter(k=>RXT[k]);
 if(!rxHasHx(p))return `<div class="rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm mb-3"><i class="fa fa-circle-info mr-1"></i>No medical history is recorded for this patient yet. Ask about allergies, pregnancy, kidney or liver disease, blood thinners and other medicines before you prescribe.</div>`;
 if(!tags.length)return `<div class="rounded-lg border border-green-300 bg-green-50 p-2 text-sm mb-3 text-green-800"><i class="fa fa-shield-heart mr-1"></i>No allergy or medical risk recorded in the file. Still check with the patient.</div>`;
 const col=k=>['pen','nsaid','sulfa','preg','renal','liver','anyac','warf','doac','apl','bleed','hf','epil'].includes(k)||RXT_AGE.includes(k)&&k!='elderly'?'bg-red-100 text-red-800':'bg-amber-100 text-amber-800';
 return `<div class="rounded-lg border border-red-300 bg-red-50 p-2 mb-3"><b class="text-red-800 text-sm"><i class="fa fa-triangle-exclamation mr-1"></i>Medical alerts for this patient</b><div class="flex flex-wrap gap-1 mt-1">${tags.filter(k=>k!='anyac').map(k=>`<span class="rounded-full px-2 py-0.5 text-xs ${col(k)}">${H(RXT[k])}</span>`).join('')}</div><div class="text-xs text-gray-600 mt-1">The system warns you if a medicine does not suit these conditions.</div></div>`}
function rxAlertPaint(){const e=$('rx_al'),p=gp();if(!e||!p)return;const L=rxCheck(p,rxText());e.innerHTML=L.length?rxAlHtml(L):''}
document.addEventListener('input',e=>{if(e.target&&(e.target.id=='rx_txt'||e.target.id=='rx_dx'||e.target.id=='rx_ms')){clearTimeout(window.__rxT);window.__rxT=setTimeout(rxAlertPaint,400)}});
{const _c=rxChips;rxChips=function(){const r=_c.apply(this,arguments);rxAlertPaint();return r}}

/* Save guard: if there are alerts, stop and show them; the doctor goes back or continues (a reason is needed for "Avoid"). */
let RXO={list:[],why:''};
function rxWarnOpen(L){RXO.list=L;const p=gp(),av=L.some(a=>a.sev=='avoid');
 $('mb').innerHTML=`<h3 class="font-bold text-lg mb-1 ${av?'text-red-700':'text-amber-700'}"><i class="fa fa-triangle-exclamation mr-1"></i>Check before you prescribe</h3><p class="text-sm text-gray-600 mb-2">${H(p.name)}${p.age?', '+H(p.age)+' yrs':''}. These medicines may not suit this patient:</p><div style="max-height:50vh;overflow-y:auto">${rxAlHtml(L)}</div>
 ${av?'<label class="text-sm font-medium">Why do you still prescribe it? (required)</label><input id="rxo_r" class="inp mb-2" maxlength="160" placeholder="For example: no alternative, physician agreed">':''}<p id="rxo_m" class="text-sm text-red-600 mb-2"></p>
 <div class="flex flex-wrap gap-2"><button class="px-4 py-2 rounded text-white text-sm bg-green-600" onclick="cl()"><i class="fa fa-arrow-left mr-1"></i>Go back and change</button><button class="px-4 py-2 rounded border text-sm ${av?'border-red-400 text-red-700':''}" onclick="rxWarnGo(${av?1:0})">Prescribe anyway</button></div>`;
 md.classList.replace('hidden','flex')}
function rxWarnGo(av){const r=(($('rxo_r')||{}).value||'').trim();if(av&&r.length<3){$('rxo_m').textContent='Please write the reason.';return}RXO.why=r;cl();sp(1)}
{const _sp=sp;sp=function(ok){const p=gp();if(!p)return;const t=$('rx_ms');if(t&&t.value.trim())am();
 if(ok!==1){const L=rxCheck(p,rxText());if(L.length){rxWarnOpen(L);return}}
 const e=RXE,n0=(p.d.presc||[]).length,ov=ok===1?{by:U.name,at:Date.now(),why:RXO.why,alerts:RXO.list.map(a=>(a.sev=='avoid'?'AVOID ':'Caution ')+a.drug+': '+a.why)}:null;
 _sp();const a=p.d.presc||[];if(a.length<=n0)return; /* validation message shown, nothing saved */
 let x=a[a.length-1];if(ov)x.ovr=ov;
 if(e>=0&&a[e]&&e<a.length-1){const old=a[e];a.pop();a[e]={...x,date:old.date,by:old.by,...(old.lic?{lic:old.lic}:{}),edited:{by:U.name,at:Date.now()}};toast('Prescription changed.',1)}
 RXO={list:[],why:''};sv();go('patient')}}

/* Change a saved prescription: put it back in the form; saving replaces it (the first date and author stay, "changed by" is added). */
function rxEditP(i){const p=gp(),x=(p.d.presc||[])[i];if(!x)return;RXE=i;RXM=(x.meds||[]).slice();rxChips();
 $('rx_dx').value=x.dx||'';$('rx_txt').value=x.txt||'';const b=$('rx_eb');if(b)b.innerHTML=`<div class="rounded-lg border border-sky-300 bg-sky-50 p-2 text-sm mb-3 flex justify-between gap-2"><span><i class="fa fa-pen mr-1"></i>Changing the prescription of <b>${H(x.date)}</b>. Save to replace it.</span><button type="button" class="text-sky-800 underline" onclick="rxEditCancel()">Cancel</button></div>`;
 rxAlertPaint();window.scrollTo({top:0,behavior:'smooth'})}
function rxEditCancel(){RXE=-1;RXM=[];rxChips();$('rx_dx').value='';$('rx_txt').value='';const b=$('rx_eb');if(b)b.innerHTML=''}
