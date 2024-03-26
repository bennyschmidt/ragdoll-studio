# Forum comment bot

A comment bot based on [ArthasGPT](https://github.com/bennyschmidt/ArthasGPT).

## Background

This example works more like a Slack or Discord bot, where Arthas listens for commands and responds accordingly. Instead of using slash commands, in this example Arthas just watches for any forum post that mentions his name. Whenever he's mentioned in a topic Arthas parses the question and posts the text response as a comment in the thread.

Like a Slack or Discord bot, the "bot" in this case is code that runs in a [node API](./simple-forum-api/), while the [front-end forum](./simple-forum/) is just that - a regular forum UI with no connection to Arthas. In the Slack and Discord examples there won't be front-end repos because the front-ends are Slack and Discord, respectively.

https://github.com/bennyschmidt/Arthas.AI/assets/45407493/dfb7c223-835c-4415-8199-1ef8d1481693
