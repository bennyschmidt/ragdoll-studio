# Arthas.AI

A web app for interacting with [ArthasGPT](https://github.com/bennyschmidt/ArthasGPT).

https://github.com/bennyschmidt/Arthas.AI/assets/45407493/dcfdbb68-3d3c-4bfe-8190-fa47db2e55ca

## Installation

1. Configure the [API](https://github.com/bennyschmidt/Arthas.AI/tree/master/arthas-api)

`cd arthas-api`

See the API `README.md`. You will need an OpenAI API key to get started.

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

This means the server is running and handling concurrent requests on all CPU cores

4. Set up the [front-end](https://github.com/bennyschmidt/Arthas.AI/tree/master/arthas-react)

`cd ../arthas-react`

See the React `README.md`.

`nvm use && npm i`

5. Start the front-end

`npm start`

You should see the default UI:

![image](https://github.com/bennyschmidt/Arthas.AI/assets/45407493/d1980924-7a50-408e-b5c6-aa586743d1d5)

-----

## Usage

#### Arthas app

[How to use the app](https://github.com/bennyschmidt/Arthas.AI/blob/master/arthas-react/README.md)

#### Arthas API 

[How to run the API](https://github.com/bennyschmidt/Arthas.AI/blob/master/arthas-api/README.md)

-----

## Comparing Arthas.AI to other products

See [TolkienTest.md](./TolkienTest.md).

-----

## Use Cases

See [CaseStudies.md](./CaseStudies.md).
