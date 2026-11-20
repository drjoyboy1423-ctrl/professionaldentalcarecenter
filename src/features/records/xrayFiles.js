/* ---------- X-ray / CBCT / DICOM files in the patient's Images section ----------
   Pictures (JPG / PNG) from the camera, the phone gallery, a screenshot of the X-ray software or the cephalometric program are shrunk and kept in the record, as before.
   Everything else the lab or the X-ray room sends (DICOM .dcm, a CBCT folder as .zip, PDF reports, STL / PLY / OBJ scans) is kept in a PRIVATE storage folder of this clinic only
   (up to 50 MB each). Open it on the phone with "Share" and pick IDV (IMAIOS DICOM Viewer) or any DICOM viewer, or download it on a computer. */
const XR_KINDS=['IOPA (periapical)','Bitewing','Occlusal','Panoramic (OPG)','Lateral cephalometric','CBCT (3D scan)','PA skull','Intraoral photo','Face photo','Other'];
const XR_MAX=50*1024*1024,XR_EXT=/\.(dcm|dicom|zip|pdf|stl|ply|obj|jpe?g|png)$/i;
let XRQ={imgs:[],files:[],busy:0};
const xrSize=n=>n>=1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const xrExt=n=>((String(n).match(/\.([a-z0-9]+)$/i)||[])[1]||'').toLowerCase();
const xrSafe=n=>String(n).replace(/[^A-Za-z0-9._-]+/g,'_').slice(-60);
function xrForm(){const p=gp();if(!p)return;XRQ={imgs:[],files:[],busy:0};
 const btn=(ic,t,inner)=>`<label class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white cursor-pointer text-sm"><i class="fa ${ic} text-red-600"></i> ${t}${inner}</label>`;
 $('mb').innerHTML=`<h3 class="font-bold text-xl mb-3">Add X-ray / image / file</h3>
 <label class="block text-sm font-medium mb-1">Type</label><select id="xr_k" class="inp mb-3">${XR_KINDS.map(k=>`<option>${H(k)}</option>`).join('')}</select>
 <label class="block text-sm font-medium mb-1">Tooth / Area</label><input id="xr_t" class="inp mb-3">
 <label class="block text-sm font-medium mb-1">Note</label><input id="xr_n" class="inp mb-3">
 <div class="flex flex-wrap gap-2 mb-2">${btn('fa-camera','Take photo','<input type="file" accept="image/*" capture="environment" class="hidden" onchange="xrPick(event)">')}${btn('fa-images','Choose from gallery','<input type="file" accept="image/*" multiple class="hidden" onchange="xrPick(event)">')}${btn('fa-file-medical','X-ray / CBCT / DICOM files','<input type="file" multiple class="hidden" accept=".dcm,.dicom,.zip,.pdf,.stl,.ply,.obj,image/*,application/dicom,application/zip" onchange="xrPick(event)">')}</div>
 <p class="text-xs text-gray-500 mb-2">Gallery pictures can be screenshots or exports from the X-ray, cephalometric or CBCT software. For DICOM (.dcm), a CBCT folder (.zip) or a PDF report sent by the lab, use the third button (up to 50 MB each).</p>
 <div id="xr_l" class="text-sm mb-2"></div>
 <div class="flex justify-end gap-2 mt-2"><button type="button" onclick="cl()" class="px-4 py-2 rounded bg-gray-200">Cancel</button><button type="button" id="xr_ok" onclick="xrSave()" class="px-4 py-2 rounded bg-red-600 text-white">Save</button></div>`;md.classList.replace('hidden','flex')}
