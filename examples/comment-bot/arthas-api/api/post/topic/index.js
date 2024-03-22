/**
 * Topic
 * Post a new topic
 */

const { randomUUID } = require('crypto');

module.exports = asyncCache => async (req, res) => {
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      body = Buffer.concat(body).toString();

      const {
        topic = '',
        text = ''
      } = JSON.parse(body || '{}');

      if (!(/[a-zA-Z0-9-_.~%]{1,900}/).test(topic) || !(/[a-zA-Z0-9-_.~%]{1,8000}/).test(text)) {
        res.end(JSON.stringify({
          error: {
            message: 'Bad request.'
          }
        }));

        return;
      }

      const comments = await asyncCache.getItem('comments');

      const topicId = randomUUID();
      const createdAt = new Date().toISOString();

      await asyncCache.setItem('comments', {
        ...comments,

        [topicId]: {
          id: topicId,
          topic,
          text,
          comments: {},
          createdAt
        }
      });

      res.end(JSON.stringify({
        success: true
      }));
    });
};
