/* André Cavalcante PWA — service worker
   Strategy: stale-while-revalidate for same-origin GETs.
   Bump CACHE_VERSION when shipping changes that must invalidate. */

const CACHE_VERSION = "v9";
const CACHE_NAME = `andre-${CACHE_VERSION}`;
// Thumbnails live in their own cache so a version bump doesn't wipe them.
const THUMB_CACHE = "andre-thumbs";

const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/css/style.css",
  "/js/app.js",
  "/js/tuner.js",
  "/js/metronome.js",
  "/data/songs.json",
  "/data/shows.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== THUMB_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // YouTube thumbnails: cache-first so songs keep their artwork offline.
  if (url.hostname === "i.ytimg.com") {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Only handle same-origin requests; let other cross-origin (fonts, Spotify,
  // YouTube embeds) hit the network directly.
  if (url.origin !== self.location.origin) return;

  // Never cache the SW itself.
  if (url.pathname === "/service-worker.js") return;

  event.respondWith(staleWhileRevalidate(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(THUMB_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    // Opaque responses (cross-origin <img>) are fine to store and replay.
    if (res && (res.ok || res.type === "opaque")) {
      cache.put(req, res.clone());
    }
    return res;
  } catch (_) {
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  // ignoreSearch so versioned asset URLs (style.css?v=3) match precached paths.
  const cached = await cache.match(req, { ignoreSearch: true });
  const fetchPromise = fetch(req)
    .then((res) => {
      if (res && res.ok && res.type === "basic") {
        cache.put(req, res.clone());
      }
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}
