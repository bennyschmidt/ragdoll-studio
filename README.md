# Ragdoll Studio

Web apps and libraries for interacting with [Ragdoll](https://github.com/bennyschmidt/ragdoll).

https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/dcfdbb68-3d3c-4bfe-8190-fa47db2e55ca

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

This means the server is running and handling concurrent requests on all CPU cores. Ragdoll API is now listening on `http://localhost:8000/`.

4. Set up the [front-end](https://github.com/bennyschmidt/ragdoll-studio/tree/master/ragdoll-react)

`cd ../ragdoll-react`

See the React `README.md`.

`nvm use && npm i`

5. Start the front-end

`npm start`

You should see the default UI:

![Screenshot from 2024-03-28 19-34-58](https://github.com/bennyschmidt/ragdoll-studio/assets/45407493/d81fdccf-3ad2-45d6-bd03-bf667cc25ab0)

-----

## Usage

#### Ragdoll app

[How to use the app](https://github.com/bennyschmidt/ragdoll-studio/blob/master/ragdoll-react/README.md)

#### Ragdoll API

[How to run the API](https://github.com/bennyschmidt/ragdoll-studio/blob/master/ragdoll-api/README.md)

-----

## Comparing Ragdoll Studio to other products

See [TolkienTest.md](./TolkienTest.md).

-----

## Use Cases

See [CaseStudies.md](./CaseStudies.md).
