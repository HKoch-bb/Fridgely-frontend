/* ── Fridgely Service Worker ── */
const CACHE_NAME = "fridgely-v1";
const OFFLINE_URL = "/offline.html";

/* Assets to cache immediately on install */
const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

/* ── Install ── */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

/* ── Activate — clear old caches ── */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch strategy ──
   - API calls: Network first, no cache
   - Static assets: Cache first, fallback network
   - Navigation: Network first, fallback to cached /
*/
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and chrome-extension requests */
  if (request.method !== "GET") return;
  if (url.protocol === "chrome-extension:") return;

  /* API calls — always network, never cache */
  if (
    url.hostname.includes("onrender.com") ||
    url.hostname.includes("openfoodfacts.org") ||
    url.pathname.startsWith("/api/")
  ) {
    event.respondWith(
      fetch(request).catch(() => new Response("Offline", { status: 503 }))
    );
    return;
  }

  /* Navigation requests — network first, fallback to index */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches.match("/").then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  /* Static assets — cache first */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === "opaque") {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL));
    })
  );
});

/* ── Background sync placeholder ── */
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-pantry") {
    /* Future: sync pantry changes when back online */
    console.log("[SW] Background sync: pantry");
  }
});
