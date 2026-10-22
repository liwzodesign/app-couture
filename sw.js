// Service worker file

const CACHE_NAME = 'couturier-creative-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache immediately when installing the service worker
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/home.css',
  '/js/main.js',
  '/js/home.js',
  '/js/data.js',
  '/categories/homme.html',
  '/categories/femme.html',
  '/css/category.css',
  '/js/category.js',
  '/manifest.json',
  '/offline.html',
  '/assets/icons/favicon.ico',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/logo.png'
];

// Install event - cache initial assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell and content');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  
  // Activate the service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  
  // Ensure that the service worker takes control of the page immediately
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Try to use the network
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }
          
          return await fetch(event.request);
        } catch (error) {
          console.log('[Service Worker] Navigation fetch failed, falling back to offline page', error);
          
          // If network failed, serve the offline page from cache
          const cache = await caches.open(CACHE_NAME);
          return await cache.match(OFFLINE_URL);
        }
      })()
    );
    return;
  }
  
  // For non-navigation requests, use cache-first strategy for precached assets,
  // and stale-while-revalidate for everything else
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      
      // Try to serve from cache first
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // For precached assets, return directly from cache
        if (PRECACHE_ASSETS.includes(new URL(event.request.url).pathname)) {
          return cachedResponse;
        }
        
        // For other assets, return from cache but also update cache in background
        const fetchPromise = fetch(event.request).then(async (networkResponse) => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        
        return cachedResponse || fetchPromise;
      }
      
      // If not in cache, try to fetch from network
      try {
        const networkResponse = await fetch(event.request);
        
        // Cache successful responses
        if (networkResponse.ok) {
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // For API requests or dynamic content, return a generic response
        if (event.request.url.includes('/api/')) {
          return new Response(JSON.stringify({ error: 'You are offline' }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        // For image requests, could return a placeholder
        if (event.request.destination === 'image') {
          return cache.match('/assets/images/offline-placeholder.png');
        }
        
        // For other requests, return whatever we can
        console.error('[Service Worker] Fetch failed:', error);
        return new Response('Network error happened', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: data.icon || '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Couturier Créatif', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Open the URL from the notification data if available
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is already open, open one
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});