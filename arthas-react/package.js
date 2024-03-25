const babel = require('@babel/core');
const presetReact = require('@babel/preset-react');

const fs = require('fs').promises;

const transpileAndExport = async () => {
  const babelConfig = {
    presets: [presetReact]
  };

  const PersonaFormFile = await babel.transformFileAsync('./src/components/PersonaForm/index.js', babelConfig);
  const PersonaChatFile = await babel.transformFileAsync('./src/components/PersonaChat/index.js', babelConfig);
  const PersonaListFile = await babel.transformFileAsync('./src/components/PersonaList/index.js', babelConfig);

  await fs.writeFile('./dist/PersonaForm.js', PersonaFormFile.code);
  await fs.writeFile('./dist/PersonaChat.js', PersonaChatFile.code);
  await fs.writeFile('./dist/PersonaList.js', PersonaListFile.code);
};

transpileAndExport();
