/**
 * Cluster events
 * Handle events at the cluster level
 */

const HOST = 'http://localhost';
const PORT = 8000;

module.exports = cluster => {

  /**
   * onExit
   * Called when a Node.js process exits for some reason
   */

  cluster.on('exit', (code, signal) => {
    const success = !signal && code !== 0;

    console.log(
      `Process exited${success ? '' : ` (killed by signal: ${signal}, error code: ${code})`}. Cluster has shut down.`
    );
  });

  /**
   * onError
   * Handle process errors
   */

  cluster.on('error', error => (
    console.log(`Cluster error: ${error}`)
  ));

  /**
   * onMessage
   * Handle messages to the primary
   */

  cluster.on('message', message => (
    console.log(`Cluster received a message: ${message}.`)
  ));

  console.log(`Cluster is online at ${HOST}:${PORT}`);
};