function xrShow(){const l=$('xr_l');if(!l)return;l.innerHTML=[...XRQ.imgs.map((d,i)=>`<span class="inline-block relative mr-2 mb-2"><img src="${d}" class="w-16 h-16 object-cover rounded border"><button type="button" onclick="XRQ.imgs.splice(${i},1);xrShow()" class="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 text-xs">&times;</button></span>`),...XRQ.files.map((f,i)=>`<div class="flex justify-between items-center bg-gray-50 rounded px-2 py-1 mb-1"><span><i class="fa fa-file-medical text-red-600 mr-1"></i>${H(f.name)} <span class="text-xs text-gray-500">${xrSize(f.size)}</span></span><button type="button" onclick="XRQ.files.splice(${i},1);xrShow()" class="text-rose-600">&times;</button></div>`)].join('')}
function xrPick(e){const fs=[...e.target.files];e.target.value='';const bad=[];
 fs.forEach(f=>{const ex=xrExt(f.name);
  /* pictures (camera, gallery, screenshots, exports) are made smaller and kept inside the record */
  if(/^image\//.test(f.type)||/^(jpe?g|png)$/.test(ex)){XRQ.busy++;rs(f,1400,d=>{XRQ.busy--;XRQ.imgs.push(d);xrShow()});return}
  if(!XR_EXT.test(f.name)){bad.push(f.name+' (this type is not supported; use DICOM .dcm, .zip, PDF, STL, JPG or PNG)');return}
  if(f.size>XR_MAX){bad.push(f.name+' is larger than 50 MB. Compress it to a smaller .zip or send it another way');return}
  XRQ.files.push(f)});
 if(bad.length)alert(bad.join('\n'));xrShow()}
async function xrSave(){const p=gp();if(!p)return;const b=$('xr_ok');if(XRQ.busy)return alert('Please wait a moment, the picture is still being prepared.');
 if(!XRQ.imgs.length&&!XRQ.files.length)return alert('Take a photo, choose pictures from the gallery, or choose an X-ray / CBCT file.');
 const kind=$('xr_k').value,tooth=$('xr_t').value.trim(),note=$('xr_n').value.trim(),date=isoD(Date.now()),by=U.name,arr=(p.d.img=p.d.img||[]),done=[];
 b.disabled=true;
 try{let n=0;for(const f of XRQ.files){n++;b.textContent='Uploading '+n+' / '+XRQ.files.length+'...';const path=C.id+'/'+p.id+'/'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)+'-'+xrSafe(f.name);await DB.pfUp(path,f);done.push({file:{path,name:f.name,size:f.size,type:f.type||''},kind,tooth,note,date,by})}}
 catch(e){b.disabled=false;b.textContent='Save';done.forEach(x=>DB.pfDel(x.file.path).catch(()=>{}));return alert('Could not upload the file: '+(e&&e.message?e.message:e)+'. Check the internet connection and try again.')}
 XRQ.imgs.forEach(d=>arr.push({src:d,kind,tooth,note,date,by}));done.forEach(x=>arr.push(x));XRQ={imgs:[],files:[],busy:0};sv();cl();go('patient')}
/* gallery: picture cards as before, file cards for DICOM / CBCT / PDF / 3D scans */
function gal(a){return `<div class="grid grid-cols-2 md:grid-cols-3 gap-3">${a.map((x,i)=>{const meta=`<div class="p-2 text-xs"><div class="flex justify-between items-center"><span class="bg-red-100 text-red-700 rounded px-2">${H(x.kind||'Photo')}</span><i class="fa fa-trash text-rose-600 cursor-pointer" onclick="delI('img',${i})"></i></div>${x.tooth?`<div class="mt-1">Tooth/Area: ${H(x.tooth)}</div>`:''}${x.note?`<div class="text-gray-600">${H(x.note)}</div>`:''}<div class="text-gray-400">${H(x.date||'')}</div></div>`;
  if(x.file){const f=x.file;return `<div class="bg-gray-50 rounded-lg shadow overflow-hidden"><div class="h-32 bg-gray-800 text-white flex flex-col items-center justify-center px-2 text-center cursor-pointer" onclick="xrOpen(${i})"><i class="fa fa-file-medical text-3xl mb-1"></i><span class="text-[11px] break-all">${H(f.name)}</span><span class="text-[10px] opacity-70">${xrSize(f.size||0)}</span></div><div class="flex gap-1 p-2 pb-0"><button type="button" onclick="xrOpen(${i})" class="flex-1 px-2 py-1 rounded bg-red-600 text-white text-xs">Open / Share</button><button type="button" onclick="xrDl(${i})" class="px-2 py-1 rounded bg-gray-200 text-xs" title="Download"><i class="fa fa-download"></i></button></div>${meta}</div>`}
  return `<div class="bg-gray-50 rounded-lg shadow overflow-hidden"><img src="${x.src}" class="w-full h-32 object-cover cursor-pointer bg-black" onclick="vw(${i})">${meta}</div>`}).join('')}</div>`}
