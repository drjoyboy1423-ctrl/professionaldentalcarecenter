/* ---------- Receipt photos on payments: take a photo with the phone camera or choose one from the gallery ---------- */
function rcptField(id,val){const b=(ic,t,cap)=>`<label class="rc-b"><i class="fa ${ic}"></i> ${t}<input type="file" accept="image/*" ${cap?'capture="environment"':''} class="hidden" onchange="rcptPick(event,'${id}')"></label>`;
 return `<div class="mb-3"><div class="flex gap-2 flex-wrap">${b('fa-camera','Take photo',1)}${b('fa-image','Gallery',0)}</div><input type="hidden" id="${id}" value="${H(val||'')}"><div id="${id}_p" class="mt-2">${rcptPrev(id,val)}</div></div>`}
const rcptPrev=(id,v)=>v?`<div class="flex items-center gap-3"><img src="${v}" class="h-20 rounded border object-cover"><button type="button" class="text-sm text-rose-600" onclick="rcptClear('${id}')"><i class="fa fa-trash"></i> Remove</button></div>`:'';
function rcptPick(e,id){const f=e.target.files[0];e.target.value='';if(f)rs(f,1000,d=>{$(id).value=d;$(id+'_p').innerHTML=rcptPrev(id,d)})}
function rcptClear(id){$(id).value='';$(id+'_p').innerHTML=''}
function rcptView(pid,i,j){const p=S.patients.find(q=>q.id==pid),x=p&&p.d.inv&&p.d.inv[i],y=x&&x.pays&&x.pays[j];if(!y||!y.rcpt)return;
 $('mb').innerHTML=`<div class="flex items-center justify-between mb-2"><b>Receipt - ${H(y.method||'Cash')}${y.ref?' &middot; Ref '+H(y.ref):''}</b><span class="text-xs text-gray-500">${H(fd(y.ts))}</span></div><div class="bg-black rounded overflow-auto" style="max-height:62vh"><img src="${y.rcpt}" style="width:100%;display:block"></div>
 <div class="flex flex-wrap justify-between gap-2 mt-3"><button onclick="rcptDel(${pid},${i},${j})" class="px-3 py-2 rounded bg-gray-200 text-rose-600"><i class="fa fa-trash"></i> Remove</button><span><a download="receipt-${H(invNo(p,x,i))}.jpg" href="${y.rcpt}" class="px-4 py-2 rounded bg-red-600 text-white inline-block">Download</a> <button onclick="cl()" class="px-4 py-2 rounded bg-gray-200">Close</button></span></div>`;md.classList.replace('hidden','flex')}
function rcptDel(pid,i,j){if(!confirm('Remove this receipt photo?'))return;const p=S.patients.find(q=>q.id==pid),y=p.d.inv[i].pays[j];delete y.rcpt;sv();cl();go('patient')}
function rcptAdd(pid,i,j){const p=S.patients.find(q=>q.id==pid),x=p&&p.d.inv&&p.d.inv[i];if(!x)return;
 form('Receipt photo',[['receipt','Receipt photo - take a photo or choose from gallery','photo']],{},v=>{if(!v.receipt)return bad('Take or choose a photo first.');if(!x.pays||!x.pays[j]){const evs=payEvents({x,paid:+x.paid||0,ts:tsOf(x,p)});x.pays=evs.map(y=>({ts:y.ts,amt:y.amt,by:y.by,method:y.method,ref:y.ref}))}
  x.pays[j].rcpt=v.receipt;sv();go('patient')})}

/* ---------- Camera + Gallery buttons for every picture upload ---------- */
/* fn = global handler taking the change event (and optional extra args); front=1 uses the selfie camera */
const photoBtns=(fn,front,extra)=>`<div class="flex gap-2 justify-center flex-wrap my-2"><label class="rc-b"><i class="fa fa-camera"></i> Camera<input type="file" accept="image/*" capture="${front?'user':'environment'}" class="hidden" onchange="${fn}(event${extra||''})"></label><label class="rc-b"><i class="fa fa-image"></i> Gallery<input type="file" accept="image/*" class="hidden" onchange="${fn}(event${extra||''})"></label></div>`;
/* several pictures at once (X-rays): camera adds one, gallery adds many; thumbnails can be removed before saving */
const PHQ={};
function photosField(id){PHQ[id]=[];const b=(ic,t,cap)=>`<label class="rc-b"><i class="fa ${ic}"></i> ${t}<input type="file" accept="image/*" ${cap?'capture="environment"':'multiple'} class="hidden" onchange="phqPick(event,'${id}')"></label>`;
 return `<div class="mb-3"><div class="flex gap-2 flex-wrap">${b('fa-camera','Take photo',1)}${b('fa-images','Gallery',0)}</div><input type="hidden" id="${id}" value=""><div id="${id}_p" class="mt-2 flex flex-wrap gap-2"></div></div>`}
const phqShow=id=>{const e=$(id+'_p');if(e)e.innerHTML=PHQ[id].map((d,i)=>`<div class="relative"><img src="${d}" class="h-20 w-20 rounded border object-cover"><button type="button" onclick="phqDel('${id}',${i})" class="absolute -top-2 -right-2 bg-white border rounded-full w-6 h-6 text-rose-600" aria-label="Remove">&times;</button></div>`).join('')};
function phqPick(e,id){const fs=[...e.target.files];e.target.value='';fs.forEach(f=>rs(f,1100,d=>{(PHQ[id]=PHQ[id]||[]).push(d);phqShow(id)}))}
function phqDel(id,i){PHQ[id].splice(i,1);phqShow(id)}
