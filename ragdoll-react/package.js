const fs = require('fs').promises;
const fsSync = require('fs');

const babel = require('@babel/core');
const presetReact = require('@babel/preset-react');

// Define an output directory and the
// components to be transpiled

const DIRECTORY = './dist';

// Define which components should be
// transformed

const COMPONENTS = [
  'RagdollCast',
  'RagdollChat',
  'RagdollForm',
  'RagdollList',
  'Icon'
];

// Define which hooks should be
// transformed

const HOOKS = [
  'useModelInfo',
  'useRagdoll'
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

  // Transform Icon imports

  const fileWithIcons = fileWithCSS.replace(
    '../Icon',
    './Icon'
  );

  // Write the transformed component file

  await fs.writeFile(`${DIRECTORY}/${component}.js`, fileWithIcons);

  if (fileWithIcons.match('index.css')) {
    // Move a copy of the CSS file to it

    await fs.copyFile(`./src/components/${component}/index.css`, `${DIRECTORY}/${component}.css`);
  }
};

/**
 * transpileComponent
 * The main transpile function
 *
 * component: string
 */

const transpileHook = async hook => {

  // Babel transform

  const file = await babel.transformFileAsync(
    `./src/hooks/${hook}/index.js`,
    babelConfig
  );

  // Write the transformed hook file

  await fs.writeFile(`${DIRECTORY}/${hook}.js`, file.code);
};

// Transpile all

COMPONENTS.map(transpileComponent);
HOOKS.map(transpileHook);
