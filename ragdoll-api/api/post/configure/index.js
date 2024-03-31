/**
 * Configure
 */

module.exports = asyncCache => async (req, res) => {
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      body = Buffer.concat(body).toString();

      const {
        name,
        knowledgeURI,
        avatarURL,
        artStyle,
        writingStyle,
        writingTone,
        additionalKnowledgeURIs
      } = JSON.parse(body || '{}');

      if (
        !name ||
        !knowledgeURI ||
        !writingStyle ||
        !writingTone
      ) {
        res.end(JSON.stringify({
          error: {
            message: 'Bad request.'
          }
        }));

        return;
      }

      const config = await asyncCache.getItem('config');

      await asyncCache.setItem('config', {
        ...config,

        [knowledgeURI]: {
          cache: true,
          name,
          knowledgeURI,
          avatarURL,
          artStyle,
          writingStyle,
          writingTone,
          additionalKnowledgeURIs
        }
      });

      res.end(JSON.stringify({
        success: true
      }));
    });
};
