let S,U,V='dash',Q='',PID,SK='rec',MENU=0,TAB='all';
const ETB=n=>'ETB '+(+n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const now=Date.now(),ds=t=>fdate(t);
const K={s:'private_dental_selected_clinic',cc:'private_dental_currentClinic'};
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},lsDel=k=>{try{localStorage.removeItem(k)}catch(e){}};
const ICONS={tooth:'<path d="M50 14C38 8 22 16 24 36c1 12 6 20 8 34 1.5 11 5 18 9 18 5 0 4-16 9-16s4 16 9 16c4 0 7.5-7 9-18 2-14 7-22 8-34C78 16 62 8 50 14z"/>',cross:'<path d="M40 14h20v26h26v20H60v26H40V60H14V40h26z"/>',shield:'<path d="M50 10l34 12v26c0 20-14 36-34 42C30 84 16 68 16 48V22z"/>',heart:'<path d="M50 88C20 64 10 48 10 32 10 20 20 12 31 12c8 0 15 4 19 11 4-7 11-11 19-11 11 0 21 8 21 20 0 16-10 32-40 56z"/>',star:'<path d="M50 8l12 27 29 3-22 20 7 29-26-15-26 15 7-29L9 38l29-3z"/>',building:'<path d="M20 90V30l30-18 30 18v60H58V62H42v28z"/>',smile:'<path d="M50 12a38 38 0 100 76 38 38 0 000-76zm-16 30a6 6 0 1112 0 6 6 0 01-12 0zm32 0a6 6 0 1112 0 6 6 0 01-12 0zM30 58c4 12 15 20 20 20s16-8 20-20c-6 6-13 9-20 9s-14-3-20-9z"/>',gem:'<path d="M50 10L90 40 50 92 10 40z"/>',drop:'<path d="M50 10c18 26 30 42 30 58a30 30 0 01-60 0c0-16 12-32 30-58z"/>',bolt:'<path d="M55 8L25 55h23l-8 37 38-50H56l12-34z"/>',leaf:'<path d="M20 82C18 34 48 12 84 16c3 36-16 62-48 68-8 2-13 1-16-2zM24 78C40 62 54 48 68 30"/>'};
const logoH=(c,sz)=>`<div class="${sz} rounded-full flex items-center justify-center overflow-hidden shrink-0" style="background:${c.color}">${c.logo?`<img src="${c.logo}" class="w-full h-full object-cover">`:`<svg viewBox="0 0 100 100" class="w-3/5 h-3/5" fill="#fff">${ICONS[c.icon]||ICONS.tooth}</svg>`}</div>`;
const TYPE=t=>t=='government'?'Government Dental Clinic':'Private Dental Clinic Center';
let CL=[],CLA=[],C=null;
S={users:[],usersLoaded:0,patients:[],dis:[],proc:[]};
let SNAP=new Map(),SNAPL={dis:'',proc:'',fin:''},SQ=Promise.resolve(),SERR=0;
const stab=o=>JSON.stringify(o,(k,v)=>v&&typeof v=='object'&&!Array.isArray(v)?Object.keys(v).sort().reduce((a,x)=>(a[x]=v[x],a),{}):v);
const clName=id=>id=='all'?'All clinics':(CL.find(c=>c.id==id)||{name:'-'}).name;
/* Head office (administrator) identity: its own name, logo and colour, different from every clinic */
const HQ={id:'__hq',name:'Professional Dental Care Center',color:'#1e3a8a',icon:'tooth',logo:null,type:'hq'};
const isHQ=()=>!!U&&U.role=='admin';
function setTheme(c){if(isHQ())c=HQ;const r=document.documentElement.style;r.setProperty('--c',c.color);r.setProperty('--cd',`color-mix(in srgb,${c.color} 60%,black)`);r.setProperty('--cl',`color-mix(in srgb,${c.color} 10%,white)`)}
const migrate=(p,i)=>{p.card??=(p.cardNo&&p.cardNo!='N/A'?p.cardNo:i+1);p.doc??=p.doctor||'';p.doctor??=p.doc;p.date=typeof p.date=='number'?p.date:(Date.parse(p.date)||Date.now());p.arr??=p.date;p.st??='new';p.fin??=false;p.d??={}};
function applyData(d){S.patients=d.patients||[];S.patients.forEach(migrate);S.dis=d.dis||DIS.map((n,i)=>({id:i+1,name:n,date:'12/3/2025'}));S.proc=d.proc||PRO.map((x,i)=>({id:i+1,n:x[0],p:x[1]}));S.fin=d.fin||{sal:[],exp:[]};S.fin.sal=S.fin.sal||[];S.fin.exp=S.fin.exp||[];
 SNAP=new Map(S.patients.map(p=>[String(p.id),stab(p)]));SNAPL={dis:stab(S.dis),proc:stab(S.proc),fin:stab(S.fin)};ensureInvNos();if(S.patients.some(p=>SNAP.get(String(p.id))!==stab(p)))sv()}
