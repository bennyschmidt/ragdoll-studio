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

const HOST = 'http://localhost';
const PORT = 8000;

/**
 * Config
 */

const numCPUs = availableParallelism();

const onCluster = require('./events/cluster');
const onWorker = require('./events/worker');

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

  onCluster(cluster);
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
