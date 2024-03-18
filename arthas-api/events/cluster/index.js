/**
 * Cluster events
 * Handle events at the cluster level
 */

const HOST = 'http://localhost';
const PORT = 8000;

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

const store = {
  get: key => store[key],
  set: (key, value) => store[key] = value
};

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

  cluster.on('message', (worker, message) => {
    if (worker.isPrimary) return;

    const {
      command,
      method,
      args
    } = message;

    // Cluster commands

    switch (command) {
      case 'STORE':
        worker.send(
          store[method](...args)
        );

        break;

      default:
        break;
    }
  });

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

  console.log(`Cluster is online at ${HOST}:${PORT}`);
};
