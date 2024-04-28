# Ragdoll Studio

Web apps and libraries for interacting with [Ragdoll](https://github.com/bennyschmidt/ragdoll).

![product](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/84a5f7d3-9178-41bc-9bb4-265e4399a651)

## Features

Go beyond fine-tuning to produce flawless creative deliverables, rich multimedia, and engaging experiences.

### 1. Story Mode

Create and chat with characters that have scoped knowledge and distinct personalities.

Define their source of knowledge at a URL (e.g. Wikipedia page).

✨ ***Focus:** Upload additional documents to extend their knowledge.*

https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/cd7464fe-9984-4ae3-8911-1da104f68e8c

> The above video shows the case of a storyteller (Arthas Menethil, from *World of Warcraft*) who was created with limited knowledge, so he doesn't know as much as he should. This demonstration shows the ragdoll's knowledge being extended by uploading a text file containing additional information about his domain. After that, he knows and is able to talk about the new information and even renders images that are more on-brand. 

### 2. Vector Mode

Produce vector art (icons, logos, animations) in a specific style.

✨ ***Inspire**: Upload source images to inspire compositional features of a new image.*

### 3. Raster Mode

Produce raster art (photos, illustrations, concept art) in a specific style.

✨ ***Inspire**: Upload source images to inspire compositional features of a new image.*

https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/20427f0b-7e64-449d-b9e2-d881f867dd5a

> The above video shows how Ragdoll uses Stable Diffusion's img2img feature through the lens of different ragdolls to produce a variety of different image results. Optionally check "True to original" to keep the overall structure of the source image in place while still applying stylistic attributes of the ragdoll. The initial `artStyle` set when creating a ragoll defines the overall kind of image (photorealistic, concept art, pixel art, etc.) but because the ragdoll prompts `img2img` itself, some of its own speech patterns can influence the resulting image too.  
 
### 4. Video Mode

Produce videos (shows, podcasts, cinematics, cutscenes, films, animations) of a certain style or genre.

✨ ***Stage**: Upload an image to set the stage for a new video clip.*

*Coming soon!*

### 5. Audio Mode

Produce audio (music, sound effects, speech) of a certain style or genre.

✨ ***Cue**: Upload an audio clip to cue a specific style or sound.*

*Coming soon!*

### 6. 3D Mode

Produce 3D objects (scenes, characters, animations) in a specific style.

✨ ***Inspire**: Upload source 3D objects to inspire compositional features of a new one.*

*Coming soon!*

### 7. Export 

✨ ***Download Content:** When you're happy with a result, download your generated content in a variety of formats, or clear the channel to start over.*

![download](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/eea000cb-bd84-4dd6-b4a9-a463409a62f7)

> The above image shows the Download button highlighted in the bottom-right. The output format depends on which app mode you're currently in, see [#14](https://github.com/bennyschmidt/ragdoll-studio/issues/14).

✨ ***Community Site:** Export & publish collections of ragdolls, or "casts", and download others.*

![community-site](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/3dd6e058-957b-4947-a0d8-09c93152bc93)

> The above image shows casts of characters, or [dolls](https://ragdoll-studio.vercel.app/dolls), on the [community site](https://ragdoll-studio.vercel.app/). If you want to share characters you've created or download others, you can do so through sharing casts. There's also an [apps](https://ragdoll-studio.vercel.app/) section that's coming soon for the purpose of sharing different apps created with the Ragdoll software (using Ragdoll [core](https://github.com/bennyschmidt/ragdoll) and/or the [node](https://www.npmjs.com/package/ragdoll-api) or [react](https://www.npmjs.com/package/ragdoll-react) libraries).

## Installation

1. Configure the [API](https://github.com/bennyschmidt/ragdoll-studio/tree/master/ragdoll-api)

`cd ragdoll-api`

See the API `README.md`.

2. Install dependencies

`nvm use && npm i`

3. Start the server

`npm start`

You should see something like this:

```
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
A worker has spawned.
Cluster is online at http://localhost:8000
Worker online (#1).
Worker online (#2).
Worker online (#3).
Worker online (#4).
Worker online (#5).
Worker (#1) is listening for messages.
Worker (#3) is listening for messages.
Worker (#2) is listening for messages.
Worker (#5) is listening for messages.
Worker online (#6).
Worker online (#8).
Worker (#4) is listening for messages.
Worker online (#7).
Worker (#6) is listening for messages.
Worker (#8) is listening for messages.
Worker (#7) is listening for messages.
```

This means the server is running and handling concurrent requests on all CPU cores. 

Ragdoll API is now listening on `http://localhost:8000/`.

4. Set up the [front-end](https://github.com/bennyschmidt/ragdoll-studio/tree/master/ragdoll-react)

`cd ../ragdoll-react`

See the React `README.md`.

`nvm use && npm i`

5. Start the front-end

`npm start`

You should see the default UI:

![Ragdoll UI](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/4113aa84-83e8-4807-b651-a57090c3c587)

-----

## Usage

#### Ragdoll app

[How to use the app](https://github.com/bennyschmidt/ragdoll-studio/blob/master/ragdoll-react/README.md)

#### Ragdoll API

[How to run the API](https://github.com/bennyschmidt/ragdoll-studio/blob/master/ragdoll-api/README.md)

-----

## Use Cases

See [CaseStudies.md](./CaseStudies.md).
