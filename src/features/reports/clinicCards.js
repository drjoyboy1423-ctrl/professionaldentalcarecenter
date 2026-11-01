/* ---------- Clinic paper-style prints: patient clinical summary card + medical certificate (Amharic / English) ---------- */
/* Clinic letterhead details used on these prints (edit here to change). Keyed by clinic id. */
const CLINIC_INFO={kal:{am:'ቃል ስፔሻሊቲ ዴንታል ክሊኒክ',phone:'0940734343 / 0911141621',addr:'ታይዋን ጉልላት ህንፃ 2ኛ ፎቅ'}};
const cInfo=()=>{const f=CLINIC_INFO[C.id]||{};return {am:C.name_am||f.am||'',phone:C.phone||f.phone||'',addr:C.address||f.addr||''}};
const A5_CSS='<style>@page{size:A5 portrait;margin:8mm}.cl-line{height:22px}.cl-sec{margin-top:11px}</style>';
const cLetterhead=(am,en)=>{const i=cInfo();return `<div class="cl-h"><div class="lgo">${C.logo?`<img src="${C.logo}">`:`<svg viewBox="0 0 100 100">${ICONS[C.icon]||ICONS.tooth}</svg>`}</div><div class="cl-hn">${i.am?`<div class="cl-am">${H(i.am)}</div>`:''}<div class="cl-en">${H(C.name)}</div>${i.phone?`<div class="cl-ph">&#9742; ${H(i.phone)}</div>`:''}</div></div>${am?`<div class="cl-badge"><b>${am}</b><br>${en}</div>`:''}`};
const CL_CSS=`<style>body{font-family:'Noto Sans Ethiopic','Nyala','Abyssinica SIL','Kefa',Arial,sans-serif;font-size:12.5px;line-height:1.4}.cl-h{display:flex;gap:12px;align-items:center;justify-content:center;margin-bottom:6px}.cl-hn{text-align:left}.cl-am{font-size:20px;font-weight:bold}.cl-en{font-size:18px;font-weight:bold}.cl-ph{font-size:13px;letter-spacing:1px;margin-top:2px}.cl-badge{width:60%;margin:8px auto 10px;border:2px dashed #444;border-radius:16px;text-align:center;padding:5px;font-size:15px}.cl-row{display:flex;gap:6px;align-items:flex-end;margin:8px 0}.cl-l{white-space:nowrap}.cl-v{flex:1;border-bottom:1px solid #333;min-height:18px;padding:0 4px}.cl-top{display:flex;gap:18px;margin-top:10px}.cl-top>div{flex:1}.cl-hx{font-size:11.5px}.cl-hx div{display:flex;justify-content:space-between;gap:8px;padding:2px 0}.cl-bx{display:inline-block;width:13px;height:13px;border:1.5px solid #222;text-align:center;line-height:11px;font-size:12px;font-weight:bold;flex:none}table.cl-t{width:100%;border-collapse:collapse;margin-top:12px;border:1.5px solid #222}table.cl-t th{background:#fff;color:#111;text-align:left;border:1px solid #222;padding:4px 6px;font-size:11.5px}table.cl-t td{border:1px solid #444;padding:5px 6px;font-size:11px;height:26px;vertical-align:top}.tg{display:inline-block;font-size:10px;font-weight:bold;border:1px solid #555;border-radius:4px;padding:0 4px;margin-right:4px;white-space:nowrap}.cl-line{border-bottom:1px solid #333;height:24px;margin:2px 0}.cl-sec{margin-top:14px;font-size:13.5px}.cl-sig{display:flex;gap:30px;margin-top:34px}.cl-sig>div{flex:1;border-top:1px solid #333;text-align:center;padding-top:3px}.cl-foot{margin-top:26px;font-weight:bold;font-size:14px}</style>`;
const clRowN=(...r)=>'<div style="display:flex;gap:14px">'+r.map(x=>'<div style="flex:1">'+x+'</div>').join('')+'</div>';
const clRow=(am,en,val,w)=>`<div class="cl-row"><span class="cl-l">${am?am+' / ':''}${en}:</span><span class="cl-v" style="${w?'flex:none;width:'+w:''}">${val==null||val===''?'&nbsp;':H(val)}</span></div>`;

/* ---- patient clinical summary card (Hx, medications, investigations, referral, biopsy, consent) ---- */
const HXLIST=[['ደም ግፊት','Hypertension',['Hypertension']],['ስኳር በሽታ','Diabetes',['Diabetes Mellitus']],['የደም መፍሰስ ችግር','Bleeding disorder',['Bleeding Disorder','Coagulopathy']],['የሳንባ በሽታ','TB / pneumonia',[],/\btb\b|pneumonia|tuberc/i],['የሚጥ በሽታ','Epilepsy',['Epilepsy']],['የጉበት በሽታ','Hepatitis A, B, C',[],/hepat/i],['ኤችአይቪ/ኤድስ','HIV/AIDS CD4',['Immune Deficiency'],/\bhiv\b|aids/i],['የሚወስደው መድሃኒት ካለ','Any drug taking',['Medications Taken']],['አለርጂ','Allergy',['Allergies']],['እርግዝና (ለሴቶች)','Pregnancy',['Pregnancy']],['ሌላ በሽታ ካለ','Any other disease',['Anemia','Asthma','Heart Disease','Organopathy']]];
const RFTICK={'Hypertension':f=>f.htn,'Diabetes':f=>f.diab,'Bleeding disorder':f=>f.bleed,'TB / pneumonia':f=>f.tb||hasO(f,'resp','Past TB'),'Epilepsy':f=>hasO(f,'neuro','Epilepsy')||hasO(f,'neuro','Seizures'),'Hepatitis A, B, C':f=>f.hbv||f.hcv||hasO(f,'liver','Hepatitis'),'HIV/AIDS CD4':f=>f.hiv||hasO(f,'immuno','HIV'),'Any drug taking':f=>f.meds,'Allergy':f=>(f.allergy||[]).length,'Pregnancy':f=>f.preg,'Any other disease':f=>f.cvs||f.renal||f.endo||f.autoimm||f.cancer||f.ochr||f.resp};
const rfTick=(p,n)=>(p.d.rec||[]).some(r=>r.f&&RFTICK[n]&&RFTICK[n](r.f));
function clinicalItems(p){const d=p.d,L=[],add=(x,o)=>{if(Object.values(o).some(v=>v&&String(v).trim()))L.push(Object.assign({ts:tsOf(x,p),cc:'',ex:'',dx:'',plan:'',done:''},o))},j=(...a)=>a.filter(v=>v!=null&&String(v).trim()!=='').join(' - ');
 (d.health||[]).forEach(x=>add(x,{cc:x.note,ex:j(x.bp&&'BP '+x.bp,x.allergy&&'Allergy: '+x.allergy)}));
 (d.note||[]).forEach(x=>add(x,{cc:j(x.title,x.note)}));
 (d.rec||[]).forEach(x=>add(x,{cc:x.cc,ex:j(x.tooth&&'Tooth '+x.tooth,x.assess,x.invest,x.note),dx:x.finding,plan:j(x.plancat,x.treat),done:x.done}));
 (d.ortho||[]).forEach(x=>add(x,{plan:j('Ortho',x.type,x.note)}));
 (d.presc||[]).forEach(x=>add(x,{dx:x.dx,plan:j('Rx: '+(x.meds||[]).join(', '),x.txt)}));
 (d.lab||[]).forEach(x=>add(x,{ex:j('Lab: '+(x.req||''),x.lab&&'('+x.lab+')',x.done=='Yes'?'done':'ordered')}));
 (d.img||[]).forEach(x=>add(x,{ex:j('X-ray: '+(x.kind||''),x.tooth&&'Tooth/Area '+x.tooth,x.note)}));
 (d.ref||[]).forEach(x=>add(x,{done:j('Referral',x.to&&'to '+x.to,x.why)}));
 (d.fna||[]).forEach(x=>add(x,{plan:j(x.type=='Biopsy'?'Biopsy':'FNA',x.site,x.note)}));
 return L.sort((a,b)=>a.ts-b.ts)}
function clinicalSummaryHtml(p){const c=p.d.consent||{ck:[],o:'',t:''},ck=new Set(c.ck||[]),txt=(c.o||'')+' '+((p.d.health||[]).map(x=>x.allergy||'').join(' ')),items=clinicalItems(p),
 on=h=>rfTick(p,h[1])||h[2].some(n=>ck.has(n))||(h[3]&&h[3].test(txt))||(h[1]=='Allergy'&&(p.d.health||[]).some(x=>x.allergy)),
 hx=HXLIST.map(h=>`<div><span>${h[0]} /${h[1]}/</span><span class="cl-bx">${on(h)?'&#10003;':''}</span></div>`).join(''),
 other=[...ck].filter(n=>['Anemia','Asthma','Heart Disease','Organopathy'].includes(n)).join(', '),
 rows=items.map(x=>`<tr><td style="white-space:nowrap">${H(fdate(x.ts))}</td><td>${H(x.cc)}</td><td>${H(x.ex)}</td><td>${H(x.dx)}</td><td>${H(x.plan)}</td><td>${H(x.done)}</td></tr>`).join('')+Array(Math.max(0,8-items.length)).fill('<tr>'+'<td>&nbsp;</td>'.repeat(6)+'</tr>').join('');
 return CL_CSS+cLetterhead('','')+`<div class="cl-top"><div>${clRow('የካርድ ቁጥር','Card No',p.card)}${clRow('ቀን','Date',fdate(p.date||Date.now()))}${clRow('ስም','Patient\'s Name',p.name)}${clRow('አድራሻ','Address','')}<div class="cl-row" style="gap:8px"><span class="cl-l">ክ/ከተማ S.City</span><span class="cl-v"></span><span class="cl-l">ወረዳ Woreda</span><span class="cl-v"></span><span class="cl-l">H.No.</span><span class="cl-v" style="flex:.6"></span></div>${clRow('ስልክ ቁጥር','Tel. No',p.phone)}${clRow('ዕድሜ / ፆታ','Age / Sex',(p.age||'')+(p.sex?' / '+p.sex:''))}${clRow('','Relative name','')}${clRow('','Relative Tel. No','')}</div>
  <div class="cl-hx"><div style="justify-content:flex-start"><b>የታካሚው ጤንነት ሁኔታ /Medical History/</b></div>${hx}${other?`<div class="muted" style="font-size:10.5px">Other: ${H(other)}${c.o?' &middot; '+H(c.o):''}</div>`:c.o?`<div style="font-size:10.5px">Other: ${H(c.o)}</div>`:''}</div></div>
  <table class="cl-t"><tr><th colspan="6">Clinical History</th></tr><tr><th style="width:11%">Date</th><th style="width:17%">C/c</th><th style="width:22%">Examination / Investigation</th><th style="width:16%">Dx</th><th style="width:19%">Rx plan</th><th style="width:15%">Rx done</th></tr>${rows}</table>
  <div class="cl-sec"><b>ፈቃድ / Consent:</b> ${c.t?H(c.t)+'. ':''}የተገለጸልኝን ሕክምና ለማድረግ ፈቃደኛ ነኝ። / I agree to the treatment explained to me.</div>
  <div class="cl-sig"><div>የታካሚ ፊርማ / Patient signature</div><div>ሐኪም ፊርማ / Doctor signature</div><div>ቀን / Date</div></div>`}
function clinicalSummaryPrint(id){const p=id!=null?S.patients.find(x=>x.id==id):gp();if(!p)return;printHtml('Clinical summary - '+p.name,clinicalSummaryHtml(p))}

/* ---- medical certificate (paper layout) ---- */
function medCertHtml(p,x){x=x||{};const lines=(t,n)=>{const a=String(t||'').split('\n').filter(Boolean);return Array.from({length:Math.max(n,a.length)},(_,i)=>`<div class="cl-line">${H(a[i]||'')}</div>`).join('')},
 dd=toDate(x.date),ret=dd&&+x.days>0?fdate(new Date(dd.getTime()+(+x.days)*864e5)):'';
 return CL_CSS+A5_CSS+cLetterhead('የህክምና የምስክር ወረቀት','Medical Certificate')+
  clRow('','Patient\'s Full Name',p&&p.name)+clRowN(clRow('','Sex',p&&p.sex),clRow('','Age',p&&p.age),clRow('','Address',''))+
  `<div class="cl-sec"><b>የታከመበት ቦታ / Examined / Treated on</b></div><div class="cl-line">${H(p?C.name:'')}</div>`+
  `<div class="cl-sec"><b>የህመማቸው ዓይነት / Diagnosis</b></div>${lines(x.dx,3)}`+
  `<div class="cl-sec"><b>የሀኪሙ ትዛዝ / Doctor's Recommendation</b></div>${lines(x.rec,3)}`+
  clRow('የተፈቀደላቸው ዕረፍት','',x.days?x.days+' day(s)':'')+`<div class="cl-line"></div>`+clRow('ወደ ስራ የሚመለሱበት ቀን','',ret)+`<div class="cl-line"></div>`+
  `<div class="cl-sig" style="margin-top:34px"><div>Dr.'s Signature</div><div>Date${x.date?': '+H(fdate(x.date)):''}</div></div>`+
  (cInfo().addr?`<div class="cl-foot">አድራሻ፦ ${H(cInfo().addr)}</div>`:'')}
function medCert(i){const p=gp();if(!p)return;const a=p.d.cert||[],x=i=='blank'?null:a[i!=null?i:a.length-1];printHtml('Medical certificate'+(x?' - '+p.name:''),medCertHtml(x?p:null,x||{}))}


/* ---- drug prescription (paper layout, clinic letterhead from the clinic's own settings) ---- */
function prescHtml(p,x){x=x||{};const meds=(x.meds||[]),txt=String(x.txt||'').split('\n').filter(Boolean),items=[...meds.map(m=>m),...txt],n=Math.max(8,items.length),
 rows=Array.from({length:n},(_,i)=>`<div class="cl-line" style="display:flex;gap:6px">${items[i]?`<span>${i<meds.length?(i+1)+'.':''}</span><span>${H(items[i])}</span>`:''}</div>`).join('');
 return CL_CSS+A5_CSS+cLetterhead('የመድሃኒት ማዘዣ','Drug Prescription')+
  clRow('ስም','Patient\'s Full Name',p&&p.name)+clRowN(clRow('','Age',p&&p.age),clRow('','Sex',p&&p.sex),clRow('','Card No',p&&p.card))+
  clRow('ቀን','Date',x.date?fdate(x.date):'')+
  `<div class="cl-sec"><b>የህመም ዓይነት / Diagnosis</b></div><div class="cl-line">${H(x.dx||'')}</div><div class="cl-line"></div>`+
  `<div class="cl-sec" style="display:flex;align-items:baseline;gap:8px"><span style="font-size:30px;font-weight:bold;font-family:serif">&#8478;</span><b>መድሃኒት / Medication &amp; instructions</b></div>${rows}`+
  `<div class="cl-sig" style="margin-top:30px"><div>${x.by?H(x.by)+' - ':''}Dr.'s Signature &amp; Stamp</div><div>Date${x.date?': '+H(fdate(x.date)):''}</div></div>`+
  (cInfo().addr?`<div class="cl-foot">አድራሻ፦ ${H(cInfo().addr)}</div>`:'')}
function prescPrint(i){const p=gp();if(!p)return;const a=p.d.presc||[],x=i=='blank'?null:a[i!=null?i:a.length-1];printHtml('Prescription'+(x?' - '+p.name:''),prescHtml(x?p:null,x||{}))}
