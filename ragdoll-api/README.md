# Ragdoll API

A parallelized Node.js API for interacting with [Ragdoll](https://github.com/bennyschmidt/ragdoll).

#### .env

Create an `.env` file in the project's root directory with the following variables:

```
TEXT_MODEL_PROVIDER=LlamaIndex
TEXT_MODEL_URI=http://localhost:11434
TEXT_TEXT_MODEL=mistral
IMAGE_MODEL_PROVIDER=Stable Diffusion
IMAGE_MODEL_URI=http://localhost:7861
TEXT_IMAGE_MODEL=txt2img
IMAGE_IMAGE_MODEL=img2img
IMAGE_CFG_SCALE=8;
IMAGE_CFG_SCALE_TRUE=24;
IMAGE_DENOISING_STRENGTH=0.8;
IMAGE_DENOISING_STRENGTH_TRUE=0.56;
DELAY=200
RENDER=true
VERBOSE=true
GREETING=false
CACHE=true
MAX_STORAGE_KEY_LENGTH=32
LOG_PREFIX=<Ragdoll>
STORAGE_URI=./.tmp
```

See [ragdoll Environment Config](https://github.com/bennyschmidt/ragdoll#env-scaffold).

-----

## Endpoints

### Model Info

Upload files for continuous learning.

`GET /v1/info`

Returns

```
{
  success: boolean,
  textModelProvider: string,
  textTextModel: string,
  imageModelProviderURI: string,
  textImageModel: string,
  imageImageModel: string,
  version: string
}
```

### Configure

Load the context of a ragdoll in order to prompt it.

`POST /v1/configure`

**name**: `string`

> The ragdoll's name.

**knowledgeURI**: `string`

> The knowledge source - typically a web page (like a Wiki style article). `knowledgeURI` is also the unique identifier (or `key`) for a ragdoll when looking them up.

**avatarURL**: `string`

> The ragdoll's profile image.

**artStyle**: `string`

> If/when images are rendered, the desired art style that is injected to the image model prompt. Set to `null` to skip image generation.

**writingStyle**: `string`

> When text is written, the desired writing style that is injected to the text model prompt.

**writingTone**: `string`

> Aesthetical text prompting beyond basic structure.

Returns


```
{
  success: boolean
}
```

### Prompt

`POST /v1/prompt`

Prompt the ragdoll with a question.

**key**: `string`

> The ragdoll's identifier (the same as its `knowledgeURI` upon configuration).

**input**: `string`

> The question being asked.

Returns

```
{
  success: boolean,
  answer: {
    image: buffer,
    imageURL: string,
    text: string
  }
}
```

### Upload

Upload files for continuous learning.

`POST /v1/upload`

**key**: `string`

> The ragdoll's identifier (the same as its `knowledgeURI` upon configuration).

**knowledge**: `string`

> The text content of the document.

Returns

```
{
  success: boolean,
  additionalKnowledgeURIs: string[]
}
```

## Library documentation

You can use `RagdollAPI` as a library in your existing application.

`npm i ragdoll-api`

Serverless functions (exportable):
- `info`
- `configure`
- `prompt`
- `upload`

Extending the API:

`RagdollAPI(customRoutes, onReady);`

## Running models

The API defaults to locally-running models on your machine. There are no API keys required to get started, just make sure you have a model up and running on `localhost`:

- [Run your text model (via Ollama)](https://github.com/bennyschmidt/ragdoll#install-ollama)

- [Run your image model (via Stable Diffusion)](https://github.com/bennyschmidt/ragdoll#install-stable-diffusion)

Ragdoll also works without an image model, it will fall back to text-only if there isn't one running at the host specified in the `.env`.

-----

## Simple Node.js multi-process

This project was bootstrapped with [Simple Node.js Multi-process](https://github.com/bennyschmidt/simple-node-multiprocess).

###  A super simple Node.js multi-process API setup:

 - Parallelize your API
 - Simple boilerplate to get started
 - Deploy 1 app over a single port

### Try it

`npm start`

`http://localhost:8000/v1/todos`

### How it works

A very simple server recursively handles requests.

On load, the server is treated as a "primary" node that forks 1 copy of itself for every CPU available.

The copies run the same logic in `index.js` in parallel as needed, each listening for `GET` and `POST` requests (in this example).
That means if you run this on a machine with an 8-core CPU, the first instance will spawn 7 other copies, and manage all of their lifecycle events (`onExit` etc.).

**Note that "multi-process" is not the same as "multi-threaded"**

> The main difference is that when resource requirements are low, multiple processes can still run on a single CPU core thread, especially if the OS is doing something else more expensive than what your app is doing. But if your app is the hungriest for CPU on that machine, it will spread the work across more cores.

> There's no guarantee that it will run 1 process per core until you start to push the machine to its limit - at that point each process would work in its own core. That's the point of limiting `numCPUs` to the number of CPU cores available. It's pretty graceful, as it's like using the OS as a load balancer. Of course, Node.js can scale and run many more processes in parallel than the number of available CPU cores, but it isn't recommended for a few reasons.

> The effects of heavy traffic, DDoS attacks, and uncaught errors are minimized by handing off excess work to available workers

> Non-blocking IO: The first tab (using Worker #3) is sending an unhandled erroneous request that causes the process to hang, while the second tab is still able to use the API via another worker (Worker #2)

### What are use cases for doing it this way?

**When you want CPU-bound instances in the cloud**

It's more efficient to run a single project served over a single port that manages its own resources ("vertical scaling"), rather than using platform tools to scale out copies the moment you need more resources ("horizontal scaling"). In a cloud platform like AWS or GCP, you can allocate up to something like 96 CPUs per instance. With an API cluster designed in this way, you can take full advantage of what these cloud platforms offer and cut a lot of unnecessary costs.

**It's cheap, easy, light, and fast - so why not?**

This is just a native Node.js implementation (0 dependencies) derived from their documented cluster example, set up for scale. I appreciate the power and flexibility that Node.js comes with out of the box: When resource requirements are low, it can naturally fall back to just using 1 worker to handle requests, and only when web traffic intensifies do other workers go online, taking on the excess requests.

### "Sounds cool, but I like Express.js" or "I need WebSockets"

This ships with a basic API framework reminiscient of Vercel's `api/` directory with default function exports. If you want to use a specific API framework like Express, replace all the code in `/api/index.js` with your Express router and framework entry (your `app.get()`, `app.post()`, etc. handlers would go here). For a WebSockets server, your `ApiGateway` would need to be modified to support message passing instead of HTTP requests. Other than that, it can work with either library.

- Express.js Example (TBD)

- Socket.io Example (TBD)

### "Cool Node.js demo... but I need more framework features to manage multiple backend services, multiple front-end applications, DB migrations, etc. - without it being monolithic. Can I do that in Node?"

Check out [node-web-framework](https://github.com/bennyschmidt/node-web-framework): Component-based full-stack Node.js web framework that supports both HTTP REST APIs & namespaced WebSocket services by default.

You can optionally add a [data layer](https://github.com/bennyschmidt/node-web-framework#data-storage-optional) and/or [front-end](https://github.com/bennyschmidt/node-service-core#full-stack-example) to have a Rails- or Django-like "framework experience" while preserving the scaling features of a Node.js service-oriented setup.
