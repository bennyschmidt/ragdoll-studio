const { Ollama } = require('llamaindex');

// Storage utils

const {
  remember,
  recall
} = require('ragdoll-core/src/utils/storage');

// Output utils

const {
  isVerbose,
  log
} = require('ragdoll-core/src/utils/output');

// Human-readable strings

const {
  LOADED_CACHED_QUESTION,
  textModelLogPrefix,
  textTextModel,
  TEXT_TEXT_MODEL
} = require('ragdoll-core/src/utils/strings');

const { prefixInput } = require('ragdoll-core/src/utils/prefix');

/**
 * Prompt
 */

module.exports = (AsyncCache, RAGClient) => async (req, res) => {
  let answer = await AsyncCache.getItem('answer');

  let body = [];

  req
    .on('data', chunk => {
      body.push(chunk);
    })
    .on('end', async () => {
      const config = await AsyncCache.getItem('config');

      body = Buffer.concat(body).toString();

      const {
        key,
        input,
        imageInput
      } = JSON.parse(body || '{}');

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

      let messageResponse;

      const getAnswer = async isImage => (
        RAGClient.agent.chat(
          messageResponse,
          isImage ? imageInput : null
        )
      );

      if (imageInput) {
        if (RAGClient?.agent?.chat) {
          answer = await getAnswer(true);
        } else {
          await RAGClient.load({ currentConfig });

          answer = await getAnswer(true);
        }

        await RAGClient.update(answer);

        res.end(JSON.stringify({
          success: true,
          answer
        }));

        return;
      }

      // Prefix input prompt

      const povPromptPrefix = prefixInput(currentConfig);

      const chatAgent = new Ollama({
        model: TEXT_TEXT_MODEL
      });

      // Create prompt transforming the user input into the third-person

      let message = `${povPromptPrefix} ${input}`;

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
          model: TEXT_TEXT_MODEL,
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
          log(`${textTextModel} responded with "${messageResponse}".`);
        }
      }

      if (RAGClient?.agent?.chat) {
        answer = await getAnswer();
      } else {
        await RAGClient.load({ currentConfig });

        answer = await getAnswer();
      }

      await RAGClient.update(answer);

      res.end(JSON.stringify({
        success: true,
        answer
      }));
    });
};
