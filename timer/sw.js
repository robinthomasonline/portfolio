// Service Worker for Work Timer PWA
const CACHE_NAME = 'work-timer-v1';
const urlsToCache = [
  './index.html',
  './timer.css',
  './timer.js',
  './beep.mp3',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, { mode: 'no-cors' }).catch(() => {
            // If request fails, continue with other resources
            return null;
          });
        })).catch((error) => {
          console.log('Cache addAll failed:', error);
          // Cache what we can
          return Promise.all(
            urlsToCache.map(url => {
              return fetch(url).then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              }).catch(() => {
                // Ignore failed requests
              });
            })
          );
        });
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Handle navigation requests (page loads)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('./index.html');
        })
    );
    return;
  }

  // For same-origin requests, try cache first
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(event.request);
        })
    );
  } else {
    // For external resources (fonts, CDN), fetch from network
    event.respondWith(fetch(event.request));
  }
});

