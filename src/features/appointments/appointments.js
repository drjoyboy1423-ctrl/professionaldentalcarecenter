/* ---------- appointments ---------- */
let AF='upcoming';
function appt(){const t0=sod(NOW()),A=allAppts().map(a=>({...a,day:isNaN(a.ts)?NaN:sod(a.ts)}));
 const F={today:a=>a.day==t0,upcoming:a=>!(a.day<t0),past:a=>a.day<t0,all:()=>true},L=A.filter(F[AF]);
 const tabs=[['today',"Today ("+A.filter(F.today).length+')'],['upcoming','Upcoming ('+A.filter(F.upcoming).length+')'],['past','Past ('+A.filter(F.past).length+')'],['all','All ('+A.length+')']];
 const badge=a=>a.day==t0?'<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700">Today</span>':a.day>t0?'<span class="px-2 py-0.5 rounded text-xs bg-sky-100 text-sky-700">Upcoming</span>':'<span class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">Past</span>';
 return hd('Appointments',canDel()?gb('New Appointment +','newAppt()'):'')+`<div class="bg-white rounded-lg p-3 mb-4 flex flex-wrap gap-2">${tabs.map(t=>`<button onclick="AF='${t[0]}';go('appt')" class="px-3 py-2 rounded-md text-sm border ${AF==t[0]?'bg-red-100 border-red-400 text-red-700':'bg-gray-100'}">${t[1]}</button>`).join('')}</div>`+
 card('',L.length?`<div class="overflow-x-auto"><table class="w-full text-sm"><tr class="text-left border-b"><th class="p-2">Date</th><th>Time</th><th>Patient</th><th>Note</th><th></th><th></th></tr>${L.map(a=>`<tr class="border-b"><td class="p-2 whitespace-nowrap">${isNaN(a.ts)?H(a.x.date):fd(a.ts)}</td><td>${H(a.x.time||'')}</td><td><b class="cursor-pointer hover:underline" onclick="go('patient','${a.p.id}')">${H(a.p.name)}</b><div class="text-xs text-gray-500">${H(a.p.phone)}</div></td><td>${H(a.x.note)}</td><td>${isNaN(a.ts)?'':badge(a)}</td><td class="text-right pr-2">${canDel()?`<i class="fa fa-trash text-rose-600 cursor-pointer" onclick="delAppt('${a.p.id}',${a.i})"></i>`:''}</td></tr>`).join('')}</table></div>`:'<p class="text-gray-500">No appointments in this view.</p>')}
function delAppt(pid,i){if(!canDel())return;const p=S.patients.find(q=>q.id==pid);if(p&&confirm('Delete this appointment?')){p.d.appt.splice(i,1);sv();go('appt')}}
const plabel=p=>p.card+' - '+p.name;
function newAppt(){if(!S.patients.length)return alert('Register a patient first.');
 form('New Appointment',[['pt','Patient','sel',S.patients.map(plabel)],['date','Date','date'],['time','Time','time'],['note','Note']],{date:isoD(NOW()),time:'09:00'},v=>{const p=S.patients.find(q=>plabel(q)==v.pt);if(!p)return bad('Choose a patient.');if(!v.date)return bad('Choose a date.');mkItem('appt',{date:v.date,time:v.time,note:v.note},p);sv();AF='upcoming';go('appt')})}

