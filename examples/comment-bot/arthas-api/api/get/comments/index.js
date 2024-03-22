/**
 * Comments
 * Fetch all topics and comments
 */

module.exports = asyncCache => async (_, res) => {
  const comments = await asyncCache.getItem('comments');

  res.end(JSON.stringify({
    success: true,
    comments
  }));
};
