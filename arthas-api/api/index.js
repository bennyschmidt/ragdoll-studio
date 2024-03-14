const dotenv = require('dotenv');

dotenv.config();

const { DELAY } = process.env;

let agent;

/**
 * API Gateway
 * Handles incoming HTTP requests
 */

const Routes = {
  POST: {
    '/v1/prompt': require('./post/prompt')({
      timeout: DELAY,
      agent
    })
  }
};

module.exports = cluster => (req, res) => {
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
