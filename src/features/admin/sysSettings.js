/* ---------- System settings: every rule that applies to all users or clinics, editable only by the administrator ----------
   Stored in table app_settings (key, value json, public). Defaults below equal the app's original behaviour, so nothing changes until the administrator edits a value. */
const AS=(()=>{
 const D={
  'signup.enabled':true,'signup.days':365,'signup.perDay':25,
  'acc.anyDoctor':true,'acc.nurseRec':true,'acc.nurseInv':true,'pw.min':6,'session.idleMin':0,
  'pay.brackets':[[2000,0],[4000,15],[7000,20],[10000,25],[14000,30],[null,35]],'spec.min':40,'spec.max':60,'pay.pen':7,'pay.emp':11,
  'lab.def':[{k:'Zirconia',w:'zircon',fee:5000},{k:'PFM',w:'pfm,porcelain',fee:1200},{k:'Chrome',w:'chrome,cobalt,copalt,metal',fee:800}],
  'ster.tests':[['Chemical indicator (every cycle)',1],['Bowie-Dick (daily)',1],['Biological spore test (weekly)',7]],
  'exp.days':60,'backup.keep':8,'backup.minDays':6,
  'donate.text':'ProDental Records is free for one year. If it helps your clinic, you are welcome to support its development with a donation of any amount. Donating is your choice and nothing is locked or changed if you do not. To donate, send to any account below (account name: Dr. EBSA TOFIK ABDULKARIM).',
  'donate.acc':[['eBirr','0915018709'],['CBO (Cooperative Bank of Oromia)','1046400112421'],['CBE (Commercial Bank of Ethiopia)','1000153677064']]};
 const PUB=['signup.enabled','pw.min'];
 let V={};
 const api={D,PUB,
  v(k){return V[k]!==undefined&&V[k]!==null?V[k]:D[k]},
  custom(k){return V[k]!==undefined},
  brackets(){const L=(api.v('pay.brackets')||[]).filter(r=>r&&(+r[1]>=0)),B=[];let pu=0,pr=0,pd=0;L.forEach((r,i)=>{const up=r[0]==null||r[0]===''?1e15:+r[0],rt=(+r[1])/100,d=pd+pu*(rt-pr);B.push([up,rt,d]);pu=up;pr=rt;pd=d});if(!B.length||B[B.length-1][0]<1e15)B.push([1e15,B.length?B[B.length-1][1]:0,B.length?B[B.length-1][2]:0]);return B},
  async load(){try{const r=await DB.settingsGet(),n={};r.forEach(x=>{n[x.key]=x.value});V=n}catch(e){}},
  async save(k,val){await DB.settingsSet(k,val,PUB.includes(k),U&&U.username);V[k]=val},
  async reset(k){await DB.settingsDel(k);delete V[k]}};
 return api})();
