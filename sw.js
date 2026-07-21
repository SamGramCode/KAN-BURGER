// v3
self.addEventListener('install', e => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    clients.claim().then(() => {
      clients.matchAll({ type: 'window' }).then(list => {
        list.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
      });
    })
  );
});

// Requerido por Chrome para mostrar el botón de instalación PWA
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => new Response('', { status: 408 })));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const cocina = list.find(c => c.url.includes('cocina'));
      if (cocina) return cocina.focus();
      return clients.openWindow('/cocina.html');
    })
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '🔔 KAN BURGER — Nuevo Pedido', {
      body: data.body || 'Toca para ver el pedido',
      icon: '/img/icon-192.png',
      badge: '/img/icon-192.png',
      tag: 'kan-nuevo-pedido',
      renotify: true,
      requireInteraction: true,
      vibrate: [500, 200, 500, 200, 500, 200, 500]
    })
  );
});
