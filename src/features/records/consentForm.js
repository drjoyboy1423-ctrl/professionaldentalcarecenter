/* ---------- Bilingual consent + fee agreement form (Amharic first, English second) ---------- */
const CF={
 t1:['የታካሚ የጥርስ ሕክምና አገልግሎት ፈቃድ ቅጽ','Patient\'s Consent Form for Dental Medical Services'],
 t2:['የአገልግሎትና የሕክምና ክፍያ ስምምነት ቅጽ','Treatment Fee Agreement Form'],
 s1:[
  ['በመፈረም፣ የክሊኒኩ ሐኪም ለምርመራዬ፣ ለሕክምናዬ ወይም ለእንክብካቤዬ አስፈላጊ የሆኑ የጥርስ ሕክምናዎችንና ሂደቶችን እንዲያከናውን ፈቃድ እሰጣለሁ። እነዚህም የደም ምርመራ፣ የራዲዮሎጂ ምርመራ (ራጅ)፣ የቀዶ ሕክምና እና ማደንዘዣ ሊያካትቱ ይችላሉ።','By signing, I give the clinic\'s physician permission to perform the dental treatments and procedures needed for my diagnosis, treatment, or care. These may include blood tests, radiological exams (X-rays), surgical procedures, and anesthesia.'],
  ['የጤንነት ሁኔታዬ፣ የታቀደው ሕክምና ዓላማ፣ ጥቅምና አደጋዎች፣ እንዲሁም አማራጭ ሕክምናዎች እንደተገለጹልኝ፣ ጥያቄ ለመጠየቅ እድል እንደተሰጠኝና አጥጋቢ መልስ እንዳገኘሁ አረጋግጣለሁ።','I confirm that the clinic explained my condition, the purpose, risks, benefits, and alternatives of the proposed treatment. I was allowed to ask questions and received satisfactory answers.'],
  ['ይህን ቅጽ እንዳነበብኩ (ወይም እንደተነበበልኝ) አረጋግጣለሁ።','I confirm that I read this form, or had it read to me.']],
 s2:[
  ['ስለ ሕክምና ክፍያ እንደተወያየሁና ጥያቄዎቼ ሙሉ በሙሉ እንደተመለሱ አረጋግጣለሁ።','I confirm that I discussed the treatment fee and had my questions fully answered.'],
  ['ስለ አገልግሎቱ ዋጋና ሕክምና መረጃ እንደደረሰኝ፣ ክፍያዎቹንና አማራጭ የክፍያ መንገዶችን እንደተረዳሁ፣ ሙሉ የጥርስ ሕክምናና አገልግሎት ወጪዎችን ለመክፈልና ሕክምናውን ለመቀጠል እንደተስማማሁ አረጋግጣለሁ።','I confirm that I received information about the service cost and treatment, understand the fees and alternative payment options, and agree to pay all dental and treatment costs and to proceed.']],
 sum:{
  am:['ይህ ከካል ስፔሻሊቲ ዴንታል ክሊኒክ የተሰጠ ሁለት ክፍል ያለው ቅጽ ነው።','1. የታካሚ የጥርስ ሕክምና ፈቃድ ቅጽ፦ የግል መረጃዎን ይሞላሉ (የትውልድ ቀን፣ ስም፣ አድራሻ፣ ስልክ፣ የአደጋ ጊዜ ተጠሪ)። በመፈረም ለክሊኒኩ ሐኪም አስፈላጊ የሆኑ የጥርስ ሕክምናዎችንና ሂደቶችን (የደም ምርመራ፣ ራጅ፣ የቀዶ ሕክምና፣ ማደንዘዣ) እንዲያከናውን ፈቃድ ይሰጣሉ፤ ሁኔታዎ፣ የሕክምናው ዓላማ፣ ጥቅምና አደጋዎች፣ አማራጮች እንደተገለጹልዎት እና ቅጹን እንዳነበቡ ያረጋግጣሉ።','2. የአገልግሎትና የሕክምና ክፍያ ስምምነት ቅጽ፦ ስለ ክፍያ እንደተወያዩ፣ የሐኪሙን ስም፣ የካርድ ቁጥር እና እስከ 5 ሕክምናዎችን ከዋጋቸው ጋር ይሞላሉ፤ ክፍያውንና የክፍያ አማራጮችን እንደተረዱና ወጪዎቹን ለመክፈል እንደተስማሙ ያረጋግጣሉ። ቅጹ በታካሚው (ወይም በወላጅ/የትዳር አጋር) እና በሐኪሙ ፊርማና ቀን ይጠናቀቃል።'],
  en:['This is a two-part form from the clinic.','1. Patient\'s Consent Form for Dental Medical Services: you fill in your details (date of birth, name, address, phone, emergency contact). By signing, you let the clinic\'s physician perform the dental treatments and procedures needed (blood tests, X-rays, surgery, anesthesia); you confirm your condition, the purpose, risks, benefits and alternatives were explained, and that you read the form.','2. Treatment Fee Agreement Form: you confirm you discussed the fee; the form has space for the doctor\'s name, your card number and up to 5 treatments with their costs; you confirm you understand the fees and payment options and agree to pay. It is signed and dated by the patient (or guardian/spouse) and the physician.']}
};
function consentSummary(){const col=(h,a)=>`<div class="bg-gray-50 rounded-lg p-3 text-sm"><div class="font-bold mb-1">${h}</div>${a.map(x=>`<p class="mb-2">${H(x)}</p>`).join('')}</div>`;
 return `<div class="grid md:grid-cols-2 gap-3 mb-4">${col('ማጠቃለያ (አማርኛ)',CF.sum.am)}${col('Summary (English)',CF.sum.en)}</div>`}
