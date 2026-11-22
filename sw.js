// BreatheSafe PWA - Service Worker v1.0.0
const CACHE_NAME = 'breathesafe-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/bundle.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: Precache core static shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precaching app shell...');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first for static shell, Network-first for dynamic API data
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // If requesting an API endpoint (/api/...)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and store fresh API responses in cache
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          // Offline fallback for API
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return new Response(JSON.stringify({
            offline: true,
            status: "offline",
            message: "You are currently offline. Showing cached environmental telemetry."
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // For static assets (HTML, CSS, JS, PNG, JSON): Cache First, fallback to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache for next time (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
