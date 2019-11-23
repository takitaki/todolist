module.exports = (provider) => {
    //provide is cache impl (redis, lets start from in memory for one node)
    const set = (key, item) => {
      return provider.set(key, item);
    }    
 
    const get = (key) => {
        const value = provider.get(key);
        if (value) {
            return Promise.resolve(value);
        }
    }

    const del = (key) => {
        return provider.del(key);
    }
 
    return {
      set,
      get,
      del,
    }
 }