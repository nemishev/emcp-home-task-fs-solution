## SETUP

1. Run the app via the `docker-compose up -d` command

2. Open the browser and type in `http://localhost` the access the ReactJs based frontend client.

3. The app is ready to accept `ping` commands. Click on the `Ping` button to receive a `pong` message.

## Actors

- `redis` servce provides a convinient Redis client wrapper service with `retry` mechanisms and smart stream data fetching.

- `ping` service. Exposes the `api/ping` endpoint and pushes `ping` messages to the stream.

- `pong` service. Subscribes to `ping` stream and pushes `pong` messages to the `pong` stream.

- `streaming` servce. Acts as an abstraction on top of Redis streams. Provides push/pull methods for dealing with streams.

- `notifications` service. Provides a WebSocket gateway service. Subscribes to `pong` stream and broadcasts `pong` messages to all connected clients.

## Highlights

- All the client/server communication happens through an nginx reverse proxy that adds the following benefits:

  - Sucurity: the real backend address is hidden from clients, Same-Origin policy applied.
  - Performance: Nginx load balancing could be applied

- Heavy use of async generators and RxJs Observables to deal with continuous stream of ping/pong messages.

- `ping`, `pong` and `notifications` services are completelly decoupled and only use streaming for communication purposes.
