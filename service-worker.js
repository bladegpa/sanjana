const CACHE_NAME = 'cocktail-vision-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/manifest.json',
  '/images/barista.jpg',
  '/images/barista-level2.jpg',
  '/images/barista-level4.jpg',
  '/images/barista-level6.jpg',
  '/images/barista-level8.jpg',
  '/images/barista-level10.jpg',
  '/images/cocktail.png',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap'
];

// Installa il Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Attiva il Service Worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Elimina le cache precedenti
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Strategie di caching
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - restituisci la risposta
        if (response) {
          return response;
        }
        
        // Clona la richiesta
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(
          response => {
            // Controlla se la risposta è valida
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona la risposta
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
  );
});
