/* ---------- Where backups are kept: this device (download / folder), your own website or server, plus the email the system already sends ---------- */
const BKD_PHP=`<?php
// ProDental Records - backup receiver for your own web hosting (works on ordinary PHP hosting).
// 1) Upload this file to your hosting, e.g. https://yourwebsite.com/prodental/receive.php
// 2) Change SECRET below to the same secret you type in the app (Settings > Where backups are kept).
// 3) In the app paste the address of this file. Backups are saved in the "backups" folder next to this file.
const SECRET = 'CHANGE-ME';
const KEEP   = 20;                       // newest backups kept per clinic

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Backup-Token, X-Backup-Name');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
header('Content-Type: application/json');
$tok = $_SERVER['HTTP_X_BACKUP_TOKEN'] ?? '';
if (SECRET === 'CHANGE-ME' || !hash_equals(SECRET, $tok)) { http_response_code(403); echo '{"error":"Wrong secret"}'; exit; }
$body = file_get_contents('php://input');
$j = json_decode($body, true);
if (!$body) { echo '{"ok":true,"note":"test"}'; exit; }        // empty body = connection test
if (!is_array($j) || !isset($j['format'])) { http_response_code(400); echo '{"error":"Not a backup file"}'; exit; }
$dir = __DIR__ . '/backups';
if (!is_dir($dir)) { mkdir($dir, 0750, true); file_put_contents($dir . '/.htaccess', "Require all denied\\nDeny from all\\n"); }
$name = preg_replace('/[^A-Za-z0-9._-]/', '-', $_SERVER['HTTP_X_BACKUP_NAME'] ?? ('backup-' . date('Y-m-d') . '.json'));
if (substr($name, -5) !== '.json') { $name .= '.json'; }
file_put_contents($dir . '/' . $name, $body);
$prefix = preg_replace('/-\\d{4}-\\d{2}-\\d{2}.*$/', '', $name);
$files = glob($dir . '/' . $prefix . '-*.json'); rsort($files);
foreach (array_slice($files, KEEP) as $f) { @unlink($f); }
echo json_encode(['ok' => true, 'saved' => $name, 'kb' => round(strlen($body) / 1024)]);
`;
const bkdCfg=()=>{S.fin=S.fin||{sal:[],exp:[]};S.fin.bk=S.fin.bk||{url:'',token:'',cloud:false,auto:false};return S.fin.bk};
const bkdOk=()=>U&&(U.role=='admin'||U.role=='manager')&&C;
const bkdIdb=(m,k,v)=>new Promise((res,rej)=>{const r=indexedDB.open('prodental-bk',1);r.onupgradeneeded=()=>r.result.createObjectStore('h');r.onerror=()=>rej(r.error);r.onsuccess=()=>{const t=r.result.transaction('h',m=='get'?'readonly':'readwrite'),s=t.objectStore('h'),q=m=='get'?s.get(k):s.put(v,k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)}});
const bkdMsg=(t,bad)=>{const e=$('bkd_msg');if(e){e.textContent=t;e.className='text-sm mt-2 '+(bad?'text-red-600':'text-green-700')}};
function bkdCard(){const b=bkdCfg(),fs=!!window.showDirectoryPicker;
 return card('<h3 class="font-bold mb-1"><i class="fa fa-hard-drive mr-2"></i>Where backups are kept</h3>',`<p class="text-sm text-gray-500 mb-3">Besides the email link, keep a copy on your own device, website or server. Backups are private patient data: use your own storage only.</p>
 <div class="border rounded-lg p-3 mb-3"><b class="text-sm"><i class="fa fa-laptop mr-1"></i>This device</b><div class="flex flex-wrap gap-2 mt-2"><button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkdDownload()">Download backup now</button>${fs?`<button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkdFolder()">Choose a folder</button><button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkdSaveFolder()">Save to folder now</button>`:''}</div><div class="text-xs text-gray-500 mt-2">${fs?'Folder: <span id="bkd_fold">none chosen</span>. Works in Chrome or Edge on a computer (a USB drive or a shared network folder also works).':'Folder saving needs Chrome or Edge on a computer. On a phone use Download.'}</div></div>
 <div class="border rounded-lg p-3 mb-3"><b class="text-sm"><i class="fa fa-globe mr-1"></i>My website or server</b><p class="text-xs text-gray-500 mt-1">Works with your own hosting (for example Yegara HOST or any PHP hosting): upload the receiver file, then paste its address here. A server inside your clinic works too if its address is https:// (or this computer's localhost).</p>
 <input id="bkd_url" class="inp mt-2" placeholder="https://yourwebsite.com/prodental/receive.php" value="${H(b.url||'')}"><input id="bkd_tok" class="inp mt-2" placeholder="Secret word (same as in the receiver file)" value="${H(b.token||'')}">
 <label class="flex items-center gap-2 text-sm mt-2"><input type="checkbox" id="bkd_cloud" ${b.cloud?'checked':''}> Also send it from the cloud every Sunday (address must be public)</label>
 <label class="flex items-center gap-2 text-sm mt-1"><input type="checkbox" id="bkd_auto" ${b.auto?'checked':''}> From this device, once a week when the app is opened (saves to the folder and sends to the server)</label>
 <div class="flex flex-wrap gap-2 mt-3"><button class="px-3 py-2 rounded-md text-white text-sm" style="background:var(--c)" onclick="bkdSave()">Save</button><button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkdTest()">Test connection</button><button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkdSend()">Send backup now</button><button class="px-3 py-2 rounded-md bg-gray-200 text-sm" onclick="bkdPhp()">Download receiver file</button></div></div>
 <div class="text-xs text-gray-500">Email: the weekly link already goes to the administrator's email address${U.role=='admin'?' (and Google Drive if set up)':''}.</div><div id="bkd_msg" class="text-sm mt-2"></div>`)}
