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

const PORT = 8000;

module.exports = (routes = { GET: {}, POST: {} }, init) => {

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
      .createServer(ApiGateway(cluster, routes))
      .listen(PORT);
  }

  if (init) {
    init(store);
  }
};
