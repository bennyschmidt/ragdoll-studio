const ragdoll = require('ragdoll-core');
const { Ollama } = require('llamaindex');

// Storage utils

const {
  remember,
  recall
} = require('ragdoll-core/src/utils/storage');

// Output utils

const {
  isVerbose,
  log,
  delay
} = require('ragdoll-core/src/utils/output');

// Human-readable strings

const {
  LOADED_CACHED_QUESTION,
  CREATING_AGENT,
  languageModel,
  textModelLogPrefix,
  waiting,
  TEXT_MODEL
} = require('ragdoll-core/src/utils/strings');

const { prefixInput } = require('ragdoll-core/src/utils/prefix');

/**
 * Prompt
 */

module.exports = asyncCache => async (req, res) => {
  console.log('request')
  const timeout = await asyncCache.getItem('timeout');

  let answer = await asyncCache.getItem('answer');

  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      const config = await asyncCache.getItem('config');

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

      const chatAgent = new Ollama({
        model: TEXT_MODEL
      });

      // Create prompt transforming the user input into the third-person

      let message = `${povPromptPrefix} ${input}`;
      let messageResponse;

      const messageCache = recall(input);

      if (messageCache && messageCache.split(' ').includes(currentConfig.name)) {
        if (isVerbose) {
          log(LOADED_CACHED_QUESTION);
        }

        messageResponse = messageCache;
      } else {
        if (isVerbose) {
          log(`${textModelLogPrefix} ${message}`);
        }

        const { message: textModelResponse } = await chatAgent.chat({
          model: TEXT_MODEL,
          messages: [
            {
              role: 'user',
              content: message
            }
          ]
        });

        messageResponse = textModelResponse?.content;

        remember(input, messageResponse);

        if (isVerbose) {
          log(`${languageModel} responded with "${messageResponse}".`);
          log(waiting);
        }

        await delay(timeout);
      }

      if (isVerbose) {
        log(CREATING_AGENT);
      }

      answer = await ragdoll({
        ...currentConfig,

        query: messageResponse,
        cache: false
      });

      res.end(JSON.stringify({
        success: true,
        answer
      }));
    });
};
