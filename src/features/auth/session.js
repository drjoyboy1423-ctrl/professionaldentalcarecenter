function setCur(){if(C){lsSet(K.cc,C.id);try{sessionStorage.setItem(K.cc,C.id)}catch(e){}}}
function hdr(){calBtn();un.textContent=U.name;av.innerHTML=U.avatar?`<img class="w-full h-full object-cover" src="${U.avatar}">`:'';
 if(isHQ()){const o=$('clsw');if(o&&o.parentElement&&o.parentElement.id!='clh')o.parentElement.remove();$('clh').innerHTML=logoH(HQ,'w-12 h-12')+`<div class="min-w-0"><div class="font-bold text-sm leading-tight break-words" style="color:var(--cd)">${H(HQ.name)}</div><div class="text-[11px] text-gray-500">Welcome, ${H(U.name)}</div></div>`;
  $('clh').insertAdjacentHTML('afterend',CL.length>1?`<div class="mt-3 text-left"><div class="text-[11px] text-gray-500 mb-0.5">Viewing clinic</div><select id="clsw" onchange="swCh(this.value)" class="w-full text-sm bg-white border rounded px-2 py-1.5" aria-label="View clinic data">${CL.map(c=>`<option value="${H(c.id)}" ${c.id==C.id?'selected':''}>${H(c.name)}</option>`).join('')}</select></div>`:'');return}
 $('clh').innerHTML=logoH(C,'w-12 h-12')+`<div class="min-w-0"><div class="font-bold text-sm leading-tight break-words">${H(C.name)}</div><div class="text-[11px] text-gray-500">${TYPE(C.type)}</div></div>`}
const KC='dental_clinic_code';
async function clRefresh(){CL=await DB.clinics();CLA=CL.filter(c=>c.archived);CL=CL.filter(c=>!c.archived)}
/* the clinic list is private: people type a clinic code; the server returns only that one clinic */
async function lcResolve(){const raw=(($('lcode')||{}).value||'').trim();if(!raw){lc.innerHTML='';selC();throw new Error('Enter your clinic code.')}const k=raw.toLowerCase();
 if(k=='admin'||k=='administrator'){lc.innerHTML=`<option value="__hq">${H(HQ.name)}</option>`;lc.value='__hq';selC();return}
 const c=await DB.clinicLookup(k);if(!c){lc.innerHTML='';selC();throw new Error('Clinic code not found. Please check it with your clinic.')}
 CL=[c];CLA=[];lc.innerHTML=`<option value="${H(c.id)}">${H(c.name)}</option>`;lc.value=c.id;selC();try{lsSet(KC,raw)}catch(e){}}
function lcInit(){lc.innerHTML='';selC();lcUser();let k='';try{k=lsGet(KC)||''}catch(e){}if(k&&$('lcode')){$('lcode').value=k;lcResolve().catch(()=>{})}const _n=$('lnc');if(_n)_n.style.display='none'}
function selC(){const hq=lc.value=='__hq',c=(hq||!lc.value)?HQ:(CL.find(x=>x.id==lc.value)||HQ);const r=document.documentElement.style,col=c.color;r.setProperty('--c',col);r.setProperty('--cd',`color-mix(in srgb,${col} 60%,black)`);r.setProperty('--cl',`color-mix(in srgb,${col} 10%,white)`);$('lb').innerHTML=logoH(c,'w-16 h-16 mx-auto');try{if($('lr')&&$('lr').checked)lsSet(K.s,lc.value)}catch(e){}lcChips();$('lwel').textContent=lc.value=='__hq'?'Welcome, Administrator! Sign in to manage all clinics.':'Welcome back! Please sign in to your account.'}
async function login(){le.classList.add('hidden');const b=$('lbtn');if(b.disabled)return;b.disabled=true;
 try{if(!lp.value.trim()||!lw.value)throw new Error('Enter your username and password.');await lcResolve();const sel=lc.value,u=await DB.signIn(lp.value,lw.value,sel),hq=sel=='__hq';await clRefresh();const cid=hq?(CL.some(c=>c.id==lsGet(K.cc))?lsGet(K.cc):(CL[0]||{}).id):sel;if(!hq&&u.role!='admin'&&u.clinic!=sel){await DB.signOut();throw new Error('Invalid username or password.')}if(hq&&u.role!='admin'){await DB.signOut();throw new Error('Only administrators can sign in here. Choose your clinic.')}if(u.role!='admin'&&u.clinic!=cid){await DB.signOut();throw new Error('This account does not belong to the selected clinic.')}
  if(lr.checked)lsSet(K.s,sel);else lsDel(K.s);if($('lru')&&$('lru').checked){lsSet(KU,lp.value.trim());lsSet(KU+'_on','1')}else{lsDel(KU);lsSet(KU+'_on','0')}U=u;await loadClinic(cid);setCur();boot()}catch(e){le.textContent=e.message||'Sign-in failed.';le.classList.remove('hidden')}finally{b.disabled=false}}
