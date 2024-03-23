const fs = require('fs').promises;
const path = require('path');

/**
 * Oracle
 * Fetch all the oracle's knowledgeURI
 */

module.exports = async (_, res) => {
  const html = await fs.readFile(path.join(__dirname, '/knowledge.html'));

  return res.end(html);
};
