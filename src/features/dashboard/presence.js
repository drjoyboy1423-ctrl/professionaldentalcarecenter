/* ---------- Who is signed in: every user sends a heartbeat about once a minute; reception, manager and administrator see online / offline ----------
   Someone who is offline (no internet, app closed, signed out) simply stops sending and shows as offline after about 3 minutes. */
let PRES={c:'',m:{},t:0};
const PRES_MS=210000;
const presOn=n=>!!(PRES.m[n]&&Date.now()-PRES.m[n]<PRES_MS);
const presSees=()=>!!U&&['reception','manager','admin'].includes(U.role);
async function presBeat(){try{if(!U||!C||U.role=='admin'||navigator.onLine===false)return;await DB.presenceBeat({...U,clinic:C.id})}catch(e){}}
async function presPoll(){try{if(!presSees()||!C||navigator.onLine===false)return;const L=await DB.presenceList(C.id),m={};L.forEach(r=>{m[r.name]=Date.parse(r.last_seen)});PRES={c:C.id,m,t:Date.now()}}catch(e){}}
function presStart(){if(window.__presT)return;window.__presT=1;presBeat();presPoll().then(()=>{if(V=='dash')go('dash')});setInterval(async()=>{await presBeat();const before=JSON.stringify(Object.keys(PRES.m).filter(presOn));await presPoll();if(V=='dash'&&JSON.stringify(Object.keys(PRES.m).filter(presOn))!=before&&md.classList.contains('hidden'))go('dash')},60000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){presBeat();presPoll()}});addEventListener('online',()=>{presBeat();presPoll()})}
{const _b=boot;boot=function(){const r=_b.apply(this,arguments);setTimeout(presStart,1500);return r}}
/* signing out marks the person offline at once */
{const _lo=logout;logout=async function(){try{if(U&&C&&U.role!='admin'&&navigator.onLine!==false)await Promise.race([DB.presenceBeat({...U,clinic:C.id},true),new Promise(r=>setTimeout(r,1500))])}catch(e){}return _lo.apply(this,arguments)}}
