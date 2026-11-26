/* Page subtitles: a calm one-line explanation under each page title, and the current page name in the top bar. Additive only: nothing is removed. */
const PSUB={
 'Appointments':'Chair scheduling and patient arrival flow',
 'Recent Patients':'Find a patient by name, card number or phone, or scan the card barcode',
 'All Patients (Directory)':'Every registered patient record in this clinic',
 'Dental Records':'Charts, treatment plans and clinical notes',
 'Finished / Inactive Patients':'Completed and inactive cases',
 'Installments':'Payment plans and balances that are still open',
 'Ortho Follow-up &amp; Balances':'Braces adjustment cadence, package balances and overdue alerts',
 'Orders Inbox':'Radiology imaging, prosthetic lab cases and specialist referrals',
 'Lab orders':'Prosthetic lab cases sent out and received back',
 'Finance':'Payment channel reconciliation, clinic expenses and monthly profit and loss',
 'Daily Cash Close':'Count and close the cash for the day',
 'Reports Dashboard':'Clinic activity and income at a glance',
 'Doctor Earnings':'What each doctor has earned from collected payments',
 'Payroll':'Staff pay, deductions and payment status',
 'User Management':'Staff accounts, roles and access',
 'Clinics':'Branches and their settings',
 'Follow-ups':'Patients who are due to come back',
 'Dental Materials':'Stock of materials and consumables',
 'Settings':'Language, colours, menu and clinic preferences',
 'Queue &amp; screen':'Waiting list and the waiting-room screen',
 'Staff chat':'Messages between staff'
};
const PSUB_S=(t)=>{const s=PSUB[t]||PSUB[String(t).replace(/&/g,'&amp;')];return s?`<p class="pgsub">${s}</p>`:''};
function pageSubDash(){try{const d=new Date(),n=(S.patients||[]).length,e=typeof ecStr=='function'?ecStr(d)+' EC  |  ':'';
 return `<p class="pgsub" id="dsub" style="margin:-8px 0 12px">${e}${d.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'short',day:'numeric'})}  |  Manage patient orders and chair assignments</p>`}catch(x){return ''}}
function pageNameBar(){try{const q=$('q');if(!q)return;let b=$('pgname');if(!b){const w=q.parentElement;if(!w||!w.parentElement)return;w.insertAdjacentHTML('afterend','<div id="pgname" class="hidden md:flex items-center gap-2 font-bold text-sm" style="white-space:nowrap"></div>');b=$('pgname')}
 const n=(typeof navAll=='function'?navAll():NAV).find(x=>x[0]==V);b.innerHTML=n?`<i class="fa ${n[2]}" style="color:var(--c)"></i><span>${H(n[1])}</span>`:''}catch(x){}}
const _goSub=go;go=function(){const r=_goSub.apply(this,arguments);try{if(V!='dash'){const o=$('dsub');if(o)o.remove()}if(V=='dash'&&$('v')&&!$('dsub')){const h=$('v').querySelector('h2');if(h)h.parentElement.insertAdjacentHTML('afterend',pageSubDash());else $('v').insertAdjacentHTML('afterbegin',pageSubDash())}}catch(e){}return r};
