const CACHE_NAME = 'nexus-vault-v1';
const OFFLINE_URL = '/index.html';
const urlsToCache = [
    '/',
    '/index.html',
    '/team.html',
    '/styles.css',
    '/script.js',
    '/data.js',
    '/pfps/nexus.png',
    '/pfps/me.png',
    '/pfps/7vex.png',
    '/manifest.json'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => {
                return cache.addAll(urlsToCache);
            }),
            // Cache offline page
            caches.open(CACHE_NAME).then(cache => {
                return cache.add(OFFLINE_URL);
            })
        ])
    );
    // Force service worker to become active
    self.skipWaiting();
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('nexus-vault-') && cacheName !== CACHE_NAME;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            // Take control of all pages under this service worker's scope
            return self.clients.claim();
        })
    );
});

// Fetch resources from network or cache
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    // Check if we received a valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            // Don't cache if it's a script download
                            if (!event.request.url.includes('/scripts/')) {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return response;
                }).catch(() => {
                    // If offline and requesting a page, show offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }
                });
            })
    );
});
