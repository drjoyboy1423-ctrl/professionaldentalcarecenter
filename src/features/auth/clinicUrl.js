/* ---------- Each clinic has its own web address: https://<site>/<clinic code>  (also ?c=<code>) ----------
   Opening it fills in the clinic code on the sign-in page, so the clinic's logo and colour show and staff only type username and password.
   The server sends /<code> to the app (vercel.json / netlify.toml); real files such as /apply, /inspect and /privacy are served as usual.
   A different clinic address never signs anybody in or changes who they are: it only chooses which clinic the sign-in page starts with. */
const CLU_RES=['admin','administrator','apply','inspect','privacy','index','api','sw','manifest','favicon','robots','icon'];
/* on GitHub Pages the app lives under /<repository name>/ ; on Vercel, Netlify or a own domain it is at the root */
const siteBase=()=>location.origin+(/\.github\.io$/i.test(location.hostname)?'/'+(location.pathname.split('/')[1]||''):'');
const clAddr=code=>siteBase()+'/'+encodeURIComponent(String(code||'').toLowerCase());
function clAddrCopy(code){const u=clAddr(code);try{navigator.clipboard.writeText(u);toast('Clinic address copied')}catch(e){prompt('Copy this address',u)}}
function clAddrShare(code,name){const u=clAddr(code),t='Sign in to '+(name||'the clinic')+': '+u;try{if(navigator.share){navigator.share({title:name||'Clinic',text:t,url:u}).catch(()=>{});return}}catch(e){}window.open('https://wa.me/?text='+encodeURIComponent(t),'_blank')}
function cluCode(){const q=(new URLSearchParams(location.search).get('c')||'').trim().toLowerCase();if(/^[a-z0-9]{2,20}$/.test(q))return q;
 const seg=location.pathname.replace(/^\/+|\/+$/g,'').split('/').slice(/\.github\.io$/i.test(location.hostname)?1:0).join('/').toLowerCase();return /^[a-z0-9]{2,20}$/.test(seg)&&!CLU_RES.includes(seg)?seg:''}
{const _li=lcInit;lcInit=function(){const r=_li.apply(this,arguments);const k=cluCode();if(k&&$('lcode')){$('lcode').value=k;lcResolve().catch(()=>{const e=$('le');if(e){e.textContent='Clinic address not found. Check it with the clinic, or type your clinic code.';e.classList.remove('hidden')}})}return r}}
/* the manager sees the clinic address on the dashboard */
{const _d=dash;dash=function(){const h=_d.apply(this,arguments);if(!U||typeof h!='string'||U.role!='manager'||!C||!C.code)return h;
 return `<div class="bg-white rounded-lg shadow p-3 mb-4 flex items-center gap-2 flex-wrap text-sm"><i class="fa fa-link text-sky-700"></i><span class="font-medium">Clinic address</span><span class="text-gray-600 break-all">${H(clAddr(C.code).replace(/^https?:\/\//,''))}</span><button class="px-2 py-1 rounded border text-xs ml-auto" onclick="clAddrCopy('${H(C.code)}')">Copy</button><button class="px-2 py-1 rounded text-white text-xs bg-green-600" onclick="clAddrShare('${H(C.code)}','${H(C.name).replace(/'/g,'')}')">Send to staff</button></div>`+h}}

/* sign-in page: the small "Jobs / CV" button opens the public applicant page of the clinic whose code is typed (or taken from the clinic address) */
function jobsOpen(){let k=(($('lcode')||{}).value||'').trim().toLowerCase()||cluCode();if(!/^[a-z0-9]{2,20}$/.test(k)){k=(prompt('Clinic code (ask the clinic for it):')||'').trim().toLowerCase();if(!/^[a-z0-9]{2,20}$/.test(k))return}window.open(siteBase()+'/apply.html?c='+encodeURIComponent(k),'_blank','noopener')}