/* load settings once the app starts (public ones before sign-in) and again after sign-in */
{const _i=DB.init;DB.init=async function(){const r=await _i.apply(this,arguments);AS.load().then(asApply);return r}}
{const _lc=loadClinic;loadClinic=async function(){await AS.load();asApply();return _lc.apply(this,arguments)}}
function asApply(){const b=document.querySelector('button[onclick="clReqOpen()"]');if(b)b.style.display=AS.v('signup.enabled')===false?'none':'';asIdle()}
/* automatic sign-out after the chosen minutes without use (0 = never) */
let AS_T=0,AS_ON=0;
function asIdle(){clearTimeout(AS_T);const m=+AS.v('session.idleMin')||0;if(!m||!U)return;const arm=()=>{clearTimeout(AS_T);AS_T=setTimeout(()=>{if(U&&(+AS.v('session.idleMin')||0)){toast('Signed out: no activity');logout()}},m*60000)};arm();if(!AS_ON){AS_ON=1;['click','keydown','touchstart','mousemove'].forEach(e=>addEventListener(e,()=>{if(U&&+AS.v('session.idleMin'))arm()},{passive:true}))}}
const _goSys=go;go=function(v){if(v=='sys'&&(!U||U.role!='admin'))v='dash';return _goSys.apply(this,arguments)};
/* ----- page ----- */
const asLines=a=>a.map(r=>r.join(' | ')).join('\n');
const asIn=(id,l,v,h,t)=>`<label class="block text-sm mb-3"><span class="font-medium">${l}</span><input id="as_${id}" type="${t||'number'}" value="${H(v)}" class="w-full border rounded-md px-3 py-2 mt-1">${h?`<span class="text-xs text-gray-500">${h}</span>`:''}</label>`;
const asTa=(id,l,v,h,r)=>`<label class="block text-sm mb-3"><span class="font-medium">${l}</span><textarea id="as_${id}" rows="${r||4}" class="w-full border rounded-md px-3 py-2 mt-1 font-mono text-xs">${H(v)}</textarea><span class="text-xs text-gray-500">${h}</span></label>`;
function sysPage(){if(!U||U.role!='admin')return '';const v=AS.v,st=k=>AS.custom(k)?'':'';
 const sec=(ic,t,d,b)=>card(`<h3 class="font-bold mb-1"><i class="fa ${ic} mr-2"></i>${t}</h3>`,`<p class="text-sm text-gray-500 mb-3">${d}</p>${b}`);
 return hd('System settings')+`<p class="text-sm text-gray-600 mb-4">Rules here apply to <b>every clinic and every user</b>. Only the administrator sees this page. Changes take effect the next time people open the app.</p>`+
 sec('fa-door-open','Sign-up and access','Who can start using the app and how sign-in is protected.',
  `<label class="flex items-center gap-2 text-sm mb-3"><input type="checkbox" id="as_signup" ${v('signup.enabled')!==false?'checked':''}> Allow new clinics to sign up themselves (shows the "New clinic" button on the sign-in page)</label>`+
  asIn('sdays','Free period for a new clinic (days)',v('signup.days'),'After this the clinic is locked until you approve it.')+
  asIn('sper','New clinics allowed per day',v('signup.perDay'),'Protects against spam sign-ups.')+
  asIn('pw','Minimum password length',v('pw.min'),'Applies when creating users and changing passwords. Also set the same value in Supabase > Authentication > Password.')+
  asIn('idle','Sign out after minutes without use',v('session.idleMin'),'0 = never sign out automatically.'))+
 sec('fa-user-pen','Who can edit patient files','Reading is always open to clinic staff. These switches decide who can change records and invoices.',
  `<label class="flex items-center gap-2 text-sm mb-2"><input type="checkbox" id="as_adoc" ${v('acc.anyDoctor')!==false?'checked':''}> Any doctor can edit any patient's records (off = only the assigned doctor)</label><label class="flex items-center gap-2 text-sm mb-2"><input type="checkbox" id="as_nrec" ${v('acc.nurseRec')!==false?'checked':''}> Nurses can add and edit clinical records (not prescriptions, consent or treatment plans)</label><label class="flex items-center gap-2 text-sm mb-2"><input type="checkbox" id="as_ninv" ${v('acc.nurseInv')!==false?'checked':''}> Nurses can create and edit invoices / add charges for work done (payments and refunds stay with reception, manager and doctor)</label>`)+
 sec('fa-money-bill-wave','Payroll rules','Income tax and pension used when monthly payroll is calculated.',
  asTa('brk','Income tax brackets (monthly gross)',asLines(v('pay.brackets').map(r=>[r[0]==null?'':r[0],r[1]])),'One per line: <b>up to amount | tax %</b>. Leave the amount empty on the last line (everything above). Example: 2000 | 0',7)+
  asIn('smin','Visiting specialist share: lowest % allowed',v('spec.min'),'The manager agrees a percent with each visiting specialist within this range.')+asIn('smax','Visiting specialist share: highest % allowed',v('spec.max'))+asIn('pen','Employee pension (% of basic salary)',v('pay.pen'))+asIn('emp','Employer pension (% of basic salary)',v('pay.emp')))+
 sec('fa-tooth','Doctor lab-fee types','Default prosthesis lab fees taken off before a doctor\'s percentage. A clinic can still edit its own list in Pay rules.',
  asTa('lab','Lab types',v('lab.def').map(r=>[r.k,r.w,r.fee].join(' | ')).join('\n'),'One per line: <b>name | keywords (comma separated) | fee per unit</b>',4))+
 sec('fa-hand-sparkles','Clinic routine','Sterilization tests and material warnings.',
  asTa('ster','Sterilization tests',asLines(v('ster.tests')),'One per line: <b>test name | repeat every N days</b>. Names of tests already recorded should not be changed.',4)+
  asIn('exp','Warn about materials expiring within (days)',v('exp.days')))+
 sec('fa-cloud-arrow-up','Backups','Weekly automatic backup of every clinic.',
  asIn('keep','Backups kept per clinic',v('backup.keep'),'Older ones are deleted automatically.')+asIn('bmin','Minimum days between automatic backups',v('backup.minDays')))+
 sec('fa-heart','Donation note','Shown to managers and administrators in Settings.',
  asTa('dtx','Note',v('donate.text'),'Plain text.',4)+asTa('dac','Accounts',asLines(v('donate.acc')),'One per line: <b>name | account number</b>',4))+
 `<div class="flex flex-wrap gap-2 mb-8"><button onclick="asSave()" class="px-5 py-2 rounded-md text-white font-semibold" style="background:var(--c)"><i class="fa fa-floppy-disk mr-1"></i>Save all</button><button onclick="asResetAll()" class="px-4 py-2 rounded-md bg-gray-200 text-sm">Restore original values</button></div>`}
