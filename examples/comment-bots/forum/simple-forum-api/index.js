const process = require('node:process');
const dotenv = require('dotenv');

const ArthasAPI = require('arthas-api');

dotenv.config();

const { API_PATH_PREFIX } = process.env;

ArthasAPI({
  GET: {
    [`${API_PATH_PREFIX}/comments`]: require('./api/get/comments'),
  },
  POST: {
    [`${API_PATH_PREFIX}/comment`]: require('./api/post/comment'),
    [`${API_PATH_PREFIX}/topic`]: require('./api/post/topic')
  }
}, store => {
  store.set('comments', {
    '5b29d2f6-c16e-4603-bee5-58d930365835': {
      id: '5b29d2f6-c16e-4603-bee5-58d930365835',
      authorName: 'Anonymous User',
      topic: 'Getting started',
      text: 'Click "Create Topic" to create a new forum post. Clicking a topic title will let you navigate to the post to read and leave comments. Feel free to ask questions - enjoy the forum!',
      comments: {},
      createdAt: new Date().toDateString()
    },
      'f1107b63-ed85-4de7-b5db-9193789624ca': {
        id: 'f1107b63-ed85-4de7-b5db-9193789624ca',
        authorName: 'Anonymous User',
        topic: 'hi guyz',
        text: 'Just wanted to introduce myself 👋 how is everyone doing?',
        comments: {
          'f49b9039-1626-49cf-8bd8-7c9130d43a5f': {
            id: 'f49b9039-1626-49cf-8bd8-7c9130d43a5f',
            authorName: 'Anonymous User',
            text: 'heyyy welcome!',
            createdAt: new Date().toDateString()
          }
        },
      createdAt: new Date().toDateString()
    }
  });
});
