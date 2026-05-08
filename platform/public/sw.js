const STATIC_CACHE = "fagu-static-v2";
const RUNTIME_CACHE = "fagu-runtime-v2";
const APP_SHELL = ["/", "/offline", "/manifest.webmanifest", "/assets/LOGO1.png"];

const STATIC_EXTENSIONS = [
  ".js",
  ".css",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".webp",
  ".ico",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const sameOrigin = requestUrl.origin === self.location.origin;
  if (!sameOrigin) return;

  // Never cache API/auth dynamic calls.
  if (
    requestUrl.pathname.startsWith("/api/") ||
    requestUrl.pathname.startsWith("/auth/") ||
    requestUrl.pathname.startsWith("/_next/webpack-hmr")
  ) {
    return;
  }

  const isPageRequest = event.request.mode === "navigate";
  const isStaticAsset = STATIC_EXTENSIONS.some((ext) => requestUrl.pathname.endsWith(ext));

  if (isPageRequest) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return caches.match("/offline");
        })
    );
    return;
  }

  if (!isStaticAsset && !requestUrl.pathname.startsWith("/_next/static/")) {
    // For non-static requests, use network-first but avoid long-lived cache growth.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const cloned = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, cloned));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          const cloned = response.clone();
          return response;
        }

        const cloned = response.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(event.request, cloned));
        return response;
      });
    })
  );
});
