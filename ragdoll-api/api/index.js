const path = require('path');
const fs = require('fs').promises;
const process = require('node:process');
const dotenv = require('dotenv');

dotenv.config();

const {
  API_PATH_PREFIX
} = process.env;

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
 * serveStatic
 * Middleware to serve a static file
 */

const serveStatic = async (res, url) => {
  const html = await fs.readFile(path.join(__dirname, '..', url));

  return res.end(html);
};

/**
 * API Gateway
 * Handles incoming HTTP requests
 */

module.exports = (cluster, routes) => {
  if (routes.GET) {
    for (const route of Object.keys(routes.GET)) {
      if (routes.GET[route]) {
        routes.GET[route] = routes.GET[route](asyncCache);
      }
    }
  }

  if (routes.POST) {
    for (const route of Object.keys(routes.POST)) {
      if (routes.POST[route]) {
        routes.POST[route] = routes.POST[route](asyncCache);
      }
    }
  }

  routes.GET[`/${API_PATH_PREFIX}/info`] = require('./get/info')(asyncCache);
  routes.POST[`/${API_PATH_PREFIX}/prompt`] = require('./post/prompt')(asyncCache);
  routes.POST[`/${API_PATH_PREFIX}/configure`] = require('./post/configure')(asyncCache);
  routes.POST[`/${API_PATH_PREFIX}/upload`] = require('./post/upload')(asyncCache);
  routes.POST[`/${API_PATH_PREFIX}/svg`] = require('./post/svg')(asyncCache);

  return (req, res) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Max-Age': 2592000
    };

    if (req.url.slice(1, 3) !== `${API_PATH_PREFIX}`) {
      res.setHeader('Content-Type', 'text/html');
    }

    res.setHeader('Access-Control-Allow-Headers', 'content-type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204, headers);
      res.end();

      return;
    }

    if (['GET', 'POST'].includes(req.method)) {
      res.writeHead(200, headers);

      console.log(`Request handled by Worker #${cluster.worker.id}: ${req.method} ${req.url}`);

      if (req.url.match('public/documents')) {
        serveStatic(res, req.url);

        return;
      }

      try {
        routes[req.method.toUpperCase()]?.[req.url]?.(req, res);
      } catch (error) {
        console.log('API error:', error);
      }

      return;
    }

    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
  };
};
