function lab(){const a=[];S.patients.forEach(p=>(p.d.lab||[]).forEach(x=>x.done=='Yes'&&a.push({...x,p})));
 return hd('Finished Laboratory')+card('',a.length?`<table class="w-full text-sm">${a.map(x=>`<tr class="border-b"><td class="p-2">${H(x.p.name)}</td><td>${H(x.req)}</td><td>${H(x.lab)}</td></tr>`).join('')}</table>`:'<p class="text-gray-500">No finished laboratory requests.</p>')}
function tbl(t,btn,rows){return hd(t,btn)+card('',`<table class="w-full text-sm"><tr class="text-left border-b"><th class="p-3">${t=='Procedure'?'Procedure':'Disease'}</th>${t=='Procedure'?'<th>Price</th>':'<th>Date</th>'}<th class="text-center">Actions</th></tr>${rows}</table>`)}
const acts=(k,i)=>`<td class="text-center whitespace-nowrap"><i class="fa fa-pen text-red-600 cursor-pointer mr-5" onclick="ed('${k}',${i})"></i><i class="fa fa-trash text-rose-600 cursor-pointer" onclick="rm('${k}',${i})"></i></td>`;
function dis(){return tbl('Disease Information','<button onclick="ad(\'dis\')" class="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">NEW DISEASE +</button>',S.dis.map((x,i)=>`<tr class="border-b"><td class="p-3">${H(x.name)}</td><td>${H(fdate(x.date))}</td>${acts('dis',i)}</tr>`).join('')).replace('Disease Information</th>','Disease</th>')}
function proc(){return tbl('Procedure','<button onclick="ad(\'proc\')" class="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">NEW PROCEDURE +</button>',S.proc.map((x,i)=>`<tr class="border-b"><td class="p-3">${H(x.n)}</td><td>${ETB(x.p)}</td>${acts('proc',i)}</tr>`).join(''))}
const GF={dis:[['name','Disease name'],['date','Date']],proc:[['n','Procedure'],['p','Price (ETB)','number']]};
function ad(k){form('New',GF[k],k=='dis'?{date:isoD(Date.now())}:{},v=>{if(!(v.n||v.name))return;S[k].push({id:Date.now(),...v});sv();go(V)})}
function ed(k,i){form('Edit',GF[k],S[k][i],v=>{Object.assign(S[k][i],v);sv();go(V)})}
function rm(k,i){if(confirm('Delete?')){S[k].splice(i,1);sv();go(V)}}
