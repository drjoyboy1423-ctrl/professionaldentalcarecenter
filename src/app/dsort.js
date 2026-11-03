/* Sort by date: one choice (newest / oldest first) used by every list page; remembered on this device. */
let DS=lsGet('dsort')=='old'?'old':'new';
const dsort=(a,f)=>[...a].sort((x,y)=>DS=='old'?f(x)-f(y):f(y)-f(x));
function dsSet(v){DS=v;lsSet('dsort',v);go(V)}
const DSP=['dash','appt','lab','rinv','ord','tra','dir','drd','done','ster'];
const dsBar=()=>`<div id="dsbar" class="flex items-center gap-2 text-sm mb-3 flex-wrap"><i class="fa fa-arrow-down-wide-short text-gray-500"></i><span class="text-gray-600">Sort by date:</span>${[['new','Newest first'],['old','Oldest first']].map(a=>`<button onclick="dsSet('${a[0]}')" class="px-3 py-1 rounded-md border ${DS==a[0]?'bg-red-100 border-red-400 text-red-700':'bg-white'}">${a[1]}</button>`).join('')}</div>`;
const _gods=go;go=function(){const r=_gods.apply(this,arguments);try{if(DSP.includes(V)&&$('v')&&!$('dsbar'))$('v').insertAdjacentHTML('afterbegin',dsBar())}catch(e){}return r};
