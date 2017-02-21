ckb-cloud
=========

Control your keyboard colours from the cloud!

This project aims to make it possible to control the key-colours of keyboards supported by [ckb-next](https://github.com/mattanger/ckb-next) from a network.
It can either be used from within a local network, or connected to a ckb-cloud instance running on a remote server.

This is mainly useful for notifying you of events via your keyboard's key colours (e.g. got a new Mail? Set _M_ to _red_!)

Note that this project is not intended to replace keyboard-wide effects like the colourful rainbow or ripple-effects, but only enables setting effects on single keys.
That way, functionality is clearly divided between ckb-next and ckb-cloud. ckb-cloud for notifications, ckb-next for anything else.

## Current state of the project
This project is currently under development and by no means very usable in its current state.
The API will be changed to be properly RESTful.
The server will be able to be configured to run in local or cloud-mode.

In local-mode, it will accept HTTP-requests and translate and redirect them to the ckb-cloud-client-plugin with optional authentication via HTTP-Basic and possibly others.

In cloud-mode, authentication is required and instead of sending the commands directly to a keyboard, clients in local-mode can connect to the from within a network.
The cloud-server will send incoming requests based on user-ids to connected local-mode servers, which send the requests to the keyboard.

That way, the key's colours can be controlled from anywhere on the internet (assuming the requests are authenticated), in a way that you can connect your keyboard with web-services providing freely configurable POST-notifications to HTTP-endpoints.

The client-component is currently under development at [this repository](https://github.com/cmd-johnson/ckb-next) and strives to be merged back into the [ckb-next core](https://github.com/mattanger/ckb-next) as soon as ckb-cloud is considered stable.

## Installation
Clone the repository and run `yarn install` (`npm install` should work just as well).
After the installation has finished, run `node index.js` to start the server.

## Connecting with ckb
Currently, this server relies on the ckb-cloud plugin available in [this repository](https://github.com/cmd-johnson/ckb-next).
Clone the `plugin/cloud` branch and follow the build-instructions in the README.

After you have ckb-next built and running, add the `ckb-cloud client`-animation to one of your profiles.
You don't have to (and actually shouldn't) change the default settings for now.

You already should see some output on the server's console, stating that a client has connected.

## Usage
Currently, ckb-cloud features the following commands:

### Clients

#### Get connected clients
```
# List the client_ids of all connected clients
curl http://localhost:3007/clients/
```
Note that the opening and closing curly braces of the client's UUID need to be URL-encoded when performing requests where the UUID is part of the URL.
`{` URL-encoded is `%7B`, `}` becomes `%7D`.

#### Get details on a single client
```
# Get more details on a single client
curl http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/
```

### Keys

#### List available keys
```
# List all available keys for the given client
curl http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/
```

#### Get details on a single key
```
# Get more details on the escape-key
curl http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/
```

### Key effects

#### Get all effects active on a key
```
# Get a list of all active effects on the escape-key
curl http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/effects/
```
Note that the opening and closing curly braces of the effects's UUID need to be URL-encoded when performing requests where the UUID is part of the URL.
`{` URL-encoded is `%7B`, `}` becomes `%7D`.

#### Get details on a single active effect
```
# Get more details on an effect active on the escape-key
curl http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/effects/%7Bd51132a9-7034-4e51-beb0-5f89d3a5b972%7D/
```

#### Set a key's colour
```
# Set the escape-key to red
curl -X POST -H "Content-Type: application/json" -d '{"effect":"color","color":"#f00"}' http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/effects/
```
This command accepts any key listed under `/keys` and colors in various formats:
\#RGB, #RRGGBB, #AARRGGBB and specifying colour names like 'red' or 'green' are all supported.

#### Set a key to animate its colour over time
```
# Change the escape-key's color first to red and then animate it to green over a
# period of 3 seconds, repeating the animation two times (making for a total of
# 6 seconds animation time)
curl -X POST -H "Content-Type: application/json" \
    -d '{"effect":"gradient","color_stops":[{"position":0,"color":"red"},
         {"position":1,"color":"green"}],"duration":3,"loop_count":2}' \
    http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/effects/
```
The colour gradient is specified via the `color_stops`-array.
Each element consists of a position within the gradient (between `0.0` and `1.0`) and a colour.
Supported colour-formats are the same as mentioned above.

The gradient's phase changes from `0.0` to `1.0` over the duration specified when the command was sent.
The colour for the current time-step is calculated by linearly interpolating between the colours of the stops closest to the current phase-value.

The `duration` and `loop_count` parameters are optional and default both to 1.
Setting the `loop_count` to `0` makes the animation continue ad infinitum, or at least until the key is set to some other effect or gets cleared.

#### Clear a key's active effect
```
# Clear a single effect on the escape-key
curl -X DELETE -H http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/effects/%7Bd51132a9-7034-4e51-beb0-5f89d3a5b972%7D/
```

#### Clear all effects active on a key
```
# Clear any active effect on the escape-key
curl -X DELETE http://localhost:3007/clients/%7Bc54485aa-d120-46ca-9ba4-8f8bdaee08ef%7D/keys/esc/effects/
```