const asN=(id,min,max,name)=>{const x=$('as_'+id).value.trim(),n=+x;if(x===''||!isFinite(n)||n<min||n>max)throw new Error(name+' must be a number from '+min+' to '+max+'.');return n};
const asRows=(id,cols)=>($('as_'+id).value||'').split('\n').map(l=>l.split('|').map(s=>s.trim())).filter(r=>r.some(Boolean));
async function asSave(){if(!U||U.role!='admin')return;
 try{const o={};
  o['signup.enabled']=$('as_signup').checked;o['signup.days']=asN('sdays',1,3650,'Free period');o['signup.perDay']=asN('sper',1,1000,'Sign-ups per day');
  o['acc.anyDoctor']=$('as_adoc').checked;o['acc.nurseRec']=$('as_nrec').checked;o['acc.nurseInv']=$('as_ninv').checked;o['pw.min']=asN('pw',6,64,'Password length');o['session.idleMin']=asN('idle',0,1440,'Idle minutes');
  const br=asRows('brk').map(r=>[r[0]===''||r[0]==null?null:+r[0],+r[1]]);if(!br.length||br.some((r,i)=>(r[0]!==null&&!isFinite(r[0]))||!isFinite(r[1])||r[1]<0||r[1]>100||(r[0]===null&&i<br.length-1)||(i&&r[0]!==null&&br[i-1][0]!==null&&r[0]<=br[i-1][0])))throw new Error('Tax brackets: use "amount | percent", amounts increasing, only the last line may have no amount.');
  o['pay.brackets']=br;o['spec.min']=asN('smin',0,100,'Specialist lowest %');o['spec.max']=asN('smax',0,100,'Specialist highest %');if(o['spec.min']>o['spec.max'])throw new Error('Specialist lowest % cannot be above the highest.');o['pay.pen']=asN('pen',0,50,'Employee pension');o['pay.emp']=asN('emp',0,50,'Employer pension');
  const lab=asRows('lab').map(r=>({k:r[0],w:r[1]||'',fee:+r[2]}));if(!lab.length||lab.some(r=>!r.k||!isFinite(r.fee)||r.fee<0))throw new Error('Lab types: use "name | keywords | fee".');o['lab.def']=lab;
  const stt=asRows('ster').map(r=>[r[0],Math.round(+r[1])]);if(!stt.length||stt.some(r=>!r[0]||!(r[1]>=1)))throw new Error('Sterilization tests: use "name | days" (1 or more).');o['ster.tests']=stt;
  o['exp.days']=asN('exp',0,3650,'Expiry warning');o['backup.keep']=asN('keep',1,100,'Backups kept');o['backup.minDays']=asN('bmin',0,60,'Backup interval');
  o['donate.text']=$('as_dtx').value.trim();const ac=asRows('dac').filter(r=>r[0]&&r[1]).map(r=>[r[0],r[1]]);o['donate.acc']=ac;
  for(const k of Object.keys(o)){if(JSON.stringify(o[k])!==JSON.stringify(AS.D[k])||AS.custom(k))await AS.save(k,o[k])}
  asApply();toast('Settings saved');go('sys')}catch(e){alert(e.message||'Could not save.')}}
async function asResetAll(){if(!U||U.role!='admin'||!confirm('Restore every system setting to its original value?'))return;try{for(const k of Object.keys(AS.D))if(AS.custom(k))await AS.reset(k);asApply();toast('Restored');go('sys')}catch(e){alert(e.message||'Failed.')}}
