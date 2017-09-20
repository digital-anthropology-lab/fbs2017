## Multichain

Multichain is a blockchain platform.

### Install

For macOS you will need to compile from source and move binaries to your PATH.  

https://www.multichain.com/download-install/

### Create Multichain instance

Script provided for creating a blockchain instance [based on this](https://github.com/scoin/multichain-node/blob/development/test/run). Allows configurable chain name and rpc port.

`./run --port=6602 --name=chain001`  
Creates new multichain blockchain instance with RPC port (`--port`) and chain name (`--name`). Sets rpc username and password to `--name`.

### Node.js/Express app
Creates web interface using Node.js and Express on the server. Allows for interacting with multichain on server side using RPC calls

### Dependencies:
* Node.js (>= v6)
* See package.json

### multichain-node

Using [multichain-node](https://github.com/scoin/multichain-node) package as interface to the multichain using Node.js. For multichain-node documentation see the following files:
1. [test/test.js](https://github.com/scoin/multichain-node/blob/development/test/test.js) for implementation
2. [lib/commands.js](https://github.com/scoin/multichain-node/blob/development/lib/commands.js) for list of all api calls and parameters

### Notes
- The multichain port and the multichain RPC port are different. multichain-node needs RPC port.
