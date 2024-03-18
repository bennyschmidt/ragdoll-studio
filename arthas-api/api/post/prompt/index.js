const ArthasGPT = require('arthasgpt');
const { OpenAIAgent } = require('llamaindex');

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
  waiting
} = require('arthasgpt/src/utils/strings');

const { prefixInput } = require('arthasgpt/src/utils/prefix');

/**
 * Prompt
 */

module.exports = getSessionStorage => async (req, res) => {
  const sessionStorage = getSessionStorage();
  const timeout = sessionStorage.getItem('timeout');

  let answer = sessionStorage.getItem('answer');
  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      const config = sessionStorage.getItem('config');

      body = Buffer.concat(body).toString();

      const { key, input } = JSON.parse(body || '{}');

      if (!input) {
        res.end(JSON.stringify({
          error: {
            message: 'Bad query.'
          }
        }));

        return;
      }

      const currentConfig = config[key];

      if (!currentConfig) {
        res.end(JSON.stringify({
          error: {
            message: 'Persona not found.'
          }
        }));

        return;
      }

      // Prefix input prompt

      const povPromptPrefix = prefixInput(currentConfig);

      const chatAgent = new OpenAIAgent({});

      // Create prompt transforming the user input into the third-person

      let message = `${povPromptPrefix} ${input}`;
      let messageResponse;

      // TODO: cache input by persona
      // const messageCache = recall(input);
      const messageCache = null;

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

      if (answer) {
        await answer.chat(messageResponse);
      } else {
        if (isVerbose) {
          log(CREATING_AGENT);
        }

        const newAnswer = await ArthasGPT({
          ...currentConfig,

          query: messageResponse,
          cache: true
        });

        sessionStorage.setItem('answer', newAnswer);

        answer = sessionStorage.getItem('answer');
      }

      res.end(JSON.stringify({
        success: true,
        answer
      }));
    });
};
