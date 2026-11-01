/* ---------- Offline mode: keep working without internet; changes are saved on the device and uploaded automatically ---------- */
const IDB=(()=>{let db;const open=()=>db||(db=new Promise((ok,no)=>{try{const r=indexedDB.open('smartdent',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}}));
 const tx=(m,f)=>open().then(d=>new Promise((ok,no)=>{const t=d.transaction('kv',m),q=f(t.objectStore('kv'));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>no(t.error);t.onabort=()=>no(t.error)}));
 const safe=p=>p.catch(()=>undefined);
 return {get:k=>safe(tx('readonly',s=>s.get(k))),set:(k,v)=>safe(tx('readwrite',s=>s.put(v,k))),del:k=>safe(tx('readwrite',s=>s.delete(k))),clear:()=>safe(tx('readwrite',s=>s.clear()))}})();
const isNet=e=>(typeof navigator!='undefined'&&navigator.onLine===false)||/failed to fetch|networkerror|network error|load failed|network request|fetch failed|timeout/i.test(String((e&&e.message)||e||''));
let OFFL=0,OFFSV=0;
function offState(on,saved){OFFL=on?1:0;if(saved!==undefined)OFFSV=saved;let b=$('offb');if(!OFFL&&!OFFSV){if(b)b.style.display='none';return}
 if(!b){b=document.createElement('div');b.id='offb';b.setAttribute('role','status');b.style.cssText='position:fixed;left:0;right:0;top:0;z-index:70;padding:6px 12px;font-size:13px;text-align:center;color:#fff;background:#b45309';document.body.appendChild(b)}
 b.style.display='block';b.textContent=OFFL?'You are offline. You can keep working: changes are saved on this device and upload automatically when the internet is back.':'Uploading changes made offline...'}
/* cached copies so the app can open and show the last loaded data with no internet */
const _clin0=DB.clinics;DB.clinics=async function(){try{const r=await _clin0.apply(DB,arguments);IDB.set('clinics',r);return r}catch(e){if(isNet(e)){const c=await IDB.get('clinics');if(c&&c.length){offState(1);return c}}throw e}};
const _prof0=DB.profile;DB.profile=async function(){try{const p=await _prof0.apply(DB,arguments);if(p)IDB.set('profile',p);return p}catch(e){if(isNet(e)){const c=await IDB.get('profile'),t=await DB.token().catch(()=>null);if(c&&t){offState(1);return c}}throw e}};
const _load0=DB.loadClinicData;DB.loadClinicData=async function(cid,startup){try{const d=await _load0.apply(DB,arguments);if(startup)IDB.set('cache:'+cid,{...d,fin:undefined});return d}catch(e){if(startup&&isNet(e)){const c=await IDB.get('cache:'+cid);if(c){offState(1);return c}}throw e}};
/* sync: when the internet is down the working copy is kept on the device ("dirty") and retried */
let OFFCT=0;
const offCache=()=>{clearTimeout(OFFCT);OFFCT=setTimeout(()=>{if(C&&S)IDB.set('cache:'+C.id,{patients:S.patients,dis:S.dis,proc:S.proc,fin:S.fin})},3000)};
const _sync0=syncNow;syncNow=async function(){const cid=C&&C.id;try{await _sync0();if(cid){OFFSV=0;offState(OFFL&&!navigator.onLine?1:0);IDB.del('dirty:'+cid);offCache()}}
 catch(e){if(cid&&isNet(e)){await IDB.set('dirty:'+cid,{patients:S.patients,dis:S.dis,proc:S.proc,fin:S.fin,ts:Date.now()});offState(1,1);return}throw e}};
/* changes made while offline and still not uploaded are restored after a reload, then uploaded */
const _lc0=loadClinic;loadClinic=async function(id){await _lc0.apply(this,arguments);const d=C&&await IDB.get('dirty:'+C.id);
 if(d&&d.patients){S.patients=d.patients;S.patients.forEach(migrate);if(d.dis)S.dis=d.dis;if(d.proc)S.proc=d.proc;if(d.fin)S.fin=d.fin;offState(!navigator.onLine,1);sv()}};
addEventListener('offline',()=>offState(1));
addEventListener('online',()=>{offState(0,OFFSV);if(U&&C){sv();setTimeout(()=>{if(typeof refresh=='function')refresh()},4000)}});
addEventListener('load',()=>{if(navigator.onLine===false)offState(1)});
/* logging out wipes the saved copies from this device; warn first if something is not uploaded yet */
async function offLogoutOk(){const d=C&&await IDB.get('dirty:'+C.id);if(d)return confirm('Some changes made offline have NOT been uploaded yet. Logging out now will delete them. Log out anyway?');return true}
async function offWipe(){await IDB.clear()}