function consentForm(blank){const p=blank?null:gp(),v=x=>p&&x!=null&&x!==''&&x!=='N/A'?H(x):'',
 ln=(am,en,val,w)=>`<div class="cfr"><span class="cfl">${am} / ${en}:</span><span class="cfv" style="${w?'flex:none;width:'+w:''}">${val||'&nbsp;'}</span></div>`,
 pr=a=>a.map((x,i)=>`<p class="cfp"><b>${i+1}.</b> ${H(x[0])}<br><span class="cfe">${H(x[1])}</span></p>`).join(''),
 sg=(am,en)=>`<div class="cfs"><div class="cfsl"></div><div>${am} / ${en}</div></div>`,
 dt=`<div class="cfs"><div class="cfsl"></div><div>ቀን / Date</div></div>`,
 rows=[1,2,3,4,5].map(i=>`<tr><td style="width:6%">${i}</td><td>&nbsp;</td><td style="width:28%">&nbsp;</td></tr>`).join('');
 const css=`<style>body{font-family:'Noto Sans Ethiopic','Nyala','Abyssinica SIL','Kefa',Arial,sans-serif;font-size:12.5px;line-height:1.45}.cft{text-align:center;margin:6px 0 10px}.cft b{display:block;font-size:16px}.cft span{font-size:13px;color:#333}.cfr{display:flex;gap:6px;align-items:flex-end;margin:9px 0}.cfl{white-space:nowrap}.cfv{flex:1;border-bottom:1px solid #333;min-height:18px;padding:0 4px}.cfp{margin:8px 0}.cfe{color:#333;font-size:12px}.cfg{display:flex;gap:16px}.cfg>div{flex:1}.cfsw{display:flex;gap:30px;margin-top:38px}.cfs{flex:1;text-align:center}.cfsl{border-bottom:1px solid #333;height:30px}.cfs div:last-child{padding-top:3px}.pg2{page-break-before:always}table.cft2 td{height:30px;border:1px solid #333}table.cft2 th{border:1px solid #333}</style>`;
 const part1=`<div class="pg"><div class="cft"><b>${CF.t1[0]}</b><span>${CF.t1[1]}</span></div>
  <div class="cfg"><div>${ln('የትውልድ ቀን','Date of birth',v(p&&p.dob?fdate(p.dob):''))}</div><div>${ln('ስም','Name',v(p&&p.name))}</div></div>
  <div class="cfg"><div>${ln('አድራሻ','Address','')}</div><div>${ln('ስልክ ቁጥር','Phone',v(p&&p.phone))}</div></div>
  <div style="margin-top:6px"><b>የአደጋ ጊዜ ተጠሪ / Emergency contact</b></div>
  <div class="cfg"><div>${ln('ስም','Name','')}</div><div>${ln('ግንኙነት','Relationship','')}</div><div>${ln('ስልክ','Phone','')}</div></div>
  ${pr(CF.s1)}
  <div class="cfsw">${sg('የታካሚ / የወላጅ / የትዳር አጋር ፊርማ','Signature of patient / guardian / spouse')}${dt}</div></div>`;
 const part2=`<div class="pg2"><div class="cft"><b>${CF.t2[0]}</b><span>${CF.t2[1]}</span></div>
  <div class="cfg"><div>${ln('የሐኪም ስም','Doctor\'s name','')}</div><div>${ln('የካርድ ቁጥር','Card No.',v(p&&p.card))}</div></div>
  ${pr([CF.s2[0]])}
  <table class="cft2"><tr><th>#</th><th>ሕክምና / Treatment</th><th>ዋጋ / Cost (ETB)</th></tr>${rows}<tr><td></td><td style="text-align:right"><b>ጠቅላላ / Total</b></td><td>&nbsp;</td></tr></table>
  ${pr([CF.s2[1]]).replace('<b>1.</b>','<b>2.</b>')}
  <div class="cfsw">${sg('የታካሚ / የወላጅ / የትዳር አጋር ፊርማ','Patient / guardian / spouse signature')}${dt}</div>
  <div class="cfsw">${sg('የሐኪም ፊርማ','Physician signature')}${dt}</div></div>`;
 printHtml('Consent & Fee Agreement'+(p?' - '+p.name:''),css+docHead('ፈቃድና የክፍያ ስምምነት / Consent & Fee Agreement','')+part1+part2)}
