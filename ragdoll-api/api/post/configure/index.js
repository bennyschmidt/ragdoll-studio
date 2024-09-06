/**
 * Configure
 */

module.exports = (AsyncCache, RAGClient) => async (req, res) => {
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

      const currentConfig = {
        name,
        knowledgeURI,
        avatarURL,
        artStyle,
        writingStyle,
        writingTone,
        additionalKnowledgeURIs,
        cache: false
      };

      const ragdoll = await RAGClient.load({
        currentConfig
      });

      RAGClient.update(ragdoll);

      const config = await AsyncCache.getItem('config');

      await AsyncCache.setItem('config', {
        ...config,

        [knowledgeURI]: currentConfig
      });

      res.end(JSON.stringify({
        success: true
      }));
    });
};
