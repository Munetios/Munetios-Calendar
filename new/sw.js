const CACHE_NAME = "munetios-cache-v2";

const urlsToCache = [
  "./",
  "index.html",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "favicon.ico",
  "manifest.json",
  "site.webmanifest",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "./index.html",
    "tasks.html",
      "/new",
    "/new/meals/index.html",
     "/new/meals/",
      "/new/meals/favicon.ico",
    "/new/meals/apple-touch-icon.png",
  "https://api.munetios.com/beautiful-css/beautiful.css",
  "https://api.munetios.com/fonts/google-sans-flex/googlesansflex.ttf",
  "https://api.munetios.com/fonts/material-symbols/MaterialSymbolsRounded-VariableFont_FILL,GRAD,opsz,wght.ttf",
  "https://api.munetios.com/fonts/inter/inter.ttf",
  "https://api.munetios.com/fonts/open-sans/opensans.ttf",
  "https://api.munetios.com/fonts/roboto/roboto.ttf",
  "https://api.munetios.com/fonts/google-sans/googlesans.ttf",
  "https://api.munetios.com/fonts/lexend/lexend.ttf",
  "https://api.munetios.com/fonts/poppins/Poppins-Regular.ttf"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      await Promise.allSettled(
        urlsToCache.map(url =>
          cache.add(url).catch(err => {
            console.warn("Failed to cache:", url, err);
          })
        )
      );
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, clone);
            });
          }

          return response;
        })
        .catch(() => {
          return cached || caches.match("./index.html");
        });
    })
  );
});
