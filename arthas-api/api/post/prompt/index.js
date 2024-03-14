const ArthasGPT = require('arthasgpt');
const { OpenAIAgent } = require('llamaindex')

// Storage utils

const {
  remember,
  recall
} = require('arthasgpt/src/utils/storage');

// Output utils

const {
  isVerbose,
  log,
  delay
} = require('arthasgpt/src/utils/output');

// Human-readable strings

const {
  LOADED_CACHED_QUESTION,
  CREATING_AGENT,
  languageModel,
  gptLogPrefix,
  waiting,
  povPromptPrefix
} = require('arthasgpt/src/utils/strings');

// Persona configs

const { KNOWLEDGE_URI } = require('arthasgpt/src/utils/persona');

module.exports = ({ timeout, agent }) => async (req, res) => {
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      body = Buffer.concat(body).toString();

      const { input } = JSON.parse(body || '{}');

      if (!input) {
        res.end(JSON.stringify({
          error: {
            message: 'Bad request.'
          }
        }));

        return;
      }

      const chatAgent = new OpenAIAgent({});

      // Create prompt transforming the user input into the third-person

      let message = `${povPromptPrefix} ${input}`;
      let messageResponse;

      const messageCache = recall(input);

      if (messageCache) {
        if (isVerbose) {
          log(LOADED_CACHED_QUESTION);
        }

        messageResponse = messageCache;
      } else {
        if (isVerbose) {
          log(`${gptLogPrefix} ${message}`);
        }

        const { response: gptResponse } = await chatAgent.chat({
          message
        });

        messageResponse = gptResponse;

        remember(input, messageResponse);

        if (isVerbose) {
          log(`${languageModel} responded with "${messageResponse}".`);
          log(waiting);
        }

        await delay(timeout);
      }

      if (agent) {
        await agent.chat(messageResponse);
      } else {
        if (isVerbose) {
          log(CREATING_AGENT);
        }

        agent = await ArthasGPT(
          KNOWLEDGE_URI,
          messageResponse,
          true
        );
      }

      res.end(JSON.stringify({
        success: true,
        answer: {
          imageURL: agent.imageURL,
          text: agent.text
        }
      }));
    });
};
