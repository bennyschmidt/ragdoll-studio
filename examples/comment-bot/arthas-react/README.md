# Comment Bot

React front-end for interacting with [ArthasGPT](https://github.com/bennyschmidt/ArthasGPT).

## Background

This example works more like a Slack or Discord bot, where Arthas listens for commands - in this case, in a forum backend - and responds accordingly. Instead of a slash command like you'd find in a chat bot, Arthas just watches for newly created topics that mention his name. If mentioned, Arthas parses the question and posts the text response as a comment in the thread.

https://github.com/bennyschmidt/Arthas.AI/assets/45407493/dfb7c223-835c-4415-8199-1ef8d1481693

-----

## Discord bot

It's as straightforward as any other Discord bot, start by setting up the basics:

![discord1](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/6ba53d70-184d-40f5-b503-5f44aaf18b42)

Decide what events you want `ArthasGPT` to get invoked for, and give Discord permissions so it can respond in the right place:

![discord2](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/152da228-1782-41d7-85ab-20e048df4d28)

Like in the forum example that invokes the bot when its name is mentioned on the forum, you can define a webhook (POST endpoint) in Discord that invokes the bot whenever Discord events happen. That way you can tie the Discord bot activity into your existing app and handle them internally like you would any other request: 

![discord3](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/2d4c35d8-264c-4051-932f-3900df46d8b7)

## Slack bot

Coming soon. TLDR: Very similar to Discord.

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
