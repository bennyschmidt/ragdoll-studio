/**
 * Comment
 * Post a new comment
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
        topicId,
        text
      } = JSON.parse(body || '{}');

      if (!topicId || !(/[a-zA-Z0-9-_.~%]{1,8000}/).test(text)) {
        res.end(JSON.stringify({
          error: {
            message: 'Bad request.'
          }
        }));

        return;
      }

      const comments = await asyncCache.getItem('comments');

      const commentId = randomUUID();
      const createdAt = new Date().toISOString();

      await asyncCache.setItem('comments', {
        ...comments,

        [topicId]: {
          ...comments[topicId],

          comments: {
            ...comments[topicId].comments,

            [commentId]: {
              id: commentId,
              text,
              createdAt
            }
          }
        }
      });

      res.end(JSON.stringify({
        success: true
      }));
    });
};
