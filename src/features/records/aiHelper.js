/* ---------- AI helper (Gemini) - patient menu "AI helper" ----------
   Calls the server function /api/gemini (api/gemini.js). The Gemini key lives only on the server (Vercel variable GEMINI_API_KEY).
   Doctors, nurses, managers and administrators. What is sent is the text in the box: it is filled from the file WITHOUT name, phone, card number
   or free-text notes, the person reads and can change it, and nothing is sent until the Run button is pressed.
   Tasks: summary of the record, home-care instructions for the patient (English, Amharic, Afaan Oromo, Tigrinya), translation, a question to ask.
   The answer can be copied or saved as a note on the patient (kept as written by the AI helper, with the name of the staff member). */
const AIT={summary:'Summary of this record for the dentist',instructions:'Home-care instructions for the patient',translate:'Translate a text',ask:'Ask a question'};
const AIL=['English','Amharic','Afaan Oromo','Tigrinya'];
let AIS={task:'summary',lang:'Amharic',out:'',busy:false,pid:null};
SIDE.push(['ai','AI helper']);
const aiOk=()=>!!U&&['doctor','nurse','manager','admin'].includes(U.role);

/* the file as plain text without anything that names the patient */
function aiCase(p){const L=[],a=+p.age;L.push('Age: '+(a>0?a+' years':'not recorded')+'; sex: '+(p.sex||'not recorded'));
 const fl=typeof rxFlags=='function'?rxFlags(p).map(k=>RXT[k]):[];L.push('Medical risks: '+(fl.length?fl.join(', '):'none recorded'));
 const R=(p.d.rec||[]).map(r=>r.f).filter(Boolean),al=[...new Set([].concat(...R.map(f=>f.allergy||[])))];if(al.length)L.push('Allergic to: '+al.join(', '));
 ['endo','pros','perio','omfs','impl','ortho'].forEach(k=>{const x=(p.d[k]||[]).slice(-1)[0];if(!x||!SEC[k])return;
  const s=SEC[k].f.filter(f=>f[0]!='note'&&f[0]!='fu'&&x[f[0]]).map(f=>f[1]+': '+x[f[0]]).join('; ');if(s)L.push(SEC[k].t+' (latest of '+(p.d[k]||[]).length+'): '+s)});
 const ps=(p.d.presc||[]).slice(-3).map(x=>[x.dx&&'for '+x.dx,(x.meds||[]).join(', ')].filter(Boolean).join(': ')).filter(Boolean);if(ps.length)L.push('Recent prescriptions: '+ps.join(' | '));
 const pl=(p.d.plan||[]).slice(-3).map(x=>x.title).filter(Boolean);if(pl.length)L.push('Treatment plans: '+pl.join(', '));
 const fu=(p.d.fu||[]).filter(f=>f.st=='Due').sort((x,y)=>x.date<y.date?-1:1).slice(0,3).map(f=>f.type+' on '+f.date);if(fu.length)L.push('Follow-up due: '+fu.join('; '));
 L.push('Status: '+(p.fin?'treatment finished':'in treatment'));return L.join('\n')}
function aiFill(p){const t=AIS.task;return t=='summary'?aiCase(p):t=='instructions'?'Treatment given (write it here, for example: root canal on tooth 36, temporary filling):\n\n'+'Patient: '+(+p.age>0?p.age+' years':'age not recorded')+(p.sex?', '+p.sex:'')+(typeof rxFlags=='function'&&rxFlags(p).length?'\nMedical risks: '+rxFlags(p).map(k=>RXT[k]).join(', '):''):''}

