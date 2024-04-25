const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const { app, BrowserWindow } = require('electron');

const RagdollAPI = require('ragdoll-api');

const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 800;
const WINDOW_READY = 'ready-to-show';
const SERVER_READY = 'ready';
const BLACK = '#000000';
const OLLAMA_START = 'Starting Ollama...';
const OLLAMA_START_ERROR = 'Ollama is not installed.';
const OLLAMA_RUN = 'Running mistral...';
const OLLAMA_INSTALL = 'Installing Ollama...';
const OLLAMA_INSTALL_COMMAND = 'curl -fsSL https://ollama.com/install.sh | sh';
const MISTRAL_START_COMMAND = 'ollama run mistral';
const MISTRAL_READY = 'Ollama (mistral) is running.';
const RAGDOLL_READY = 'Done. Starting Ragdoll Studio...';

// Start or install Ollama

const ollama = async () => {
  console.log(OLLAMA_START);

  // Run mistral

  const mistral = async () => {
    console.log(OLLAMA_RUN);

    exec(MISTRAL_START_COMMAND);
    console.log(MISTRAL_READY);
  };

  // Exec commands

  try {
    await mistral();
  } catch (error) {
    console.log(OLLAMA_START_ERROR);
    console.log(OLLAMA_INSTALL);

    await exec(OLLAMA_INSTALL_COMMAND);

    await mistral();
  }
};

// Start the Ragdoll API

RagdollAPI();

// Start the browser instance

if (app) {
  let window = null;

  // Handle start

  app.once(SERVER_READY, () => {
    // Create browser window

    window = new BrowserWindow({
      width: WINDOW_WIDTH,
      height: WINDOW_HEIGHT,
      show: false,
      backgroundColor: BLACK,
      autoHideMenuBar: true,
      fullscreen: app.isPackaged,
      webPreferences: {
        devTools: !app.isPackaged,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
      }
    });

    // Load default page

    window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Handle load

    window.once(WINDOW_READY, async () => {
      await ollama();

      console.log(RAGDOLL_READY);
      window.show();
    });
  });
}