const RECOV=(location.hash.match(/[#&]recovery=([^&]+)/)||[])[1]||'';
function forgotPw(){form('Forgot password',[['un','Username']],{un:lp.value||''},async v=>{if(!v.un||!v.un.trim())throw new Error('Enter your username.');await lcResolve();const m=await DB.recoverRequest(v.un.trim(),lc.value);toast(m)},'Send reset link')}
function resetPwForm(){const t=decodeURIComponent(RECOV);try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}form('Set a new password',[['p1','New password (6+ characters)','password'],['p2','Repeat new password','password']],{},async v=>{if((v.p1||'').length<6)throw new Error('Password must be at least 6 characters.');if(v.p1!==v.p2)throw new Error('The two passwords do not match.');await DB.recoverApply(t,v.p1);toast('Password changed. Please sign in.')},'Save password')}
let LOUT=0;
async function logout(){if(LOUT)return;if(typeof offLogoutOk=='function'&&!(await offLogoutOk()))return;LOUT=1;const w=(p,ms)=>Promise.race([Promise.resolve(p).catch(()=>{}),new Promise(r=>setTimeout(r,ms))]);
 try{await w(SQ,2500);await w(DB.signOut(),2500)}catch(e){}
 try{if(typeof offWipe=='function')await offWipe()}catch(e){}
 try{lsDel(K.cc)}catch(e){}try{sessionStorage.removeItem(K.cc)}catch(e){}
 try{Object.keys(localStorage).filter(k=>k=='dental_auth'||/^sb-.*-auth-token/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}
 location.reload()}
function boot(){if(!U||!C)return;login_.classList.add('hidden');app.classList.remove('hidden');hdr();go('dash')}
async function start(){const ov=$('boot');try{await DB.init();CL=[];CLA=[];lcInit();const p=RECOV?null:await DB.profile();if(!p&&await DB.setupOpen()){setupShow();return}if(p){U=p;await clRefresh();let cid=sessionStorage.getItem(K.cc)||lsGet(K.cc)||'';if(!CL.some(c=>c.id==cid))cid=U.role=='admin'?(CL[0]||{}).id:U.clinic;await loadClinic(cid);boot()}}
 catch(e){ov.innerHTML=`<div class="text-center p-6"><p class="mb-3">${H(e.message||'Could not start the app.')}</p><button onclick="location.reload()" class="lg text-white font-semibold px-5 py-2 rounded-xl">Try again</button></div>`;return}
 ov.style.display='none';if(RECOV)resetPwForm()}

/* Sign-in page: tap a clinic to choose it; the clinic and username are remembered on this device */
const KU='private_dental_username';
function lcChips(){const b=$('lchips');if(!b)return;const all=[HQ,...CL];b.innerHTML=all.length<3?'':all.map(c=>{const id=c.id,on=lc.value==id;return `<button type="button" onclick="lcPick('${H(id)}')" class="flex items-center gap-2 rounded-full border px-3 py-1 text-xs" style="${on?'background:'+H(c.color)+';color:#fff;border-color:'+H(c.color):'color:'+H(c.color)+';border-color:'+H(c.color)+'55'}">${logoH(c,'w-5 h-5')}<span class="truncate" style="max-width:9rem">${id=='__hq'?'Administrator':H(c.name)}</span></button>`}).join('')}
function lcPick(id){lc.value=id;selC();try{lp.focus()}catch(e){}}
function lcUser(){try{const u=lsGet(KU);if(u&&lp&&!lp.value)lp.value=u;if($('lru'))$('lru').checked=!!u||lsGet(KU+'_on')!='0'}catch(e){}}
