const CACHE_NAME = 'st-typing-v2';
const urlsToCache = [
  './',
  './index.html',
  './st_all.js',
  './st_main.css',
  './camera/camera_utils.js',
  './draw/drawing_utils.js',
  './hands/hands.js',
  './hands/hands.binarypb',
  './hands/hand_landmark_lite.tflite',
  './hands/hand_landmark_full.tflite',
  'https://unpkg.com/wanakana@4.0.2/wanakana.min.js',
];

// インストール時にキャッシュにファイルを追加
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('キャッシュ追加エラー:', err))
  );
  self.skipWaiting();
});

// アクティベーション時に古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// フェッチ時にキャッシュから返す
self.addEventListener('fetch', event => {
  // GET リクエストのみ処理
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request).then(response => {
          // 正常な応答はキャッシュに保存
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(() => {
        // ネットワークエラー時のフォールバック
        // 既存のキャッシュから返すか、エラーレスポンスを返す
        return caches.match('./index.html').then(response => {
          return response || new Response('オフラインです', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain; charset=utf-8'
            })
          });
        });
      })
  );
});
