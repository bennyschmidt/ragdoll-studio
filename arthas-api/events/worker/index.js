/**
 * Worker events
 * Handle events at the worker level
 */

module.exports = worker => {
  
  /**
   * onExit
   * Similar to the `cluster.on('exit')` event, but specific to this worker
   */

  worker.on('exit', (code, signal) => {
    const success = !signal && code !== 0;

    console.log(
      `Process exited${success ? '' : ` (killed by signal: ${signal}, error code: ${code})`}. Worker (#${worker.id}) has shut down.`
    );
  });

  /**
   * onError
   * This event is the same as the one provided by child_process.fork()
   */

  worker.on('error', error => (
    console.log(`Worker (#${worker.id}) error: ${error}`)
  ));

  /**
   * onListening
   * Similar to the cluster.on('listening') event, but specific to this worker
   */

  worker.on('listening', () => (
    console.log(`Worker (#${worker.id}) is listening for messages.`)
  ));

  /**
   * onMessage
   * Similar to the 'message' event of cluster, but specific to this worker
   */

  worker.on('message', message => (
    console.log(`Worker (#${worker.id}) received a message: ${message}.`)
  ));

  /**
   * onDisconnect
   * In a worker, this function will close all servers, wait for the 'close' event
   * on those servers, and then disconnect the IPC channel
   */

  worker.on('disconnect', () => (
    console.log(`Worker (#${worker.id}) stopped. IPC channel disconnected.`)
  ));

  /**
   * onOnline
   * The difference between 'fork' and 'online' is that fork is emitted when the primary
   * forks a worker, and 'online' is emitted when the worker is running
   */

  worker.on('online', () => (
    console.log(`Worker online (#${worker.id}).`)
  ));

  console.log(`A worker has spawned.`);
};
