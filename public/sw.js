
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "MOON 🌙",
      body: event.data?.text() || "Você tem novidades.",
    };
  }

  const title = data.title || "MOON 🌙";
  const options = {
    body: data.body || "Você tem novidades esperando por você.",
    icon: data.icon || "/apple-touch-icon.png",
    badge: data.badge || "/apple-touch-icon.png",
    tag: data.tag || "moon-push",
    data: data.data || { url: "/" },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  ).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }

        return clients.openWindow(targetUrl);
      })
  );
});
