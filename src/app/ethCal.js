/* ---------- Dashboard card: today's Ethiopian date, the next Ethiopian holidays (notice), and the weather with an icon ----------
   Holidays are worked out in the app (no internet needed). Moon-based Muslim holidays can move by a day (shown with "+-1 day").
   Weather comes from the free Open-Meteo service (no key); the last answer is kept on the device and shown when offline. */
const EC_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function ecOrthEaster(y){const a=y%4,b=y%7,c=y%19,d=(19*c+15)%30,e=(2*a+4*b-d+34)%7,m=Math.floor((d+e+114)/31),dd=(d+e+114)%31+1;return new Date(y,m-1,dd+13)}
function ecHoliday(y){/* y = Gregorian year; list of [Date, English name, Amharic name, note] */
 const ey=toEC(new Date(y,5,1)).y,E=ecOrthEaster(y),add=(d,n)=>new Date(d.getFullYear(),d.getMonth(),d.getDate()+n),L=[];
 L.push([new Date(y,0,7),'Genna (Ethiopian Christmas)','ገና','']);
 L.push([new Date(y,0,19),'Timket (Epiphany)','ጥምቀት','']);
 L.push([fromEC(ey,6,23),'Adwa Victory Day','የአድዋ ድል በዓል','']);
 L.push([add(E,-2),'Siklet (Good Friday)','ስቅለት','']);
 L.push([E,'Fasika (Ethiopian Easter)','ፋሲካ','']);
 L.push([new Date(y,4,1),'International Labour Day','የሠራተኞች ቀን','']);
 L.push([fromEC(ey,8,27),'Patriots\' Victory Day','የአርበኞች ቀን','']);
 L.push([fromEC(ey,9,20),'Downfall of the Derg','ደርግ የወደቀበት ቀን','']);
 L.push([fromEC(ey+1,1,1),'Enkutatash (Ethiopian New Year)','እንቁጣጣሽ','']);
 L.push([fromEC(ey+1,1,17),'Meskel (Finding of the True Cross)','መስቀል','']);
 return L}
function ecMuslim(from,days){const L=[];try{const f=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric'});
 for(let i=0;i<=days;i++){const d=new Date(from.getFullYear(),from.getMonth(),from.getDate()+i),p=f.formatToParts(d),m=+p.find(x=>x.type=='month').value,dd=+p.find(x=>x.type=='day').value;
  if(m==10&&dd==1)L.push([d,'Eid al-Fitr','ኢድ አልፈጥር','+-1 day (moon)']);else if(m==12&&dd==10)L.push([d,'Eid al-Adha','ኢድ አልአድሃ','+-1 day (moon)']);else if(m==3&&dd==12)L.push([d,'Mawlid (Prophet\'s birthday)','መውሊድ','+-1 day (moon)'])}}catch(e){}return L}
function ecEvents(from,days){const s=new Date(from.getFullYear(),from.getMonth(),from.getDate()),e=new Date(s.getFullYear(),s.getMonth(),s.getDate()+days),k=x=>x.getTime(),
 L=[...ecHoliday(s.getFullYear()),...ecHoliday(s.getFullYear()+1),...ecMuslim(s,days)].filter(x=>k(x[0])>=k(s)&&k(x[0])<=k(e));L.sort((a,b)=>k(a[0])-k(b[0]));return L}
const ecDiff=d=>{const t=new Date();return Math.round((new Date(d.getFullYear(),d.getMonth(),d.getDate())-new Date(t.getFullYear(),t.getMonth(),t.getDate()))/864e5)};
const ecIn=n=>n==0?'today':n==1?'tomorrow':'in '+n+' days';

