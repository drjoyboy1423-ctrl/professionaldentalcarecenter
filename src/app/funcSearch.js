/* Search box also finds app functions (e.g. type "refund" to see where to refund). */
const FN=[
 {t:'Place an order (X-ray, lab, prescription)',h:'Doctor: Dashboard > Place Order on a patient',k:'order place xray x-ray lab prescription prosthodontic crown cbct opg',v:'dash',ic:'fa-file-circle-plus',r:['doctor','manager','admin']},
 {t:'Orders inbox',h:'See doctor orders and mark them Completed',k:'orders inbox completed pending doctor order',v:'ord',ic:'fa-inbox',r:['reception','manager','admin']},
 {t:'Dental materials / stock',h:'Stock levels, Order Now, Use 1',k:'materials stock inventory supplies purchase order composite alginate',v:'mat',ic:'fa-boxes-stacked',r:['reception','manager','admin']},
 {t:'Reports dashboard',h:'KPIs, monthly and yearly registrations, print official report',k:'report dashboard kpi registrations print csv official',v:'rep',ic:'fa-chart-pie',r:['manager','admin']},
 {t:'Assign a doctor to a patient',h:'Dashboard > Assign Doctor',k:'assign doctor patient',v:'dash',ic:'fa-user-doctor',r:['reception','manager','admin']},
 {t:'Refund a payment',h:'Open the patient > Invoices, then tap the red arrow icon on the invoice',k:'refund return money back reimburse',v:'rinv',ic:'fa-rotate-left',r:['manager','admin']},
 {t:'Take a payment',h:'Open an invoice and tap the green money icon',k:'payment pay receive cash telebirr cbe collect',v:'rinv',ic:'fa-money-bill',r:['manager','reception','admin']},
 {t:'Daily cash close',h:'Cash received by day, method and staff, with refunds',k:'cash close drawer daily cashup cash-up count',v:'cash',ic:'fa-cash-register'},
 {t:'Invoices',h:'All invoices, balances and print',k:'invoice bill balance unpaid remaining credit paid',v:'rinv',ic:'fa-file-invoice-dollar'},
 {t:'New patient',h:'Register a new patient card',k:'new patient register card add',v:'card',ic:'fa-id-card'},
 {t:'Appointments',h:'Book and view appointments',k:'appointment booking schedule calendar visit',v:'appt',ic:'fa-calendar-check'},
 {t:'Laboratory results',h:'Lab requests and finished results',k:'lab laboratory result crown request finished',v:'lab',ic:'fa-flask'},
 {t:'Dental chart and tooth photos',h:'Open a patient > Dental Record > view Dental chart. Tap a tooth for Before / After photos',k:'tooth chart photo before after teeth picture fdi',v:'recent',ic:'fa-tooth'},
 {t:'Analytics and revenue',h:'Trends, billed and collected money',k:'analytics revenue report income trend chart',v:'ran',ic:'fa-chart-line'},
 {t:'Print center and reports',h:'Reports, cards, certificates',k:'print report pdf csv certificate card export',v:'rpr',ic:'fa-print'},
 {t:'Finance and expenses',h:'Expenses, yearly report',k:'finance expense expenses yearly',v:'fin',ic:'fa-sack-dollar'},
 {t:'Procedures and prices',h:'Treatment list and prices',k:'procedure price prices treatment tariff',v:'proc',ic:'fa-tooth'},
 {t:'Users and staff',h:'Add staff, reset passwords',k:'user users staff password reset account doctor nurse reception',v:'users',ic:'fa-users'},
 {t:'Clinics, backup and restore',h:'Create, archive, delete clinics and download backups',k:'clinic clinics backup restore archive delete download',v:'clinics',ic:'fa-hospital'},
 {t:'Activity log',h:'Who changed what and when',k:'activity log audit history changes who',v:'activity',ic:'fa-clock-rotate-left'},
 {t:'Dark mode, calendar, install app',h:'Settings page',k:'dark mode black theme calendar ethiopian gregorian install app settings',v:'settings',ic:'fa-gear'},
 {t:'Two-step sign-in',h:'Settings > Two-step sign-in (Google Authenticator)',k:'two step 2fa authenticator google code security',v:'settings',ic:'fa-shield-halved',r:['admin']},
 {t:'Back up all clinics now',h:'Settings > Backups',k:'backup now save all clinics',v:'settings',ic:'fa-cloud-arrow-up',r:['admin']},
 {t:'Notifications',h:'New patients and finished lab results for you',k:'notification notifications bell alert new patient lab ready',f:'nfOpen()',ic:'fa-bell'},
 {t:'My profile',h:'Your account and photo',k:'profile account photo name email',v:'profile',ic:'fa-user'}];
function fnFind(q){q=(q||'').toLowerCase().trim();if(q.length<2)return[];const w=q.split(/\s+/),ok=RN[U.role]||RN.reception;
 return FN.filter(f=>(!f.r||f.r.includes(U.role))&&(!f.v||f.v=='recent'||ok.includes(f.v))).map(f=>{const s=(f.t+' '+f.k).toLowerCase();let n=0;w.forEach(x=>{if(s.includes(x))n++});return{f,n,all:n==w.length,t:f.t.toLowerCase().includes(q)}}).filter(x=>x.all).sort((a,b)=>b.t-a.t).slice(0,5).map(x=>x.f)}
function fnBox(){let b=$('fnbox');if(!b){const i=$('q');if(!i)return null;b=document.createElement('div');b.id='fnbox';b.style.cssText='position:absolute;left:0;top:100%;margin-top:4px;min-width:min(300px,calc(100vw - 32px));z-index:60;display:none';b.className='bg-white rounded-lg shadow-xl border text-left overflow-hidden';i.parentElement.appendChild(b)}return b}
function fnShow(){const b=fnBox();if(!b||!U)return;const r=fnFind($('q').value);if(!r.length){b.style.display='none';return}
 b.innerHTML='<div class="px-3 pt-2 text-[11px] text-gray-500">Functions</div>'+r.map(f=>`<div class="px-3 py-2 cursor-pointer border-t hover:bg-gray-50" onmousedown="event.preventDefault()" onclick="fnGo(${FN.indexOf(f)})"><div class="text-sm font-semibold"><i class="fa ${f.ic} w-5 text-gray-500"></i>${H(f.t)}</div><div class="text-xs text-gray-500 ml-5">${H(f.h)}</div></div>`).join('');b.style.display='block'}
function fnGo(i){const f=FN[i],b=$('fnbox');if(b)b.style.display='none';$('q').value='';Q='';if(f.f)return eval(f.f);go(f.v);if(f.v=='recent'||f.h)toast(f.h)}
document.addEventListener('input',e=>{if(e.target&&e.target.id=='q')fnShow()});
document.addEventListener('focusout',e=>{if(e.target&&e.target.id=='q'){const b=$('fnbox');if(b)setTimeout(()=>b.style.display='none',150)}});
