/* patient */
const gp=()=>S.patients.find(p=>p.id==PID);
function patient(){const p=gp();if(!p)return recent();const rc=U.role=='reception';if(rc&&!RA.includes(SK))SK='appt';
 const bi=[['Card No',p.card],['Sex',p.sex],['Date of Birth',p.dob?fdate(p.dob):''],['Phone',p.phone]].map(x=>`<div class="mb-2"><b class="text-sm">${x[0]}</b><div>${H(x[1])}</div></div>`).join('');
 return `<div class="flex flex-col md:flex-row gap-5 items-start"><div class="bg-white rounded-lg shadow p-4 w-full md:w-64 text-center shrink-0 relative">
 <label class="block w-20 h-20 mx-auto mb-2 rounded-full bg-red-100 border-2 border-red-300 overflow-hidden cursor-pointer">${p.photo?`<img src="${p.photo}" class="w-full h-full object-cover">`:`<div class="h-full flex flex-col items-center justify-center text-red-500 text-[10px]"><i class="fa fa-camera text-lg"></i>Photo</div>`}<input type="file" accept="image/*" class="hidden" onchange="upPh(event)"></label>${photoBtns('upPh')}<h3 class="font-bold text-lg leading-tight">${H(p.name)}</h3><div class="text-gray-600 text-sm my-1">${telA(p.phone)}<br>${p.age} yrs<br>Branch: ${H(p.branch)}</div>
 <div class="bg-red-100 border border-red-300 rounded text-red-800 text-xs p-2 my-2"><b>Last Doctor:</b><br>${H(p.doc)}</div><div class="text-sm text-gray-600 mb-3">${fdate(p.date)}</div>
 <div class="text-left bg-white shadow-inner rounded p-3 h-32 overflow-auto mb-3"><b>Basic Information</b>${bi}</div>
 <div class="text-sm font-bold mb-3">Finished: <button onclick="fin()" class="ml-2 text-white text-sm px-4 py-1 rounded-full ${p.fin?'bg-green-500':'bg-red-500'}">${p.fin?'On':'Off'}</button></div>
 <button onclick="pcard()" class="w-full border border-red-300 text-red-600 rounded-md py-2 text-sm mb-2"><i class="fa fa-id-card mr-1"></i>Patient Card</button><button onclick="clinicalSummaryPrint()" class="w-full border border-red-300 text-red-600 rounded-md py-2 text-sm mb-2"><i class="fa fa-print mr-1"></i>Clinical summary (print)</button>${rc?'':`<button onclick="MENU=!MENU;go('patient')" class="w-full bg-gray-500 text-white rounded-md py-3 text-sm mb-2">Dental records <i class="fa fa-chevron-down ml-1"></i></button>`}
 ${MENU&&!rc?`<div class="bg-white shadow-xl rounded-lg p-2 mb-2 text-left">${DR.map(d=>`<div onclick="SK='${d[0]}';MENU=0;go('patient')" class="sb mb-2 cursor-pointer">${d[1]}</div>`).join('')}</div>`:''}
 <div class="space-y-3">${SIDE.filter(s=>!rc||RA.includes(s[0])).map(s=>`<button class="sb ${SK==s[0]?'on':''}" onclick="SK='${s[0]}';go('patient')">${s[1]}</button>`).join('')}</div></div>
 <div class="bg-white rounded-lg shadow p-5 flex-1 w-full min-h-[420px]">${sec(p)}</div></div>`}
function fin(){const p=gp();p.fin=!p.fin;sv();go('patient')}
