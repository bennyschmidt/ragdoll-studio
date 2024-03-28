const RagdollAPI = require('ragdoll-api');

RagdollAPI({
  GET: {
    '/oracle': require('./api/get/oracle')
  },
  POST: {}
});
