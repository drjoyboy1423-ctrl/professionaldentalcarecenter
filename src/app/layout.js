const login_=$('login');
function tgl(){const s=$('sb');if(innerWidth>=1024){s.classList.toggle('lg:hidden');return}s.classList.toggle('-translate-x-full');$('ov').classList.toggle('hidden',s.classList.contains('-translate-x-full'))}
function go(v,id){if(v!='patient'&&!(RN[U.role]||RN.reception).includes(v))v='dash';V=v;if(id){PID=id;SK='rec';MENU=0}
 $('nav').innerHTML=NAV.filter(n=>(RN[U.role]||RN.reception).includes(n[0])).map(n=>`<div class="nv ${V==n[0]?'on':''}" onclick="go('${n[0]}')"><i class="fa ${n[2]} w-5"></i>${n[1]}</div>`).join('');
 if(innerWidth<1024){$('sb').classList.add('-translate-x-full');$('ov').classList.add('hidden')}
 const f={dash,appt,recent,card:cardv,ran:analytics,rinv:invMgr,rpr:printCenter,fin:finance,lab,proc,users,clinics,cash:cashClose,activity:activityPage,crep:clinicsReport,dis,profile,settings:settingsPage,patient}[v];$('v').innerHTML=f();}
const card=(h,b)=>`<div class="bg-white rounded-xl shadow p-4 md:p-6 mb-4">${h}${b}</div>`;
const hd=(t,btn)=>`<div class="flex justify-between items-center mb-4 gap-2"><h2 class="text-2xl font-bold">${t}</h2>${btn||''}</div>`;
const gb=(l,a)=>`<button onclick="${a}" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm">${l}</button>`;
const bb=(l,a)=>`<button onclick="${a}" class="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium">${l}</button>`;
const cap=s=>s?s[0].toUpperCase()+s.slice(1):'';
const canAdd=()=>!!U&&(U.role=='reception'||U.role=='manager'),canDel=()=>!!U&&(U.role=='admin'||U.role=='manager'||U.role=='reception');
const RN={admin:['dash','appt','recent','ran','rinv','cash','activity','rpr','fin','lab','proc','users','clinics','crep','dis','profile','settings'],manager:['dash','appt','recent','card','ran','rinv','cash','activity','rpr','fin','lab','proc','users','dis','profile','settings'],doctor:['dash','appt','recent','lab','proc','dis','profile','settings'],nurse:['dash','appt','recent','lab','profile','settings'],reception:['dash','appt','recent','card','ran','rinv','cash','rpr','profile','settings']},RA=['appt','prof','inv','cred'];
const ROLEF={admin:'ADMINISTRATION',manager:'MANAGEMENT',doctor:'DENTISTRY',nurse:'NURSING',reception:'RECEPTION'};
const TOOTH=c=>`<svg viewBox="0 0 100 100" class="${c}" fill="#fff"><path d="M50 14C38 8 22 16 24 36c1 12 6 20 8 34 1.5 11 5 18 9 18 5 0 4-16 9-16s4 16 9 16c4 0 7.5-7 9-18 2-14 7-22 8-34C78 16 62 8 50 14z"/><path fill="#ff2a2a" d="M76 6l2.5 6 6 2.5-6 2.5L76 23l-2.5-6-6-2.5 6-2.5z"/></svg>`;
const ago=t=>{const m=Math.max(0,Math.round((Date.now()-t)/6e4));return Math.floor(m/60)+'h '+m%60+'m ago'};
