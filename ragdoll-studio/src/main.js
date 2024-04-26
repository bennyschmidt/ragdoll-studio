const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const {
  app,
  BrowserWindow,
  MessageChannelMain
} = require('electron');

const RagdollAPI = require('ragdoll-api');

const { TEXT_TEXT_MODEL } = process.env;

const INSTALLER_WIDTH = 800;
const INSTALLER_HEIGHT = 460;
const INSTALLER_CLOSE_TIMEOUT = 2000;
const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 800;
const WINDOW_READY = 'ready-to-show';
const SERVER_READY = 'ready';
const BLACK = '#000000';
const OLLAMA_START = 'Starting Ollama...';
const OLLAMA_START_ERROR = 'Ollama is not installed.';
const OLLAMA_RUN = `Running ${TEXT_TEXT_MODEL}...`;
const OLLAMA_INSTALL = 'Installing Ollama...';
const OLLAMA_INSTALL_COMMAND = 'curl -fsSL https://ollama.com/install.sh | sh';
const MODEL_START_COMMAND = `ollama run ${TEXT_TEXT_MODEL}`;
const MODEL_READY = `Ollama (${TEXT_TEXT_MODEL}) is running.`;
const RAGDOLL_READY = 'Starting Ragdoll Studio...';

// Start the Ragdoll API

RagdollAPI({

  // Custom API routes (GET)

  GET: {},

  // Custom API routes (POST)

  POST: {}
}, store => {
  // Backend store

  console.log(store);
});

// Start the browser instance

if (app) {
  let installer = null;
  let window = null;

  // Handle start

  app.once(SERVER_READY, () => {
    // Create installer window

    installer = new BrowserWindow({
      width: INSTALLER_WIDTH,
      height: INSTALLER_HEIGHT,
      backgroundColor: BLACK,
      frame: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        devTools: false
      }
    });

    // Handle installer load

    installer.once(WINDOW_READY, async () => {
      // Send a message to the installer

      const sendMessage = message => {
        const { port1 } = new MessageChannelMain();

        installer.webContents.postMessage('message', message, [port1])
      };

      // Start Ragdoll Studio

      const onRagdollReady = () => {

        // Close the installer

        installer.close();

        // Create app window

        window = new BrowserWindow({
          width: WINDOW_WIDTH,
          height: WINDOW_HEIGHT,
          show: false,
          backgroundColor: BLACK,
          autoHideMenuBar: true,
          fullscreen: app.isPackaged,
          webPreferences: {
            devTools: !app.isPackaged
          }
        });

        // Handle load

        window.once(WINDOW_READY, async () => {
          console.log(RAGDOLL_READY);
          window.show();
        });

        // Load app screen

        window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
      };

      // Start or install ollama CLI

      const OllamaCLI = async () => {
        console.log(OLLAMA_START);
        sendMessage(OLLAMA_START);

        // Run mistral

        const mistral = async () => {
          console.log(OLLAMA_RUN);
          sendMessage(OLLAMA_RUN);
          exec(MODEL_START_COMMAND);
          console.log(MODEL_READY);
          sendMessage(MODEL_READY);
          setTimeout(onRagdollReady, INSTALLER_CLOSE_TIMEOUT);
        };

        // Exec commands

        try {
          await mistral();
        } catch (error) {
          console.log(OLLAMA_START_ERROR);
          sendMessage(OLLAMA_START_ERROR);
          console.log(OLLAMA_INSTALL);
          sendMessage(OLLAMA_INSTALL);

          await exec(OLLAMA_INSTALL_COMMAND);

          await mistral();
        }
      };

      // Start OllamaCLI

      await OllamaCLI();
    });

    // Create installer HTML and handle messages

    installer.loadURL(
      `data:text/html;charset=utf-8,
      <body>
        <style>
          @font-face {
            font-family: "Outfit Light";
            src: url("font/Outfit/static/Outfit-Light.ttf");
          }
          @font-face {
            font-family: "Outfit Medium";
            src: url("font/Outfit/static/Outfit-Medium.ttf");
          }
          body {
            font: normal normal 14px/21px "Outfit Light", monospace;
            color: white;
            margin: 0;
          }
          #message {
            position: fixed;
            left: 1rem;
            bottom: 1rem;
          }
        </style>
        <p id="message">Starting...</p>
        <script>
          const { ipcRenderer } = require('electron');
          ipcRenderer.on('message', (_, message) => {
            document.getElementById('message').innerHTML = message;
          });
        </script>
      </body>`
    );
  });
}
