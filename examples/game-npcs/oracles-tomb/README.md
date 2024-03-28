# A game NPC in *Oracle's Tomb*

A game NPC example with [ragdoll](https://github.com/bennyschmidt/ragdoll).

https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/c13c21ff-bab0-4831-b6f9-17a63cfa7d9c

## Background

Normally a persona's knowledge is based on content of a web page at some remote URL, but in [*Oracle's Tomb*](./oracles-tomb-api/) we serve our own pages from our the project backend. Here's a simple HTML file that contains all of The Oracle's knowledge:

![image](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/86072177-813d-497a-a1a8-6de84115ef67)

It's just simple HTML:

```
<!DOCTYPE html>
<html>
  <head>
    <title>Knowledge of the Oracle</title>
  </head>
  <body>
    <h1>The Oracle</h1>
    <p>The Oracle is an all-wise deity in the form of a statue placed outside of a mysterious tomb. Adventurers from all over the world visit The Oracle in an attempt to understand her mysteries.</p>

    <h2>Setting</h2>
    <p>An old stone tomb on a grassy ledge enshrouded in old trees and darkness with a full moon in the sky and owls that can be heard in the distance. The front of the tomb has a wooden door that is closed and locked.</p>

    <h2>Game Information</h2>
    <p>This game is called "Oracle's Tomb". It's a 2D platformer where the player has to solve mysteries in order to advance.</p>
    <p>The player can exit the game by closing the browser tab.</p>
    <p>The player can start over by refreshing the page.</p>
    <p>The player can move by using A and D or the left and right arrow keys.</p>
    <p>There is no way to jump in this game.</p>
    <p>There is no combat in this game.</p>

    <h2>Game Lore</h2>
    <p>The player is the adventurer.</p>
    <p>The Oracle is not an adventurer.</p>
    <p>The adventurer is on the bridge with The Oracle.</p>
    <p>The door's password is "CORPSE FLOWER".</p>
    <p>The adventurer can open the door by standing in front of it and saying the door's password.</p>
  </body>
</html>
```

This is everything The Oracle knows and can speak on. Separation of concerns is built-in, because we can't design any behavioral aspects of The Oracle in this file, it's just a list of facts and information that it knows. This is because this content is never used in any prompts (which are more generic), it just serves as a source of knowledge for this persona. For example, adding "The Oracle speaks in all caps." to this page would not make The Oracle speak in all caps, even though it would "know" that it does. For that, you'd have to include that behavioral instruction in a [prompt prefix](https://github.com/bennyschmidt/ragdoll/blob/master/src/utils/prefix.js). The prefix is also where you might add behavioral instruction to limit knowledge-sharing, or even conceal certain knowledge.

## The game

It's a 2D platformer whereby the player must figure out how to open the door to advance in the game. There's no time limit, so the player can try to guess how to open it, or it can simply ask The Oracle for instructions.

This simple example shows how arbitrary NPCs can be designed in HTML files (even the structure of the file is arbitrary) in order to create dynamic experiences around a fixed set of knowledge.

Art Credits:

[Fantasy Knight](https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character) by [aamatniekss](https://aamatniekss.itch.io/)

![Comparison2x](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/2055c641-4e06-45fa-82d4-80fa34ea69cd)

[The Oracle](https://leonardo.ai) by [Leonardo Kino XL](https://faq.leonardo.ai/finetuning/getting-started)

![image](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/72c74fde-1dc3-4284-8a01-087746b05b4d)

Prompt:

> an 8-bit pixelated sidescroller platformer boss that looks like a stone statue of a winged angel of death standing sideways

[8-bit background](https://leonardo.ai) by [Leonardo Kino XL](https://faq.leonardo.ai/finetuning/getting-started)

Prompt:

> an 8-bit pixelated sidescroller platformer map with a black background featuring an old stone bridge that the player crosses from left to right upon which is a mysterious door in the center

![image](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/d973469b-39e9-4824-89b9-7c695b143a0b)
