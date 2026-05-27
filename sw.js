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
