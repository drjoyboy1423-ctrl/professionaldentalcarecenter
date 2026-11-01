/* ---------- Settings: appearance (dark mode), calendar, sync, install, account ---------- */
const THK='dental_theme';
const thGet=()=>{try{const v=localStorage.getItem(THK);return v=='dark'||v=='light'?v:'auto'}catch(e){return 'auto'}};
function thApply(){const m=thGet(),dk=m=='dark'||(m=='auto'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dk);try{if(typeof mobTheme=='function')mobTheme()}catch(e){}}
function setThemeMode(m){try{m=='auto'?localStorage.removeItem(THK):localStorage.setItem(THK,m)}catch(e){}thApply();if(V=='settings')go('settings')}
function setCal(m){CALM_=m;try{localStorage.setItem(CAL_KEY,m)}catch(e){}go('settings')}
calBtn=function(){};
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>{if(thGet()=='auto')thApply()})}catch(e){}
const _mt0=mobTheme;mobTheme=function(){_mt0();const m=document.querySelector('meta[name=theme-color]');if(m&&document.documentElement.classList.contains('dark'))m.content='#0f172a'};
const segBtn=(on,act,ic,l)=>`<button onclick="${act}" class="seg ${on?'on':''}"><i class="fa ${ic} mr-1"></i>${l}</button>`;
function settingsPage(){const tm=thGet(),cm=CALM_,inst=(typeof INSTALL_EV!='undefined'&&INSTALL_EV)||(typeof isIOS=='function'&&isIOS()&&!isStandalone());
 return hd('Settings')+
 card('<h3 class="font-bold mb-1"><i class="fa fa-moon mr-2"></i>Appearance</h3>',`<p class="text-sm text-gray-500 mb-3">Dark mode is easier on the eyes in a dim room. Automatic follows your phone setting.</p><div class="segs">${segBtn(tm=='light',"setThemeMode('light')",'fa-sun','Light')}${segBtn(tm=='dark',"setThemeMode('dark')",'fa-moon','Dark')}${segBtn(tm=='auto',"setThemeMode('auto')",'fa-circle-half-stroke','Automatic')}</div>`)+
 card('<h3 class="font-bold mb-1"><i class="fa fa-calendar-days mr-2"></i>Calendar</h3>',`<p class="text-sm text-gray-500 mb-3">How dates are shown and entered across the app.</p><div class="segs">${segBtn(cm=='ec',"setCal('ec')",'fa-calendar','Ethiopian (EC)')}${segBtn(cm=='gc',"setCal('gc')",'fa-calendar','Gregorian (GC)')}${segBtn(cm=='both',"setCal('both')",'fa-calendar-plus','EC + GC')}</div>`)+
 card('<h3 class="font-bold mb-1"><i class="fa fa-mobile-screen mr-2"></i>App</h3>',`<div class="flex flex-wrap gap-2">${inst?'<button onclick="installApp()" class="px-4 py-2 rounded-md bg-gray-200 text-sm"><i class="fa fa-download mr-1"></i>Install on this phone</button>':''}<button onclick="setSync()" class="px-4 py-2 rounded-md bg-gray-200 text-sm"><i class="fa fa-rotate mr-1"></i>Sync data now</button><button onclick="go('profile')" class="px-4 py-2 rounded-md bg-gray-200 text-sm"><i class="fa fa-user mr-1"></i>My profile and password</button></div><p class="text-xs text-gray-500 mt-3">Signed in as <b>${H(U.name)}</b> (${H(U.role)})${C?' &middot; '+H(isHQ()?HQ.name:C.name):''}. ${navigator.onLine===false?'You are offline.':'Online.'}</p>`)+
 (U.role=='admin'?card('<h3 class="font-bold mb-1"><i class="fa fa-shield-halved mr-2"></i>Two-step sign-in</h3>','<div id="mfabox" class="text-sm text-gray-500">Loading...</div>'):'')+
 (U.role=='admin'?card('<h3 class="font-bold mb-1"><i class="fa fa-cloud-arrow-up mr-2"></i>Backups</h3>','<p class="text-sm text-gray-500 mb-3">Every Sunday night all clinics are backed up automatically and the download links are emailed to the admin. You can also run it now.</p><button id="bkbtn" onclick="bkNow()" class="px-4 py-2 rounded-md bg-gray-200 text-sm"><i class="fa fa-cloud-arrow-up mr-1"></i>Back up all clinics now</button><p id="bkmsg" class="text-xs text-gray-500 mt-2"></p>'):'')+
 card('<h3 class="font-bold mb-1"><i class="fa fa-right-from-bracket mr-2"></i>Session</h3>','<button onclick="logout()" class="px-4 py-2 rounded-md bg-red-600 text-white text-sm">Log out</button><p class="text-xs text-gray-500 mt-2">Logging out also removes the offline copy of patient data from this device.</p>')}
async function setSync(){try{await SQ;if(typeof refresh=='function')await refresh();toast('Up to date',1)}catch(e){toast('Could not sync: '+(e.message||e))}}
thApply();

/* Admin: always show which clinic's data is on screen (the admin views one clinic at a time) */
const ADM_NOBAN=['clinics','users','crep','settings','profile'];
function admBanner(){const v=$('v');if(!v||!U||U.role!='admin'||!C||ADM_NOBAN.includes(V))return;const old=$('admban');if(old)old.remove();
 v.insertAdjacentHTML('afterbegin',`<div id="admban" class="flex items-center gap-2 mb-3 rounded-lg px-3 py-2 text-sm text-white" style="background:${H(C.color||'#1e3a8a')}"><span>Viewing clinic:</span><b class="truncate">${H(C.name)}</b><button onclick="go('clinics')" class="ml-auto underline text-xs whitespace-nowrap">Switch clinic</button></div>`)}
const _go2=go;go=function(){const r=_go2.apply(this,arguments);try{admBanner()}catch(e){}return r};

async function bkNow(){const b=$('bkbtn'),m=$('bkmsg');if(b)b.disabled=true;if(m)m.textContent='Backing up... this can take a minute.';try{const r=await DB.backupNow();if(m)m.textContent='Done: '+r.clinics+' clinic'+(r.clinics==1?'':'s')+' saved'+(r.emailed?'; links emailed to the admin.':'. (No email was sent: check the admin email address.)')}catch(e){if(m)m.textContent=e.message||'Backup failed.'}finally{if(b)b.disabled=false}}
