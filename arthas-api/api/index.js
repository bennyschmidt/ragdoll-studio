/**
 * API Gateway
 * Handles incoming HTTP requests
 */

const clusterStorage = {
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

module.exports = cluster => (req, res) => {
  const Routes = {
    POST: {
      '/v1/prompt': require('./post/prompt')(clusterStorage),
      '/v1/configure': require('./post/configure')(clusterStorage)
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

  if (['GET', 'POST'].indexOf(req.method) > -1) {
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
