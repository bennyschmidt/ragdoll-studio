const ArthasAPI = require('arthas-api');

ArthasAPI({
  GET: {
    '/oracle': require('./api/get/oracle')
  },
  POST: {}
});
