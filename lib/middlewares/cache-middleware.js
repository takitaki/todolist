
var cacheMiddleware = (cache) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = cache.get(key)
    if (cachedBody) {
      console.log("from cache");
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        cache.set(key, body);
        res.sendResponse(body)
      }
      next()
    }
  }
}

module.exports = cacheMiddleware;

  