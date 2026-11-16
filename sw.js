// ═══════════════════════════════════════════════════════
// Service Worker - بوابة جامعة الناجي
// ═══════════════════════════════════════════════════════

const CACHE_NAME = 'naji-pwa-v1';

// الملفات الأساسية التي تُخزَّن مؤقتاً عند التثبيت
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// ═══════════════════════════════════════════════════════
// التثبيت: تخزين الملفات الأساسية
// ═══════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn('[SW] بعض الملفات فشل تخزينها:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// ═══════════════════════════════════════════════════════
// التنشيط: حذف الكاشات القديمة
// ═══════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] حذف كاش قديم:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ═══════════════════════════════════════════════════════
// اعتراض الطلبات
// ═══════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // تجاهل الطلبات غير GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // ❌ لا تخزن طلبات Supabase (بيانات حية - تحتاج دائماً الاتصال)
  if (url.hostname.includes('supabase.co')) return;

  // ❌ لا تخزن طلبات QR Scanner
  if (url.hostname.includes('unpkg.com')) return;

  // ═══════════════════════════════════════════════════════
  // استراتيجية: Cache First ثم Network
  // ═══════════════════════════════════════════════════════
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // تحديث الكاش في الخلفية
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // غير موجود في الكاش → اطلبه من الشبكة
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => {
          // فشل الاتصال → إذا كان الطلب صفحة HTML، أعرض index.html من الكاش
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./index.html');
          }
        });
    })
  );
});
// ═══════════════════════════════════════════════════════
// رسائل من الصفحة الرئيسية
// ═══════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});