/* the picture viewer skips file cards when you step with the arrows */
{const _vw=vw;vw=function(i){const a=(gp()&&gp().d.img)||[];if(a[i]&&!a[i].src){const d=i>=VI?1:-1;let j=i;while(a[j]&&!a[j].src)j+=d;if(!a[j])return;i=j}return _vw.call(this,i)}}
async function xrBlob(i){const x=gp().d.img[i];if(!x||!x.file)throw new Error('File not found');const u=await DB.pfUrl(x.file.path,600),r=await fetch(u);if(!r.ok)throw new Error('Could not download the file ('+r.status+')');return {b:await r.blob(),f:x.file}}
function xrSaveBlob(b,name){const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
async function xrDl(i){try{toast('Preparing the file...',1);const r=await xrBlob(i);xrSaveBlob(r.b,r.f.name)}catch(e){alert(e.message||e)}}
async function xrOpen(i){const x=gp().d.img[i];if(!x||!x.file)return;const f=x.file,ex=xrExt(f.name);
 if(ex=='pdf'){try{window.open(await DB.pfUrl(f.path,600),'_blank','noopener')}catch(e){alert(e.message||e)}return}
 $('mb').innerHTML=`<h3 class="font-bold text-lg mb-1"><i class="fa fa-file-medical text-red-600 mr-1"></i>${H(x.kind||'File')}</h3><div class="text-sm break-all">${H(f.name)} <span class="text-gray-500">(${xrSize(f.size||0)})</span></div>${x.tooth||x.note?`<div class="text-sm text-gray-600 mt-1">${H(x.tooth||'')} ${H(x.note||'')}</div>`:''}
 <p class="text-sm mt-3">${/^(dcm|dicom|zip)$/.test(ex)?'This is a DICOM / CBCT file. On a phone tap <b>Share</b> and choose <b>IDV</b> (IMAIOS DICOM Viewer) or another DICOM viewer. On a computer tap <b>Download</b> and open it with your DICOM software.':'Tap Share to send it to another app, or Download to keep a copy.'}</p>
 <p id="xr_m" class="text-xs text-gray-500 mt-1"></p>
 <div class="flex flex-wrap justify-end gap-2 mt-4"><button type="button" id="xr_sh" class="px-4 py-2 rounded bg-red-600 text-white"><i class="fa fa-share-nodes mr-1"></i>Share (IDV / other app)</button><button type="button" id="xr_dl" class="px-4 py-2 rounded bg-gray-200"><i class="fa fa-download mr-1"></i>Download</button><button type="button" onclick="cl()" class="px-4 py-2 rounded bg-gray-100">Close</button></div>`;md.classList.replace('hidden','flex');
 const m=$('xr_m'),busy=t=>{m.textContent=t};
 $('xr_dl').onclick=async()=>{try{busy('Downloading...');const r=await xrBlob(i);xrSaveBlob(r.b,f.name);busy('Saved to your Downloads.')}catch(e){busy(e.message||String(e))}};
 $('xr_sh').onclick=async()=>{try{busy('Preparing the file...');const r=await xrBlob(i),mime=/^(dcm|dicom)$/.test(ex)?'application/dicom':(r.b.type||'application/octet-stream');let file=new File([r.b],f.name,{type:mime});
  if(!(navigator.canShare&&navigator.canShare({files:[file]}))){file=new File([r.b],f.name,{type:'application/octet-stream'})}
  if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:f.name});busy('')}
  else{xrSaveBlob(r.b,f.name);busy('This browser cannot share files, so the file was downloaded. Open it from Downloads with IDV or your DICOM viewer.')}}
  catch(e){if(e&&e.name=='AbortError')busy('');else busy('Could not share: '+(e.message||e))}}}
/* deleting a file card also removes the stored file */
{const _di=delI;delI=function(k,i){const p=gp(),x=k=='img'&&p&&p.d.img&&p.d.img[i],n=x?p.d.img.length:0,r=_di.apply(this,arguments);if(x&&x.file&&p.d.img.length<n)DB.pfDel(x.file.path).catch(()=>{});return r}}
/* the Add button of the Images section opens the new window */
{const _ai=addI;addI=async function(k){if(k=='img')return xrForm();return _ai.apply(this,arguments)}}
