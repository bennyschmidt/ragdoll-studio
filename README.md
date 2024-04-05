# Ragdoll Studio

Web apps and libraries for interacting with [Ragdoll](https://github.com/bennyschmidt/ragdoll).

#### Demo

https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/c090d262-be06-48e9-8c70-3ca8ba4c557c

#### Focus (RAG based learning)

https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/cd7464fe-9984-4ae3-8911-1da104f68e8c

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
