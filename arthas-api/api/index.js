/**
 * Session Storage
 * Manage connection (user) data
 */

const dotenv = require('dotenv');

const {
  DEFAULT_NAME,
  DEFAULT_KNOWLEDGE_URI,
  DEFAULT_ART_STYLE,
  DEFAULT_WRITING_TONE,
  DEFAULT_WRITING_STYLE
} = require('arthasgpt/src/utils/strings');

dotenv.config();

const { DELAY } = process.env;

const sessionStorage = {
  getItem: key => sessionStorage[key],
  setItem: (key, value) => sessionStorage[key] = value
};

const getSessionStorage = () => sessionStorage;

// Bootstrap some data

sessionStorage.setItem('timeout', DELAY);
sessionStorage.setItem('answer', null);

sessionStorage.setItem('config', {
  [DEFAULT_KNOWLEDGE_URI]: {
    cache: true,
    greeting: false,
    name: DEFAULT_NAME,
    knowledgeURI: DEFAULT_KNOWLEDGE_URI,
    artStyle: DEFAULT_ART_STYLE,
    writingStyle: DEFAULT_WRITING_STYLE,
    writingTone: DEFAULT_WRITING_TONE
  }
});

/**
 * API Gateway
 * Handles incoming HTTP requests
 */

module.exports = cluster => (req, res) => {
  const Routes = {
    POST: {
      '/v1/prompt': require('./post/prompt')(getSessionStorage),
      '/v1/configure': require('./post/configure')(getSessionStorage)
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