async function loadClinic(id){C=CL.find(c=>c.id==id)||CL[0];applyData(await DB.loadClinicData(C.id,true));setTheme(C);document.title=isHQ()?HQ.name:C.name}
function toast(m,ok){let t=$('toast');if(!t){t=document.createElement('div');t.id='toast';t.setAttribute('role','status');t.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:80;max-width:92vw;padding:10px 16px;border-radius:10px;color:#fff;font-size:14px;box-shadow:0 4px 14px #0004';document.body.appendChild(t)}t.style.background=ok?'#15803d':'#b91c1c';t.textContent=m;t.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>t.style.display='none',ok?1800:6000)}
function sv(){SQ=SQ.then(syncNow).then(()=>{if(SERR){SERR=0;toast('Saved',1)}},e=>{SERR=1;toast('Could not save: '+(e.message||e)+'. Your changes will retry on the next save.')})}
async function syncNow(){if(!C||!U)return;const cid=C.id,cur=new Map(S.patients.map(p=>[String(p.id),stab(p)])),ins=[],upd=[],del=[];
 S.patients.forEach(p=>{const k=String(p.id),o=SNAP.get(k);if(o===undefined)ins.push(p);else if(o!==cur.get(k))upd.push(p)});SNAP.forEach((v,k)=>{if(!cur.has(k))del.push(k)});
 if(ins.length||upd.length||del.length){await DB.savePatients(cid,ins,upd,del);ins.concat(upd).forEach(p=>SNAP.set(String(p.id),cur.get(String(p.id))));del.forEach(k=>SNAP.delete(k))}
 for(const k of ['dis','proc','fin']){const j=stab(S[k]);if(j!==SNAPL[k]){await DB.saveList(cid,k,S[k]);SNAPL[k]=j}}}
let RF=0;
async function refresh(){if(RF||!C||!U)return;RF=1;try{await SQ;const cid=C.id,d=await DB.loadClinicData(cid);if(cid!=C.id)return;const mine_=new Map(S.patients.map(p=>[String(p.id),stab(p)]));
 let pending=mine_.size!=SNAP.size;mine_.forEach((v,k)=>{if(SNAP.get(k)!==v)pending=true});if(pending)return;
 const rem=new Map(d.patients.map(p=>[String(p.id),stab(p)]));let diff=rem.size!=SNAP.size||stab(d.dis||S.dis)!=SNAPL.dis||stab(d.proc||S.proc)!=SNAPL.proc||stab(d.fin||S.fin)!=SNAPL.fin;rem.forEach((v,k)=>{if(SNAP.get(k)!==v)diff=true});
 if(diff&&md.classList.contains('hidden')){applyData(d);if(V!='card')go(V)}}catch(e){}finally{RF=0}}
setInterval(()=>{if(U&&C&&!document.hidden&&md.classList.contains('hidden')&&V!='card')refresh()},45000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&U&&C&&md.classList.contains('hidden')&&V!='card')refresh()});
