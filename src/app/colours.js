/* ---------- Colours (Settings): accent colour per device + colourful mode; works with light and dark ---------- */
const ACC=[['clinic','Clinic colour',''],['sky','Sky','#0284c7'],['teal','Teal','#0d9488'],['green','Green','#16a34a'],['violet','Violet','#7c3aed'],['indigo','Indigo','#4f46e5'],['fuchsia','Fuchsia','#c026d3'],['rose','Rose','#e11d48'],['orange','Orange','#ea580c'],['amber','Amber','#b45309'],['slate','Slate','#475569']];
const acGet=()=>{try{return localStorage.getItem('dental_accent')||'clinic'}catch(e){return 'clinic'}};
const cfOn=()=>{try{return localStorage.getItem('dental_cf')!='0'}catch(e){return true}};
let ACLR=null;
function acApply(){const k=acGet(),a=ACC.find(x=>x[0]==k),col=(a&&a[2])||ACLR;document.documentElement.classList.toggle('cf',cfOn());if(!col)return;const r=document.documentElement.style,dk=document.documentElement.classList.contains('dark');
 r.setProperty('--c',col);r.setProperty('--cd',dk?`color-mix(in srgb,${col} 55%,white)`:`color-mix(in srgb,${col} 60%,black)`);r.setProperty('--cl',dk?`color-mix(in srgb,${col} 24%,#0f172a)`:`color-mix(in srgb,${col} 10%,white)`)}
const _stC=setTheme;setTheme=function(c){_stC(c);ACLR=document.documentElement.style.getPropertyValue('--c')||ACLR;acApply()};
const _thA=thApply;thApply=function(){_thA();acApply()};
function acSet(k){try{k=='clinic'?localStorage.removeItem('dental_accent'):localStorage.setItem('dental_accent',k)}catch(e){}acApply();if(V=='settings')go('settings')}
function cfSet(on){try{localStorage.setItem('dental_cf',on?'1':'0')}catch(e){}acApply();if(V=='settings')go('settings')}
function acCard(){const k=acGet();return card('<h3 class="font-bold mb-1"><i class="fa fa-palette mr-2"></i>Colours</h3>',`<p class="text-sm text-gray-500 mb-3">Pick the main colour of the app on this device. It works in both light and dark mode.</p><div class="flex flex-wrap gap-3 mb-4">${ACC.map(a=>`<button type="button" class="acsw ${k==a[0]?'on':''}" title="${a[1]}" aria-label="${a[1]}" onclick="acSet('${a[0]}')" style="${a[2]?'background:'+a[2]:'background:conic-gradient(#0ea5e9,#a855f7,#f97316,#10b981,#0ea5e9)'}"></button>`).join('')}</div><div class="segs">${segBtn(cfOn(),'cfSet(1)','fa-wand-magic-sparkles','Colourful')}${segBtn(!cfOn(),'cfSet(0)','fa-circle-half-stroke','Plain')}</div><p class="text-xs text-gray-500 mt-2">Colourful adds tinted cards, coloured icons and headings. Plain keeps the simple look.</p>`)}
const _spC=settingsPage;settingsPage=function(){const h=_spC.apply(this,arguments),m='<div class="bg-white rounded-xl shadow p-4 md:p-6 mb-4"><h3 class="font-bold mb-1"><i class="fa fa-calendar-days',i=h.indexOf(m);return i<0?h+acCard():h.slice(0,i)+acCard()+h.slice(i)};
acApply();