/* weather */
const WX_CITIES={'Addis Ababa':[9.03,38.74],'Dire Dawa':[9.60,41.86],'Adama (Nazret)':[8.54,39.27],'Hawassa':[7.06,38.48],'Bahir Dar':[11.59,37.39],'Mekelle':[13.50,39.47],'Gondar':[12.60,37.47],'Jimma':[7.67,36.83],'Dessie':[11.13,39.63],'Harar':[9.31,42.12],'Jijiga':[9.35,42.80],'Bishoftu':[8.75,38.98],'Arba Minch':[6.03,37.55],'Dilla':[6.41,38.31],'Nekemte':[9.09,36.55]};
const wxKey=()=>'dental_wxcity:'+(typeof C!='undefined'&&C?C.id:'');
function wxCity(){try{const c=localStorage.getItem(wxKey());if(c&&WX_CITIES[c])return c}catch(e){}
 const n=(typeof C!='undefined'&&C&&C.name||'').toLowerCase().replace(/[^a-z]/g,'');for(const k of Object.keys(WX_CITIES)){if(n.includes(k.toLowerCase().replace(/[^a-z]/g,'').replace('nazret','').replace('adama','adama')))return k}if(n.includes('diredawa'))return 'Dire Dawa';return 'Addis Ababa'}
function wxIcon(c){return c==0?['fa-sun','Clear']:c<=2?['fa-cloud-sun','Partly cloudy']:c==3?['fa-cloud','Cloudy']:c<=48?['fa-smog','Fog']:c<=57?['fa-cloud-rain','Drizzle']:c<=67?['fa-cloud-showers-heavy','Rain']:c<=77?['fa-snowflake','Snow']:c<=82?['fa-cloud-showers-heavy','Showers']:['fa-bolt','Thunderstorm']}
function wxChip(d){try{if(!d)return;const i=wxIcon(d.code);let c=$('wxchip');if(!c){const t=$('thbtn');if(!t)return;t.insertAdjacentHTML('beforebegin','<button id="wxchip" type="button" onclick="wxPick()" class="border rounded-full h-9 px-2 bg-white text-gray-700 text-xs font-bold flex items-center gap-1" style="white-space:nowrap"></button>');c=$('wxchip')}c.innerHTML='<i class="fa '+i[0]+'" style="color:var(--c)"></i>'+Math.round(d.t)+'&deg;';c.title=i[1]+', '+Math.round(d.t)+'\u00b0C - '+wxCity()+' (tap to change city)';c.setAttribute('aria-label',c.title)}catch(e){}}
function wxShow(d,stale){wxChip(d);const b=$('wxbox');if(!b||!d)return;const i=wxIcon(d.code);b.innerHTML=`<i class="fa ${i[0]}" style="font-size:30px;color:var(--c)"></i><div><div style="font-size:22px;font-weight:800;line-height:1">${Math.round(d.t)}&deg;C</div><div class="text-xs text-gray-500">${i[1]}${d.max!=null?' &middot; '+Math.round(d.min)+'&deg; / '+Math.round(d.max)+'&deg;':''}${stale?' &middot; saved':''}</div></div>`}
async function wxLoad(){const city=wxCity(),ck='dental_wxc:'+city;let c=null;try{c=JSON.parse(localStorage.getItem(ck)||'null')}catch(e){}
 if(c&&Date.now()-c.at<18e5){wxShow(c.d);return}
 try{const [la,lo]=WX_CITIES[city],ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),7000),r=await fetch('https://api.open-meteo.com/v1/forecast?latitude='+la+'&longitude='+lo+'&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1',{signal:ctl.signal});clearTimeout(tm);if(!r.ok)throw 0;const j=await r.json(),d={t:j.current.temperature_2m,code:j.current.weather_code,max:(j.daily.temperature_2m_max||[])[0],min:(j.daily.temperature_2m_min||[])[0]};try{localStorage.setItem(ck,JSON.stringify({at:Date.now(),d}))}catch(e){}wxShow(d)}
 catch(e){if(c)wxShow(c.d,1);else if($('wxbox'))$('wxbox').innerHTML='<i class="fa fa-cloud" style="font-size:26px;color:#94a3b8"></i><div class="text-xs text-gray-500">Weather not available (no internet)</div>'}}
