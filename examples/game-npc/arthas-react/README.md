# Game NPC

React front-end for interacting with [ArthasGPT](https://github.com/bennyschmidt/ArthasGPT).

https://github.com/bennyschmidt/Arthas.AI/assets/45407493/68961bf4-4f22-4847-99f1-961e696edfc2

## Background

Normally a persona's knowledge is based on content of a web page at some remote URL, but we can also serve our own pages from our own project backend. Here's a simple HTML file that contains all of The Oracle's knowledge:

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/86072177-813d-497a-a1a8-6de84115ef67)

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

This is everything The Oracle knows and can speak on. Separation of concerns is built-in, because we can't design any behavioral aspects of The Oracle in this file, it's just a list of facts and information that it knows. This is because this content is never used in any prompts (which are more generic), it just serves as a source of knowledge for this persona. For example, adding "The Oracle speaks in all caps." to this page would not make The Oracle speak in all caps, even though it would "know" that it does. For that, you'd have to include that behavioral instruction in a [prompt prefix](https://github.com/bennyschmidt/ArthasGPT/blob/master/src/utils/prefix.js). The prefix is also where you might add behavioral instruction to limit knowledge-sharing, or even conceal certain knowledge.

## The game

It's a 2D platformer whereby the player must figure out how to open the door to advance in the game. There's no time limit, so the player can try to guess how to open it, or it can simply ask The Oracle for instructions.

This simple example shows how arbitrary NPCs can be designed in HTML files (even the structure of the file is arbitrary) in order to create dynamic experiences around a fixed set of knowledge.

Art Credits:

[Fantasy Knight](https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character) by [aamatniekss](https://aamatniekss.itch.io/)

![Comparison2x](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/2055c641-4e06-45fa-82d4-80fa34ea69cd)

[The Oracle](https://leonardo.ai) by [Leonardo Kino XL](https://faq.leonardo.ai/finetuning/getting-started)

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/72c74fde-1dc3-4284-8a01-087746b05b4d)

Prompt:

> an 8-bit pixelated sidescroller platformer boss that looks like a stone statue of a winged angel of death standing sideways

[8-bit background](https://leonardo.ai) by [Leonardo Kino XL](https://faq.leonardo.ai/finetuning/getting-started)

Prompt:

> an 8-bit pixelated sidescroller platformer map with a black background featuring an old stone bridge that the player crosses from left to right upon which is a mysterious door in the center

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/d973469b-39e9-4824-89b9-7c695b143a0b)


-----

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
