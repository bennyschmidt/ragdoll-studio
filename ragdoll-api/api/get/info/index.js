/**
 * Info
 * Fetch model info
 */

const process = require('node:process');
const dotenv = require('dotenv');

dotenv.config();

const {
  LLM_FRAMEWORK,
  TEXT_MODEL,
  STABLE_DIFFUSION_URI,
  IMAGE_MODEL,
  npm_package_version
} = process.env;

module.exports = () => (_, res) => {
  res.end(JSON.stringify({
    success: true,
    framework: LLM_FRAMEWORK,
    textModel: TEXT_MODEL,
    stableDiffusionURI: STABLE_DIFFUSION_URI,
    stableDiffusionImageModel: IMAGE_MODEL,
    version: npm_package_version
  }));
};
