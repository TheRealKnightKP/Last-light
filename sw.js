// LAST LIGHT service worker — scoped to /last-light/ only, separate from Galactic Horizons' sw.js
const CACHE="lastlight-51fa8c9a";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("lastlight-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// pages: network first so updates land, cache when offline · everything else: cache first
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(k=>k.put("./index.html",c));return res}).catch(()=>caches.match("./index.html")));return}
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c))}return res})))});
