/**
 * Configure
 */

module.exports = clusterStorage => async (req, res) => {
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
        writingTone
      } = JSON.parse(body || '{}');

      if (
        !name ||
        !knowledgeURI ||
        !artStyle ||
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

      const config = await clusterStorage.getItem('config');

      await clusterStorage.setItem('config', {
        ...config,

        [knowledgeURI]: {
          cache: true,
          name,
          knowledgeURI,
          avatarURL,
          artStyle,
          writingStyle,
          writingTone
        }
      });

      res.end(JSON.stringify({
        success: true
      }));
    });
};
