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
  textModelLogPrefix,
  waiting,
  TEXT_TEXT_MODEL
} = require('ragdoll-core/src/utils/strings');

/**
 * Prompt
 */

module.exports = asyncCache => async (req, res) => {
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

      const {
        key,
        question,
        svgInput
      } = JSON.parse(body || '{}');

      if (!svgInput) {
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

      const chatAgent = new Ollama({
        model: TEXT_TEXT_MODEL
      });

      // Prefix svgInput prompt

      const svgPrefix = `Barely modify some of the values of some of the attributes in this SVG code, leaving many of them unchanged, to depict a slightly different version that looks more like a ${question}. Here is the code:`;

      // Create prompt transforming the svgInput into the output instruction

      let message = `${svgPrefix} ${svgInput}`;

      const messageCache = recall(svgInput);

      const getMessageResponse = async () => {
        let messageResponse;

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

          remember(svgInput, messageResponse);

          if (isVerbose) {
            log(`${TEXT_TEXT_MODEL} responded with "${messageResponse}".`);
            log(waiting);
          }

          await delay(timeout);
        }

        return messageResponse;
      };

      const messageResponse1 = await getMessageResponse();

      const messageResponse2 = await getMessageResponse();

      const imageResponse1 = messageResponse1.slice(
        messageResponse1.indexOf('<'),
        messageResponse1.lastIndexOf('</') + 6
      );

      const imageResponse2 = messageResponse2.slice(
        messageResponse2.indexOf('<'),
        messageResponse2.lastIndexOf('</') + 6
      );

      answer = {
        imageResponse1,
        imageResponse2
      };

      res.end(JSON.stringify({
        success: true,
        answer
      }));
    });
};
