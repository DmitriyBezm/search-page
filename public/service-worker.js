/** 
  Апиха возвращает в ответе картинок заголовок max-cache age-0,
  из-за чего по мере ввода поиска картинки сильно начинают мигать,
  чтобы картинки повторно не загружались был сделан этот хак
*/

const CACHE_NAME = 'image-cache-v1';

const urlsToCache = new Array(50).fill(1).map((_, index) => `https://cdn.dummyjson.com/recipe-images/${index + 1}.webp`)

// 1. Установка Service Worker и кеширование "каркаса" приложения
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кеш открыт');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Перехват fetch-запросов
self.addEventListener('fetch', event => {
  // Мы перехватываем только запросы на изображения
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Если ответ найден в кеше, возвращаем его
          if (response) {
            return response;
          }

          // Если нет, идем в сеть
          return fetch(event.request)
            .then(networkResponse => {
              // Клонируем ответ, так как его можно прочитать лишь раз
              const responseToCache = networkResponse.clone();
              
              // Сохраняем свежий ответ в кеш на будущее
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return networkResponse;
            });
        })
    );
  }
});