'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "38ad65b103f13b5c905d60d17ee97cfa",
"version.json": "548ad9265872faaf02d0a5c2811391e9",
"index.html": "6c77349959d3db01b11284528ce5e12c",
"/": "6c77349959d3db01b11284528ce5e12c",
"main.dart.js": "9dd01b1d3e70911db70abfa4a0b9055e",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"icons/favicon-16x16.png": "ce3129e6260f67dcbf63bde75336176a",
"icons/favicon.ico": "960d3a18825ddd41cc6fb16dd210868d",
"icons/android-chrome-192x192.png": "be35b1398a5542674070d221d0d952cb",
"icons/apple-touch-icon.png": "ad3cabf654a3bf2d875483f2726d1424",
"icons/android-chrome-512x512.png": "e1db21e5bd10d259f9e6fb2adb8fb45d",
"icons/site.webmanifest": "053100cb84a50d2ae7f5492f7dd7f25e",
"icons/favicon-32x32.png": "f6bc1c8606d19ddc6743c32cc9d24915",
"manifest.json": "123cde7bbff63c69dd59a6a6830dc15c",
"assets/AssetManifest.json": "6620c6078abf198ad5a450c4dc7711f0",
"assets/NOTICES": "e59181062a136916372eb7725d4e65ff",
"assets/FontManifest.json": "02e8a8ac811d8311420f9447506ff194",
"assets/AssetManifest.bin.json": "2e20acc17bb80540dbd19b561195b623",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "0eb37fe748562fc06939444f2aca9857",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"assets/assets/img_bg_chat.png": "acaaac8b560fce3315e3a988552aa8fb",
"assets/assets/ic_refresh.png": "04d8771d0117828560bf25768065afed",
"assets/assets/ic_app_store.svg": "27a03284cfd69bffcdf80804ba5c51a1",
"assets/assets/4.webp": "b51e76732d7ad7cf16663cc736e3b827",
"assets/assets/3.webp": "963db5947195b0d2034b2a050ae1bb09",
"assets/assets/2.webp": "ed343daef30ffd0ee24f153c16194590",
"assets/assets/ic_robot.png": "45936fffa951f5ff91dd2c7bab5cbc42",
"assets/assets/img_bg_home.png": "16a95235d55d4690070d0732b872474c",
"assets/assets/1.webp": "b6c373f480b6c39327862e11ae8f1393",
"assets/assets/img_bg_leaderboard.png": "3e44a1282474da47169236a2fa727cf9",
"assets/assets/0.webp": "df44591051d566ef49c7152a0b0771f8",
"assets/assets/ic_send.png": "5635813ad342355608c47cc0a2633fe8",
"assets/assets/ic_person.png": "a47f30d0dd2506397b171b6d647cc6d6",
"assets/assets/ic_google_play.png": "a7b568088f99f4aa1e1d6a11571f3e68",
"assets/assets/img_bg_splash.png": "a7959af270635d7097b9a339b7a529df",
"assets/assets/fonts/ProFont/ProFont%2520Bold%2520For%2520Powerline.ttf": "9d68c2d723af9520faa6a4f5df492fa4",
"assets/assets/fonts/ProFont/ProFont%2520For%2520Powerline.ttf": "57378baaca97af1c5b30bebecb474ddf",
"assets/assets/fonts/NanumSquareNeo/NanumSquareNeo-Variable.ttf": "d22e2a9d7ed6b5317bedc5efae07798b",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
