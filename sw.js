/* SmartDent service worker: opens the app with no internet. Patient data is never cached here (the app keeps its own copy). */
const V='smartdent-v2',SCOPE=self.registration.scope;
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.add(SCOPE)).then(()=>self.skipWaiting()).catch(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(/supabase\.co$/.test(u.hostname)||u.pathname.startsWith('/api/')||u.pathname.endsWith('/sw.js'))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{if(x&&x.ok){const cp=x.clone();caches.open(V).then(c=>c.put(SCOPE,cp))}return x}).catch(()=>caches.match(SCOPE).then(h=>h||new Response('Offline',{status:503}))));return}
 e.respondWith(caches.open(V).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque'))c.put(r,x.clone());return x}).catch(()=>hit);return hit||net})))});
