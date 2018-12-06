var staticAssets = [
  '/.',
  'dist/main.css',
  'dist/main.js',
  'dist/jquery-3.3.1.min.js',
  'dist/loadcss.js',
  'dist/font/montserrat-light-webfont.woff2',
  'dist/font/montserrat-medium-webfont.woff',
  'dist/font/montserrat-medium-webfont.woff2',
  'dist/font/montserrat-regular-webfont.woff',
  'dist/font/montserrat-regular-webfont.woff2',
  'dist/font/montserrat-thin-webfont.ttf',
  'dist/font/montserrat-thin-webfont.woff',
  'dist/font/montserrat-thin-webfont.woff2',
  'images/weather/arror-down.svg',
  'images/weather/arror-up.svg',
  'images/weather/arrow-expand-down.svg',
  'images/weather/arrow-expand-up.svg',
  'images/weather/arrow-right.svg',
  'images/weather/cloudy-rainy.svg',
  'images/weather/cloudy-sunny.svg',
  'images/weather/cloudy.svg',
  'images/weather/icon-humidity.svg',
  'images/weather/icon-precipitation.svg',
  'images/weather/icon-wind.svg',
  'images/weather/moon.svg',
  'images/weather/search.svg',
  'images/weather/snow.svg',
  'images/weather/storm-rainy.svg',
  'images/weather/storm.svg',
  'images/weather/sunny-rainy.svg',
  'images/weather/sunny.svg',
  'images/weather/sunny.png',
  'images/icons/icon-152x152.png',
  'images/icons/icon-144x144.png',
  'images/icons/icon-192x192.png',
  'images/icons/icon-512x512.png',
  'manifest.json'
]

self.addEventListener('install', async event => {
  var cache = await caches.open('weather-static');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  var req = event.request;
  var url = new URL(req.url);

  if(url.origin === location.origin){
    event.respondWith(cacheFirst(req));
  }else{
    event.respondWith(networkFirst(req))
  }

});

async function cacheFirst(req){
  var cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
};

async function networkFirst(req){
  var cache = await caches.open('weather-dynamic');

  try{
    var res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  }catch(error){
    return await cache.match(req);
  }
}
