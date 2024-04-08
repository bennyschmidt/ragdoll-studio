/**
 * Info
 * Fetch model info
 */

const process = require('node:process');
const dotenv = require('dotenv');

dotenv.config();

const {
  TEXT_MODEL_PROVIDER,
  TEXT_TEXT_MODEL,
  IMAGE_MODEL_URI,
  TEXT_IMAGE_MODEL,
  IMAGE_IMAGE_MODEL,
  npm_package_version
} = process.env;

module.exports = () => (_, res) => (
  res.end(JSON.stringify({
    success: true,
    textModelProvider: TEXT_MODEL_PROVIDER,
    textTextModel: TEXT_TEXT_MODEL,
    imageModelProviderURI: IMAGE_MODEL_URI,
    textImageModel: TEXT_IMAGE_MODEL,
    imageImageModel: IMAGE_IMAGE_MODEL,
    version: npm_package_version
  }))
);