function bkdFill(){const e=$('bkd_fold');if(e)bkdIdb('get','dir').then(h=>{if(h&&e)e.textContent=h.name}).catch(()=>{})}
async function bkdDownload(){await backupC(C.id)}
async function bkdFolder(){try{const h=await showDirectoryPicker({mode:'readwrite'});await bkdIdb('put','dir',h);bkdFill();bkdMsg('Folder chosen: '+h.name)}catch(e){if(e.name!='AbortError')bkdMsg(e.message,1)}}
async function bkdWriteFolder(b){const h=await bkdIdb('get','dir');if(!h)throw new Error('Choose a folder first.');if(await h.queryPermission({mode:'readwrite'})!=='granted'&&await h.requestPermission({mode:'readwrite'})!=='granted')throw new Error('Folder permission was not given.');const f=await h.getFileHandle(bkName(C),{create:true}),w=await f.createWritable();await w.write(JSON.stringify(b));await w.close();return h.name}
async function bkdSaveFolder(){try{bkdMsg('Saving...');const b=await DB.backupClinic(C.id),n=await bkdWriteFolder(b);bkdMsg('Saved '+b.patients.length+' patients to folder '+n+'.')}catch(e){bkdMsg(e.message||'Could not save.',1)}}
function bkdSave(){const b=bkdCfg(),u=($('bkd_url').value||'').trim();if(u&&!/^https:\/\/|^http:\/\/(localhost|127\.0\.0\.1)/i.test(u))return bkdMsg('The address must start with https:// (or http://localhost).',1);b.url=u;b.token=($('bkd_tok').value||'').trim();b.cloud=$('bkd_cloud').checked;b.auto=$('bkd_auto').checked;if(b.url&&!b.token)return bkdMsg('Enter a secret word so only you can send backups.',1);syncNow().then(()=>bkdMsg('Saved.')).catch(e=>bkdMsg('Not saved: '+(e.message||e),1))}
async function bkdPost(body){const b=bkdCfg();if(!b.url||!b.token)throw new Error('Save the address and secret first.');const r=await fetch(b.url,{method:'POST',headers:{'Content-Type':'application/json','X-Backup-Token':b.token,'X-Backup-Name':body?bkName(C):'test'},body:body?JSON.stringify(body):''}),j=await r.json().catch(()=>({}));if(!r.ok||j.error)throw new Error(r.status==403?'The server refused: the secret word does not match.':(j.error||'Server answered '+r.status));return j}
async function bkdTest(){try{bkdMsg('Testing...');await bkdPost(null);bkdMsg('Connected: the server accepted the secret word.')}catch(e){bkdMsg((e.message||e)+' (If this is a local server over http, the browser blocks it: use https.)',1)}}
async function bkdSend(){try{bkdMsg('Sending...');const b=await DB.backupClinic(C.id),j=await bkdPost(b);bkdMsg('Sent '+b.patients.length+' patients'+(j.kb?' ('+j.kb+' KB)':'')+' to your server.')}catch(e){bkdMsg((e.message||e)+' (If this is a local server over http, the browser blocks it: use https.)',1)}}
function bkdPhp(){const t=($('bkd_tok').value||'').trim();if(!t)return bkdMsg('Type your secret word first; it is written into the file.',1);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([BKD_PHP.replace("'CHANGE-ME'","'"+t.replace(/\\/g,'\\\\').replace(/'/g,"\\'")+"'")],{type:'text/plain'}));a.download='receive.php';a.click();bkdMsg('Upload receive.php to your hosting, then paste its address above.')}
/* weekly automatic copy from this device */
async function bkdAuto(){try{if(!bkdOk()||U.role!='manager'&&U.role!='admin')return;const b=bkdCfg();if(!b.auto)return;const k='bkd_last_'+C.id,last=+(localStorage.getItem(k)||0);if(Date.now()-last<6*864e5)return;const bk=await DB.backupClinic(C.id);let ok=0;try{if(await bkdIdb('get','dir')){await bkdWriteFolder(bk);ok++}}catch(e){}try{if(b.url){await bkdPost(bk);ok++}}catch(e){}if(ok){localStorage.setItem(k,Date.now());toast('Weekly backup copy saved')}}catch(e){}}
const _setBkd=settingsPage;settingsPage=function(){let h=_setBkd.apply(this,arguments);if(bkdOk())h+=bkdCard();setTimeout(bkdFill,0);return h};
const _goBkd=go;go=function(){const r=_goBkd.apply(this,arguments);if(!window.__bkdT){window.__bkdT=1;setTimeout(bkdAuto,8000)}return r};
