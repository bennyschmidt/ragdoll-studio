const fs = require('fs').promises;
const fsSync = require('fs');
const React = require('react');

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

// Transform React/JSX to JavaScript

const babelConfig = {
  presets: [presetReact]
};

/**
 * transpileComponent
 *
 * component: string
 */

const transpileComponent = async component => {

  // Babel transform

  const file = await babel.transformFileAsync(
    `./src/components/${component}/index.js`,
    babelConfig
  );

  // Map CSS and React imports

  const fileWithCSSAndReact = file.code.replace(
    "import './index.css';",
    `import './${component}.css';\nwindow.React = React;`
  );

  // Write the transformed component file

  await fs.writeFile(`${DIRECTORY}/${component}.js`, fileWithCSSAndReact);

  // Move a copy of the CSS file to it

  await fs.copyFile(`./src/components/${component}/index.css`, `${DIRECTORY}/${component}.css`);
};

// Transpile all

COMPONENTS.map(transpileComponent);
