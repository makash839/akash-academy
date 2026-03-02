self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("akash-ai").then(cache =>
      cache.addAll([
        "/",
        "/dashboard"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
