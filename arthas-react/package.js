const fs = require('fs').promises;
const fsSync = require('fs');

const babel = require('@babel/core');
const presetReact = require('@babel/preset-react');

// Define an output directory and the
// components to be transpiled

const DIRECTORY = './dist';

const COMPONENTS = [
  'PersonaForm',
  'PersonaChat',
  'PersonaList'
];

if (!fsSync.existsSync(DIRECTORY)) {
  fsSync.mkdirSync(DIRECTORY);
}

// Preset for transforming React/JSX
// to regular JavaScript

const babelConfig = {
  presets: [presetReact]
};

/**
 * transpileComponent
 * The main transpile function
 *
 * component: string
 */

const transpileComponent = async component => {

  // Babel transform

  const file = await babel.transformFileAsync(
    `./src/components/${component}/index.js`,
    babelConfig
  );

  // Map CSS files

  const fileWithCSS = file.code.replace(
    "import './index.css';",
    `import './${component}.css';`
  );

  // Write the transformed component file

  await fs.writeFile(`${DIRECTORY}/${component}.js`, fileWithCSS);

  // Move a copy of the CSS file to it

  await fs.copyFile(`./src/components/${component}/index.css`, `${DIRECTORY}/${component}.css`);
};

// Transpile all

COMPONENTS.map(transpileComponent);
