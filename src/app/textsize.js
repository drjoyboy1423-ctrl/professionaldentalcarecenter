/* Text size: Small / Normal / Large / Extra large. Scales the whole app (everything is in rem). Remembered on this device. */
const FSZ=[['Small',87.5],['Normal',100],['Large',112.5],['Extra large',125]];
let FSI=(()=>{const v=parseInt(lsGet('dental_fs'));return v>=0&&v<4?v:1})();
const fsApply=()=>{document.documentElement.style.fontSize=FSZ[FSI][1]+'%'};fsApply();
function fsSet(i){FSI=Math.max(0,Math.min(3,i));lsSet('dental_fs',FSI);fsApply();if(U&&V)go(V)}
const _hdfs=hdr;hdr=function(){const r=_hdfs.apply(this,arguments);try{if(!$('fsbtn')&&$('calbtn'))$('calbtn').insertAdjacentHTML('beforebegin','<button id="fsbtn" onclick="fsSet((FSI+1)%4)" class="border rounded-full w-9 h-9 bg-white text-gray-700 text-sm font-bold" title="Text size" aria-label="Change text size">Aa</button>')}catch(e){}return r};
const _stfs=settingsPage;settingsPage=function(){return _stfs.apply(this,arguments)+`<div class="bg-white rounded-xl shadow p-4 md:p-6 mb-4"><h3 class="font-bold mb-2">Text size</h3><p class="text-sm text-gray-600 mb-3">Make text bigger or smaller on this device. You can also tap the <b>Aa</b> button at the top.</p><div class="flex flex-wrap gap-2">${FSZ.map((f,i)=>`<button onclick="fsSet(${i})" class="px-3 py-2 rounded-md border text-sm ${i==FSI?'bg-red-100 border-red-400 text-red-700 font-semibold':'bg-white'}">${f[0]}</button>`).join('')}</div></div>`};
