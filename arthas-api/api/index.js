/**
 * Async Cache
 * Cache wrapper that Promisifies message
 * passing between cluster and workers
 * (so we can use async/await in endpoints)
 */

const asyncCache = {
  getItem: async storageKey => {
    const asyncGetItem = key => new Promise(resolve => {
      process.on('message', message => (
        resolve(message)
      ));

      process.send({
        command: 'STORE',
        method: 'get',
        args: [key]
      });
    });

    return asyncGetItem(storageKey);
  },
  setItem: (storageKey, storageValue) => {
    const asyncSetItem = (key, value) => new Promise(resolve => {
      process.send({
        command: 'STORE',
        method: 'set',
        args: [key, value]
      });

      resolve();
    });

    return asyncSetItem(storageKey, storageValue);
  }
};

/**
 * API Gateway
 * Handles incoming HTTP requests
 */

module.exports = (cluster, routes) => (req, res) => {
  const Routes = {
    ...routes,

    POST: {
      '/v1/prompt': require('./post/prompt')(asyncCache),
      '/v1/configure': require('./post/configure')(asyncCache),

      ...routes.POST
    }
  };

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Max-Age': 2592000
  };

  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();

    return;
  }

  if (['GET', 'POST'].includes(req.method)) {
    res.writeHead(200, headers);

    console.log(`Request handled by Worker #${cluster.worker.id}: ${req.method} ${req.url}`);

    try {
      Routes[req.method.toUpperCase()]?.[req.url]?.(req, res);
    } catch (error) {
      console.log('API error:', error);
    }

    return;
  }

  res.writeHead(405, headers);
  res.end(`${req.method} is not allowed for the request.`);
};
