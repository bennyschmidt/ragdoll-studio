/**
 * A super simple Node.js multi-process API setup:
 * - Parallelize your API
 * - Simple boilerplate to get started
 * - Deploy 1 app over a single port
 */

const { availableParallelism } = require('node:os');
const process = require('node:process');
const cluster = require('node:cluster');
const http = require('node:http');
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

const HOST = 'http://localhost';
const PORT = 8000;

/**
 * Config
 */

const numCPUs = availableParallelism();

const onCluster = require('./events/cluster');
const onWorker = require('./events/worker');

/**
 * Storage (cache)
 * Cache data in the primary for as long
 * as it runs
 */

const store = {
  get: key => store[key],
  set: (key, value) => store[key] = value
};

// Bootstrap some data

store.set('timeout', DELAY);
store.set('answer', null);

store.set('comments', {
  '5b29d2f6-c16e-4603-bee5-58d930365835': {
    id: '5b29d2f6-c16e-4603-bee5-58d930365835',
    topic: 'Getting started',
    text: 'Click "Create Topic" to create a new forum post. Clicking a topic title will let you navigate to the post to read and leave comments. Feel free to ask questions - enjoy the forum!',
    comments: {},
    createdAt: new Date().toDateString()
  },
    'f1107b63-ed85-4de7-b5db-9193789624ca': {
      id: 'f1107b63-ed85-4de7-b5db-9193789624ca',
      topic: 'hi guyz',
      text: 'Just wanted to introduce myself 👋 how is everyone doing?',
      comments: {
        'f49b9039-1626-49cf-8bd8-7c9130d43a5f': {
          id: 'f49b9039-1626-49cf-8bd8-7c9130d43a5f',
          text: 'heyyy welcome!',
          createdAt: new Date().toDateString()
        }
      },
    createdAt: new Date().toDateString()
  }
});

store.set('config', {
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

if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {

    /**
     * Worker
     * Spawn a child instance that handles requests
     */

    onWorker(cluster.fork());
  }

  /**
   * Cluster
   * Create a primary instance that serves as a load balancer
   * and manages worker lifecycle events
   */

  onCluster(cluster, store);
} else {

  /**
   * ApiGateway
   * Route traffic to handlers
   */

  const ApiGateway = require('./api');

  http
    .createServer(ApiGateway(cluster))
    .listen(PORT);
}
