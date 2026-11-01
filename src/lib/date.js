/* Ethiopian calendar: conversion, display mode (EC / GC / both) and date entry fields. */
const EC_M=['መስከረም','ጥቅምት','ኅዳር','ታኅሣሥ','ጥር','የካቲት','መጋቢት','ሚያዝያ','ግንቦት','ሰኔ','ሐምሌ','ነሐሴ','ጳጉሜ'];
const EC_L=['Meskerem','Tikimt','Hidar','Tahsas','Tir','Yekatit','Megabit','Miazia','Ginbot','Sene','Hamle','Nehase','Pagume'];
const EC_OFF=1723856;
const gJDN=d=>Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)+2440588;
function toEC(d){const j=gJDN(d),r=(j-EC_OFF)%1461,n=r%365+365*Math.floor(r/1460);return {y:4*Math.floor((j-EC_OFF)/1461)+Math.floor(r/365)-Math.floor(r/1460),m:Math.floor(n/30)+1,d:n%30+1}}
function fromEC(y,m,d){const j=EC_OFF+365+365*(y-1)+Math.floor(y/4)+30*m+d-31,u=(j-2440588)*864e5,x=new Date(u);return new Date(x.getUTCFullYear(),x.getUTCMonth(),x.getUTCDate())}
const ecLeap=y=>y%4==3,ecDays=(y,m)=>m<13?30:(ecLeap(y)?6:5);
const pad2=n=>String(n).padStart(2,'0');
const isoD=t=>{const d=new Date(t);return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate())};
const ISO_RE=/^\d{4}-\d{2}-\d{2}$/;
function toDate(t){if(t==null||t==='')return null;if(t instanceof Date)return isNaN(t)?null:t;if(typeof t=='number')return new Date(t);const s=String(t);if(ISO_RE.test(s))return new Date(+s.slice(0,4),+s.slice(5,7)-1,+s.slice(8,10));const v=Date.parse(s);return isNaN(v)?null:new Date(v)}
const toISO=t=>{const d=toDate(t);return d?isoD(d):''};
const CAL_KEY='dental_calendar';
let CALM_=(()=>{try{const v=localStorage.getItem(CAL_KEY);return ['ec','gc','both'].includes(v)?v:'ec'}catch(e){return 'ec'}})();
const CALM=()=>CALM_;
const gcStr=d=>d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
const ecStr=d=>{const e=toEC(d);return EC_M[e.m-1]+' '+e.d+', '+e.y};
function fdate(t,mode){const d=toDate(t);if(!d)return (t==null||t==='')?'-':String(t);mode=mode||CALM_;return mode=='gc'?gcStr(d):mode=='ec'?ecStr(d):ecStr(d)+' ('+gcStr(d)+')'}
function fshort(t){const d=toDate(t);if(!d)return '';if(CALM_=='gc')return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'});const e=toEC(d);return EC_M[e.m-1]+' '+e.d}
const dsp=x=>ISO_RE.test(x.date||'')?fdate(x.date):fdate(x.ts||x.date);
const calLabel=()=>CALM_=='ec'?'EC':CALM_=='gc'?'GC':'EC + GC';
function cycleCal(){CALM_=CALM_=='ec'?'gc':CALM_=='gc'?'both':'ec';try{localStorage.setItem(CAL_KEY,CALM_)}catch(e){}calBtn();if(typeof go=='function'&&typeof U!='undefined'&&U&&document.getElementById('md').classList.contains('hidden'))go(V)}
function calBtn(){const b=document.getElementById('calbtn');if(b)b.textContent='Calendar: '+calLabel()}

/* date entry: Ethiopian selects (EC mode) or a native date input (GC / both). The value is always an ISO yyyy-mm-dd string in #id. */
function dateField(id,val,cb){cb=cb||'';const iso=toISO(val),mode=CALM_;
 if(mode=='ec'){const base=iso?toDate(iso):new Date(),e=toEC(base),cy=toEC(new Date()).y,ys=[];for(let y=cy-100;y<=cy+5;y++)ys.push(y);
  const v=iso||isoD(base);
  return `<div class="grid grid-cols-3 gap-2 mb-3"><select id="${id}_d" onchange="ecSync('${id}');${cb}" class="inp" aria-label="Day">${Array.from({length:30},(_,i)=>`<option ${i+1==e.d?'selected':''}>${i+1}</option>`).join('')}</select><select id="${id}_m" onchange="ecSync('${id}');${cb}" class="inp" aria-label="Month">${EC_M.map((n,i)=>`<option value="${i+1}" ${i+1==e.m?'selected':''}>${n}</option>`).join('')}</select><select id="${id}_y" onchange="ecSync('${id}');${cb}" class="inp" aria-label="Year">${ys.map(y=>`<option ${y==e.y?'selected':''}>${y}</option>`).join('')}</select><input type="hidden" id="${id}" value="${v}"></div><div id="${id}_h" class="text-xs text-gray-500 -mt-2 mb-3">${gcStr(base)}</div>`}
 return `<input id="${id}" type="date" value="${iso}" onchange="ecHint('${id}');${cb}" class="inp mb-3">`+(mode=='both'?`<div id="${id}_h" class="text-xs text-gray-500 -mt-2 mb-3">${iso?ecStr(toDate(iso)):''}</div>`:'')}
function ecSync(id){const y=+document.getElementById(id+'_y').value,m=+document.getElementById(id+'_m').value;let d=+document.getElementById(id+'_d').value;const max=ecDays(y,m);if(d>max){d=max;document.getElementById(id+'_d').value=d}const g=fromEC(y,m,d);document.getElementById(id).value=isoD(g);const h=document.getElementById(id+'_h');if(h)h.textContent=gcStr(g)}
function ecHint(id){const h=document.getElementById(id+'_h'),v=document.getElementById(id).value;if(h)h.textContent=v?ecStr(toDate(v)):''}

/* payment platforms */
const PAYM=['Cash','Telebirr','CBE Birr','CBE (bank)','eBirr','Other bank','Card'];