function aiSection(p){if(AIS.pid!=p.id){AIS={task:'summary',lang:AIS.lang||'Amharic',out:'',busy:false,pid:p.id}}
 if(!aiOk())return hd('AI helper')+'<p class="text-gray-500">Only doctors, nurses, managers and administrators can use the AI helper.</p>';
 const need=AIS.task=='instructions'||AIS.task=='translate';
 setTimeout(()=>{const e=$('ai_in');if(e&&!e.dataset.f){e.dataset.f=1;e.value=aiFill(p)}},0);
 return hd('AI helper')+`<div class="rounded-lg border border-amber-300 bg-amber-50 p-2 text-sm mb-3"><i class="fa fa-shield-halved mr-1"></i>The text below is sent to Google Gemini (an outside AI service) when you press <b>Run</b>. The name, phone and card number are never included. Read the text first and remove anything you do not want to send. The AI can be wrong: the dentist decides.</div>
 <div class="flex flex-wrap gap-2 mb-2 items-center"><select id="ai_t" class="inp" style="width:auto;margin:0" onchange="aiTask(this.value)">${Object.keys(AIT).map(k=>`<option value="${k}" ${AIS.task==k?'selected':''}>${AIT[k]}</option>`).join('')}</select>${need?`<select id="ai_l" class="inp" style="width:auto;margin:0" onchange="AIS.lang=this.value">${AIL.map(l=>`<option ${AIS.lang==l?'selected':''}>${l}</option>`).join('')}</select>`:''}</div>
 <label class="block text-sm font-medium mb-1">${AIS.task=='translate'?'Text to translate':AIS.task=='ask'?'Your question':'Text that will be sent'}</label>
 <textarea id="ai_in" rows="${AIS.task=='summary'?9:6}" maxlength="12000" class="inp mb-2" placeholder="${AIS.task=='ask'?'Write your question':AIS.task=='translate'?'Paste or write the text':''}"></textarea>
 <div class="flex flex-wrap gap-2 mb-3"><button id="ai_go" onclick="aiRun()" class="px-4 py-2 rounded text-white text-sm bg-red-600" ${AIS.busy?'disabled':''}><i class="fa fa-wand-magic-sparkles mr-1"></i>${AIS.busy?'Please wait...':'Run'}</button></div>
 <div id="ai_out">${aiOut()}</div>`}
const aiOut=()=>AIS.out?`<div class="bg-gray-50 rounded-lg shadow p-3 text-sm"><div class="flex justify-between gap-2 mb-1"><b>${H(AIT[AIS.task])}${AIS.task=='instructions'||AIS.task=='translate'?' ('+H(AIS.lang)+')':''}</b><span class="text-xs text-gray-500">by Gemini${AIS.model?' ('+H(AIS.model)+')':''}</span></div><div class="whitespace-pre-wrap">${H(AIS.out)}</div><div class="flex flex-wrap gap-3 text-xs mt-2"><span class="cursor-pointer text-sky-700" onclick="aiCopy()"><i class="fa fa-copy"></i> Copy</span><span class="cursor-pointer text-green-700" onclick="aiSave()"><i class="fa fa-note-sticky"></i> Save as note</span></div><p class="text-xs text-gray-500 mt-2">Written by an AI. Check it before you use it.</p></div>`:(AIS.err?`<p class="text-sm text-red-600">${H(AIS.err)}</p>`:'');
function aiTask(t){AIS.task=t;AIS.out='';AIS.err='';const p=gp();if(p)go('patient')}
async function aiRun(){const p=gp(),e=$('ai_in');if(!p||!e||AIS.busy)return;const text=e.value.trim();if(text.length<3){AIS.err='Please write or paste some text first.';$('ai_out').innerHTML=aiOut();return}
 AIS.busy=true;AIS.err='';AIS.out='';const b=$('ai_go');if(b){b.disabled=true;b.innerHTML='Please wait...'}
 try{const t=await DB.token();if(!t)throw new Error('Please sign in again.');
  const r=await fetch(FAPI+'/api/gemini',{method:'POST',headers:{Authorization:'Bearer '+t,'Content-Type':'application/json'},body:JSON.stringify({task:AIS.task,text,lang:AIS.lang})});
  if(r.status==404)throw new Error('The AI helper is only available on the Vercel version of this app.');
  const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'The AI helper could not answer.');AIS.out=d.text;AIS.model=d.model}
 catch(x){AIS.err=x.message||'The AI helper could not answer.'}
 AIS.busy=false;const o=$('ai_out');if(o)o.innerHTML=aiOut();const g=$('ai_go');if(g){g.disabled=false;g.innerHTML='<i class="fa fa-wand-magic-sparkles mr-1"></i>Run'}}
function aiCopy(){try{navigator.clipboard.writeText(AIS.out);toast('Copied',1)}catch(e){prompt('Copy this text',AIS.out)}}
function aiSave(){const p=gp();if(!p||!AIS.out)return;const x=mkItem('note',{title:'AI helper - '+AIT[AIS.task],note:AIS.out+'\n\n(Written by the AI helper (Gemini), saved by '+U.name+'.)'},p);if(!x)return;sv();toast('Saved as a note.',1);go('patient')}
{const _s=sec;sec=function(p){return SK=='ai'?aiSection(p):_s.apply(this,arguments)}}
