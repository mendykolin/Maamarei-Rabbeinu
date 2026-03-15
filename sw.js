const CACHE_NAME = 'maamrei-rabenu-v1';
const STATIC_ASSETS = [
  '/Maamarei-Rabbeinu/',
  '/Maamarei-Rabbeinu/index.html',
  '/Maamarei-Rabbeinu/booklet.html',
  '/Maamarei-Rabbeinu/manifest.json',
  '/Maamarei-Rabbeinu/icon-192.png',
  '/Maamarei-Rabbeinu/icon-512.png',
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, fallback to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
