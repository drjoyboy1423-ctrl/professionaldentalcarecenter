/* ---------- dashboard quick actions ---------- */
function quick(){if(!canAdd()&&U.role!='admin')return '';const t0=sod(NOW()),n=allAppts().filter(a=>sod(a.ts)==t0).length,due=sum(allInv(),r=>r.bal);
 const q=(i,l,a,sub)=>`<button onclick="${a}" class="bg-white rounded-xl shadow p-3 text-left hover:shadow-md"><i class="fa ${i} text-red-600"></i><div class="font-medium text-sm mt-1">${l}</div><div class="text-xs text-gray-500">${sub||'&nbsp;'}</div></button>`;
 return `<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">${canAdd()?q('fa-user-plus','Register patient',"go('card')",'New card'):''}${q('fa-file-invoice-dollar','New invoice','newInvG()',ETB(due)+' due')}${q('fa-calendar-check',"Today's appointments","AF='today';go('appt')",n+' booked')}${q('fa-chart-line','Analytics',"go('ran')",'Trends & revenue')}${q('fa-print','Print center',"go('rpr')",'Reports & cards')}</div>`}

