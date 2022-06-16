var cacheName = 'ryans-cache-v1';
var cacheAssets = [
    '/', '/offline.html'
];

// Call install Event
self.addEventListener('install', e => {
    // Wait until promise is finished 
    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log(`Service Worker: Caching Files: ${cache}`);
                cache.addAll(cacheAssets)
                    // When everything is set
                    .then(() => self.skipWaiting())
            })
    );
})

// Call Activate Event
self.addEventListener('activate', e => {
    console.log('Service Worker: Activated');
    // Clean up old caches by looping through all of the
    // caches and deleting any old caches or caches that
    // are not defined in the list
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(
                    cache => {
                        if (cache !== cacheName) {
                            console.log('Service Worker: Clearing old cache ' + cache);
                            return caches.delete(cache);
                        }
                    }
                )
            )
        })
    );
})

var isValid = function (response) {
    if (!response) return false;
    var fetched = response.headers.get('sw-fetched-on');
    if (fetched && (parseFloat(fetched) + (1000 * 60 * 60)) > new Date().getTime()) return true;
    return false;
};

//self.addEventListener('fetch', function (event) {
//event.respondWith(
//fetch(event.request).then(function(networkResponse) {
//return networkResponse
//})
//)
//})

//self.addEventListener('fetch', function (e) {
    //var requestURL = new URL(e.request.url);
    //console.log('Service Worker: Fetching ', e.request);
    //e.respondWith(
        //caches.open(cacheName)
            //.then(function (cache) {
                //return cache.match(e.request)
                    //.then(function (cacheResponse) {
                        //return fetch(e.request)
                            //.then(function (networkResponse) {
                                //console.log("1", networkResponse, cache, cacheResponse)
                                //if (networkResponse.ok && requestURL.origin == location.origin && e.request.method == "GET") {
                                    //var res_clone = networkResponse.clone();
                                    //var headers = new Headers(res_clone.headers);
                                    //headers.append('sw-fetched-on', new Date().getTime());
                                    //res_clone.blob().then(body => {
                                        //cache.put(e.request, new Response(body, {status: res_clone.status, statusText: res_clone.statusText, headers: headers}))
                                    //})
                                //}
                                //console.log(cacheResponse, networkResponse)
                                //if (isValid(cacheResponse)) {
                                    //return cacheResponse
                                //}
                                //return networkResponse || cacheResponse
                            //})
                    //})
            //})    )

//});

// Call Fetch Event 
self.addEventListener('fetch', e => {
    var requestURL = new URL(e.request.url);
    console.log('Service Worker: Fetching ', e.request);
    e.respondWith(
        caches.open(cacheName).then(cache => {
            var fresh_response = fetch(e.request).then(res => {
                if (res.ok && requestURL.origin == location.origin && e.request.method == "GET") {
                    var res_clone = res.clone();
                    var headers = new Headers(res_clone.headers);
                    headers.append('sw-fetched-on', new Date().getTime());
                    res_clone.blob().then(body => {
                        cache.put(e.request, new Response(body, {status: res_clone.status, statusText: res_clone.statusText, headers: headers}))
                    })
                }
                return res;
            }).catch(err => {
                return caches.match(e.request).then(function (res) {
                    return res || caches.match('/offline.json');
                });
            })
            if (requestURL.origin == location.origin ){
                return cache.match(e.request).then(res => {
                    if (isValid(res)) {
                        return res
                    }
                    return fresh_response
                }).catch(err => {
                    return fresh_response
                })
            }
            return fresh_response
        }));
});

