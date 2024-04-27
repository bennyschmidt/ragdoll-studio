const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const dotenv = require('dotenv');

const {
  app,
  BrowserWindow,
  MessageChannelMain
} = require('electron');

dotenv.config();

const { TEXT_TEXT_MODEL } = process.env;

const INSTALLER_WIDTH = 800;
const INSTALLER_HEIGHT = 460;
const INSTALLER_CLOSE_TIMEOUT = 4000;
const WINDOW_WIDTH = 1280;
const WINDOW_HEIGHT = 800;
const WINDOW_READY = 'ready-to-show';
const SERVER_READY = 'ready';
const BLACK = '#000000';
const OLLAMA_START = 'Starting Ollama...';
const OLLAMA_START_ERROR = 'Ollama is not installed.';
const OLLAMA_RUN = `Starting ${TEXT_TEXT_MODEL}...`;
const OLLAMA_INSTALL = 'Installing Ollama...';
const OLLAMA_INSTALL_COMMAND = 'curl -fsSL https://ollama.com/install.sh | sh';
const MODEL_START_COMMAND = `ollama run ${TEXT_TEXT_MODEL}`;
const MODEL_READY = `Ollama (${TEXT_TEXT_MODEL}) is running.`;
const STABLE_DIFFUSION_START = 'Starting Stable Diffusion...';
const STABLE_DIFFUSION_START_COMMAND = 'npm run start-stable-diffusion';
const STABLE_DIFFUSION_READY = 'Stable Diffusion is running.';
const STABLE_DIFFUSION_ERROR = '⚠️ Error starting Stable Diffusion API.';
const STABLE_DIFFUSION_PYTHON = 'Activating python venv...';
const STABLE_DIFFUSION_TORCH = 'Verifying torch and torchvision versions...';
const STABLE_DIFFUSION_DEPS = 'Verifying other dependencies...';
const RAGDOLL_READY = 'Starting Ragdoll Studio...';

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

      // Handle dependencies installed

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

      // Handle ollama installed

      const onOllamaReady = () => {
        console.log(MODEL_READY);
        sendMessage(MODEL_READY);

        // Start Stable Diffusion

        StableDiffusionCLI();
      };

      // Start or install ollama

      const OllamaCLI = async () => {
        console.log(OLLAMA_START);
        sendMessage(OLLAMA_START);

        // Run mistral

        const mistral = async () => {
          console.log(OLLAMA_RUN);
          sendMessage(OLLAMA_RUN);
          exec(MODEL_START_COMMAND);
          setTimeout(onOllamaReady, INSTALLER_CLOSE_TIMEOUT);
        };

        // Exec commands

        try {
          await mistral();
        } catch (error) {
          console.log(OLLAMA_START_ERROR, error);
          sendMessage(OLLAMA_START_ERROR);
          console.log(OLLAMA_INSTALL);
          sendMessage(OLLAMA_INSTALL);

          await exec(OLLAMA_INSTALL_COMMAND);

          await mistral();
        }
      };

      // Start sdapi

      const StableDiffusionCLI = () => {
        console.log(STABLE_DIFFUSION_START);
        sendMessage(STABLE_DIFFUSION_START);
        console.log(STABLE_DIFFUSION_PYTHON);
        sendMessage(STABLE_DIFFUSION_PYTHON);
        console.log(STABLE_DIFFUSION_TORCH);
        sendMessage(STABLE_DIFFUSION_TORCH);
        console.log(STABLE_DIFFUSION_DEPS);
        sendMessage(STABLE_DIFFUSION_DEPS);

        // Exec commands

        try {
          exec(STABLE_DIFFUSION_START_COMMAND);
          console.log(STABLE_DIFFUSION_READY);
          sendMessage(STABLE_DIFFUSION_READY);
          setTimeout(onRagdollReady, INSTALLER_CLOSE_TIMEOUT);
        } catch (error) {
          console.log(STABLE_DIFFUSION_ERROR, error);
          sendMessage(STABLE_DIFFUSION_ERROR);
        }
      };

      // Start Ollama

      await OllamaCLI();
    });

    // Create installer HTML and handle messages

    installer.loadURL(
      `data:text/html;charset=utf-8,
      <html>
        <head>
          <title>Ragdoll Studio</title>
        </head>
        <body style="color: white; font: normal normal 14px sans-serif;">
          <p style="position: fixed; left: 2rem; bottom: 10rem; font-size: 1.3em;"><strong>Ragdoll Studio v1.0</strong></p>
          <p style="position: fixed; left: 2rem; bottom: 8.6rem; opacity: .5; font-size: 1.2em;">The creative suite for character-driven AI experiences.</p>
          <p style="position: fixed; left: 2rem; bottom: 2.4rem; font-size: .9em;">${OLLAMA_START} 1/4</p>
          <p style="position: fixed; left: 2rem; bottom: 1rem; opacity: .5; font-size: .9em;"><em>Starting...</em></p>
          <script>
            const { ipcRenderer } = require('electron');
            ipcRenderer.on('message', (_, message) => {
              document.getElementById('message').innerHTML = message;
            });
          </script>
        </body>
      </html>`
    );
  });
}
