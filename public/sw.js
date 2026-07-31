/* =========================================
   UTUKUR DIGITAL UNIVERSE
   SERVICE WORKER
========================================= */

const CACHE_NAME =

  "utukur-universe-v4";

/* =========================================
   STATIC ASSETS
========================================= */

const STATIC_ASSETS = [

  "/",
  "/index.html",
  "/main.css",
  "/app.js",
  "/manifest.json",

  "/favicon.ico",

  "/icons/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png"

];

/* =========================================
   INSTALL
========================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            STATIC_ASSETS
          );

        })
        .then(() => {

          return self.skipWaiting();

        })

    );

  }
);

/* =========================================
   ACTIVATE
========================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(keys => {

          return Promise.all(

            keys.map(key => {

              if (
                key !== CACHE_NAME
              ) {

                return caches.delete(
                  key
                );

              }

            })

          );

        })
        .then(() => {

          return self.clients.claim();

        })

    );

  }
);

/* =========================================
   FETCH
========================================= */

self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !==
      "GET"
    ) {

      return;

    }

    event.respondWith(

      caches.match(
        event.request
      )
      .then(cached => {

        if (cached) {

          return cached;

        }

        return fetch(
          event.request
        )
        .then(response => {

          if (
            !response ||
            response.status !== 200
          ) {

            return response;

          }

          const responseClone =
            response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {

              cache.put(
                event.request,
                responseClone
              );

            });

          return response;

        })
        .catch(() => {

          if (
            event.request.destination ===
            "image"
          ) {

            return caches.match(
              "/icons/icon-192.png"
            );

          }

        });

      })

    );

  }
);

/* =========================================
   MESSAGE
========================================= */

self.addEventListener(
  "message",
  event => {

    if (
      event.data &&
      event.data.type ===
      "SKIP_WAITING"
    ) {

      self.skipWaiting();

    }

  }
);

/* =========================================
   PUSH
========================================= */

self.addEventListener(
  "push",
  event => {

    if (!event.data) {
      return;
    }

    const data =
      event.data.json();

    self.registration.showNotification(

      data.title || "Utukur",

      {

        body:
          data.body || "",

        icon:
          "/icons/icon-192.png",

        badge:
          "/icons/icon-192.png"

      }

    );

  }
);

/* =========================================
   NOTIFICATION CLICK
========================================= */

self.addEventListener(
  "notificationclick",
  event => {

    event.notification.close();

    event.waitUntil(

      clients.openWindow("/")

    );

  }
);