function wxPick(){$('mb').innerHTML=`<div class="flex items-center justify-between mb-3"><h3 class="font-bold text-lg"><i class="fa fa-cloud-sun mr-2"></i>Weather city</h3><button onclick="cl()" class="px-3 py-1 rounded bg-gray-200 text-sm">Close</button></div>`+Object.keys(WX_CITIES).map(k=>`<button type="button" class="clpi ${k==wxCity()?'on':''}" onclick="wxSet('${k}')"><span class="clpn">${H(k)}</span><i class="fa ${k==wxCity()?'fa-circle-dot':'fa-circle'}" style="color:${k==wxCity()?'var(--c)':'#94a3b8'}"></i></button>`).join('');md.classList.replace('hidden','flex')}
function wxSet(k){try{localStorage.setItem(wxKey(),k)}catch(e){}cl();ecCardDraw()}

/* the card */
function ecCardHtml(){const t=new Date(),e=toEC(t),ev=ecEvents(t,200),tod=ev.filter(x=>ecDiff(x[0])==0),nx=ev.filter(x=>ecDiff(x[0])>0).slice(0,2);
 const chip=x=>{const n=ecDiff(x[0]);return `<div class="ecev"><b>${H(x[1])}</b><span class="text-xs text-gray-500"> &middot; ${H(x[2])} &middot; ${H(ecStr(x[0]))} (${H(gcStr(x[0]))}) &middot; ${ecIn(n)}${x[3]?' &middot; '+H(x[3]):''}</span></div>`};
 return `<div id="ecard" class="bg-white rounded-xl shadow p-3 mb-3"><div class="flex flex-wrap items-center justify-between gap-3"><div><div class="text-xs font-bold uppercase" style="color:var(--c)"><i class="fa fa-calendar-day mr-1"></i>Ethiopian calendar</div><div style="font-size:16px;font-weight:800">${EC_DAYS[t.getDay()]}, ${EC_L[e.m-1]} ${e.d}, ${e.y} <span class="text-xs font-semibold text-gray-500">EC</span></div><div class="text-xs text-gray-500">${EC_M[e.m-1]} ${e.d} &middot; ${H(gcStr(t))}</div></div>
 <button type="button" onclick="wxPick()" class="flex items-center gap-3 text-left" style="background:transparent;border:0" title="Change city"><span id="wxbox" class="flex items-center gap-3"><i class="fa fa-cloud-sun" style="font-size:26px;color:#94a3b8"></i><span class="text-xs text-gray-500">Loading weather...</span></span><span class="text-xs text-gray-500"><i class="fa fa-location-dot"></i> ${H(wxCity())}</span></button></div>
 ${tod.length?`<div class="ecnow"><i class="fa fa-bell mr-1"></i>Today: <b>${tod.map(x=>H(x[1])).join(', ')}</b> (${tod.map(x=>H(x[2])).join(', ')}) - public holiday, check the clinic hours.</div>`:''}
 ${nx.length?`<div class="mt-2"><div class="text-xs font-bold text-gray-500 mb-1">Next holidays</div>${nx.map(chip).join('')}</div>`:''}</div>`}
function ecCardDraw(){const old=$('ecard'),v=$('v');if(!v||V!='dash')return;if(old)old.remove();const h=ecCardHtml(),a=$('dsub');if(a)a.insertAdjacentHTML('afterend',h);else v.insertAdjacentHTML('afterbegin',h);wxLoad()}
/* one short notice a day when a holiday is today or tomorrow */
function ecNotify(){try{const k='dental_ecnote:'+(U?U.id:'')+':'+isoD(Date.now());if(localStorage.getItem(k))return;const ev=ecEvents(new Date(),2).filter(x=>ecDiff(x[0])<=1);if(!ev.length)return;localStorage.setItem(k,'1');const x=ev[0];toast((ecDiff(x[0])==0?'Today is ':'Tomorrow is ')+x[1]+' ('+x[2]+') - public holiday, check the clinic hours.')}catch(e){}}
{const _g=go;go=function(){const r=_g.apply(this,arguments);try{if(!$('wxchip')&&U)wxLoad()}catch(e){}try{if(V!='dash'){const o=$('ecard');if(o)o.remove()}else if($('v')&&!$('ecard')){ecCardDraw();ecNotify()}}catch(e){}return r}}
