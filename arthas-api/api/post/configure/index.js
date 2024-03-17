/**
 * Configure
 */

module.exports = getSessionStorage => async (req, res) => {
  const sessionStorage = getSessionStorage();

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

      const config = sessionStorage.getItem('config');

      sessionStorage.setItem('config', {
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
