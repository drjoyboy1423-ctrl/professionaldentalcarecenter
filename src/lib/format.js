/* ===== Reception & manager tools: printing, appointments, invoice manager, analytics, print center, sample data ===== */
const DAY=864e5,NOW=()=>Date.now();
const fd=t=>t?fdate(t):'-';
const ft=t=>new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
const sod=t=>{const d=new Date(t);d.setHours(0,0,0,0);return d.getTime()};
const ST={new:'New order',doctor:'Seen by doctor',nurse:'Seen by nurse'};
const sum=(a,f)=>a.reduce((z,x)=>z+(+f(x)||0),0);
function apptTs(x){const d=String(x.date||''),m=d.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(m){const t=String(x.time||'').match(/^(\d{1,2}):(\d{2})/);return new Date(+m[1],+m[2]-1,+m[3],t?+t[1]:0,t?+t[2]:0).getTime()}const v=Date.parse(d+' '+(x.time||''))||Date.parse(d);return isNaN(v)?NaN:v}
function allInv(P){const L=[];(P||S.patients).forEach(p=>(p.d.inv||[]).forEach((x,i)=>{const t=tot(x),paid=+x.paid||0,bal=Math.max(0,t-paid);L.push({p,x,i,no:invNo(p,x,i),t,paid,bal,st:bal<=.005?'Paid':paid>0?'Partial':'Pending',ts:tsOf(x,p)})}));return L.sort((a,b)=>b.ts-a.ts)}
function payEvents(r){const ev=(r.x.pays||[]).map((y,j)=>({ts:y.ts,amt:+y.amt||0,method:y.method||'Cash',ref:y.ref||'',by:y.by||'',rc:y.rcpt?1:0,rf:y.refund?1:0,why:y.reason||'',j})),rem=r.paid-sum(ev,y=>y.amt);if(rem>.005)ev.push({ts:r.ts,amt:rem,method:'Cash',ref:'',by:r.x.by||''});return ev}
function allAppts(){const L=[];S.patients.forEach(p=>(p.d.appt||[]).forEach((x,i)=>L.push({p,x,i,ts:apptTs(x)})));return L.sort((a,b)=>(isNaN(a.ts)?1e15:a.ts)-(isNaN(b.ts)?1e15:b.ts))}
function payLines(p,x,i){const evs=payEvents({x,paid:+x.paid||0,ts:tsOf(x,p)});return evs.length?`<div class="mt-2 text-xs text-gray-600"><b>Payments</b>${evs.map(y=>`<div>${H(fd(y.ts))} &middot; <b>${H(y.method)}</b>${y.ref?' &middot; Ref '+H(y.ref):''} &middot; ${y.rf?'<span class="text-red-600 font-semibold">REFUND</span> ':''}${ETB(y.amt)}${y.why?' &middot; '+H(y.why):''}${y.j!=null&&!y.rf?(y.rc?` <i class="fa fa-receipt text-green-600 cursor-pointer ml-2" title="View receipt" onclick="rcptView(${p.id},${i},${y.j})"></i>`:` <i class="fa fa-camera text-gray-400 cursor-pointer ml-2" title="Add receipt photo" onclick="rcptAdd(${p.id},${i},${y.j})"></i>`):''}</div>`).join('')}</div>`:''}
const stChip=s=>`<span class="px-2 py-0.5 rounded text-xs ${s=='Paid'?'bg-green-100 text-green-700':s=='Partial'?'bg-sky-100 text-sky-700':'bg-yellow-100 text-yellow-700'}">${s}</span>`;
const tile=(l,v,sub)=>`<div class="bg-white rounded-xl shadow p-4"><div class="text-xs text-gray-500">${l}</div><div class="text-xl font-bold mt-1 break-words">${v}</div>${sub?`<div class="text-xs text-gray-500 mt-1">${sub}</div>`:''}</div>`;

