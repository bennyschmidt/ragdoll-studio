/**
 * Upload
 */

const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');

module.exports = asyncCache => async (req, res) => {
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      const config = await asyncCache.getItem('config');

      body = Buffer.concat(body).toString();

      const { key, knowledge } = JSON.parse(body || '{}');

      if (!knowledge) {
        res.end(JSON.stringify({
          error: {
            message: 'Bad query.'
          }
        }));

        return;
      }

      const currentConfig = config[key];

      if (!currentConfig) {
        res.end(JSON.stringify({
          error: {
            message: 'Persona not found.'
          }
        }));

        return;
      }

      const documentId = randomUUID();
      const localFileURL = `http://localhost:8000/public/documents/${documentId}.txt`;

      await fs.writeFile(
        path.join(__dirname, `../../../public/documents/${documentId}.txt`),
        knowledge
      );

      const additionalKnowledgeURIs = [
        ...currentConfig.additionalKnowledgeURIs,

        localFileURL
      ];

      res.end(JSON.stringify({
        success: true,
        additionalKnowledgeURIs
      }));
    });
};
