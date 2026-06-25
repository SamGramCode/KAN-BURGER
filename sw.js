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

// Mantener SW activo para notificaciones en segundo plano
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '🔔 KAN BURGER — Nuevo Pedido', {
      body: data.body || 'Toca para ver el pedido',
      icon: '/img/logo.jpg',
      badge: '/img/logo.jpg',
      tag: 'kan-nuevo-pedido',
      renotify: true,
      requireInteraction: true,
      vibrate: [500, 200, 500, 200, 500, 200, 500]
    })
  );
});

// Forzar activación inmediata
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
