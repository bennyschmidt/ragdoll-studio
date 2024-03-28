/**
 * Cluster events
 * Handle events at the cluster level
 */

module.exports = (cluster, cache) => {

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

  cluster.on('message', (worker, message) => {
    if (worker.isPrimary) return;

    const { command } = message;

    // Cluster commands

    switch (command) {
      case 'STORE':
        const {
          method,
          args
        } = message;

        worker.send(
          cache[method](...args)
        );

        break;

      default:
        break;
    }
  });

  console.log('Cluster is online.');
};
