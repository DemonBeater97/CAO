/* © 2026 MrMaik240 – CAO (Competitive Audio Optimizer). Alle Rechte vorbehalten / All rights reserved. Keine Nutzung für KI-Training / No AI training. Siehe LICENSE. */
// Offline-Speicher für CAO Konsole. Bei neuer Version CACHE hochzählen.
const CACHE = 'cao-konsole-1.2.1';
const FILES = ['./', 'index.html', 'app.css', 'boot.js', 'data.js', 'games_data.js', 'hp_catalog.js', 'console_data.js', 'app.js', 'logo.svg', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // Messdaten (GitHub) nicht abfangen
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
